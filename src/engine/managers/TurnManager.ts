import {
  Game,
  Player,
  GamePhase,
  TurnState,
  ScoringMethod,
  PriorityReason,
  Battlefield,
  GameCard
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { RunePoolManager } from './RunePoolManager';
import { ScoringManager } from './ScoringManager';
import { PriorityManager } from './PriorityManager';
import { BattlefieldManager } from './BattlefieldManager';
import { ChainSystem } from '../systems/ChainSystem';
import { CombatManager } from '../systems/CombatManager';
import { CardScriptRuntime } from '../scripting/CardScriptRuntime';
import type { CardScript } from '../scripting/types/CardScriptTypes';
import { ActionExecutor } from '../actions/ActionExecutor';
import { DrawCardAction, ReadyAllCardsAction, RemoveAllDamageAction } from '../actions/concrete';
import { logger } from '@/utils/logger';

/**
 * Manages Riftbound's specific turn structure and phase transitions
 */
export class TurnManager {
  private runePoolManager: RunePoolManager;
  private scoringManager: ScoringManager;
  private priorityManager: PriorityManager;
  private battlefieldManager: BattlefieldManager;
  private chainSystem: ChainSystem;
  private combatManager: CombatManager;
  private scriptRuntime: CardScriptRuntime;
  private readonly executor: ActionExecutor; // ⭐ V3 ActionExecutor (mandatory)

  constructor(scriptRuntime: CardScriptRuntime, executor: ActionExecutor) {
    this.runePoolManager = new RunePoolManager();
    this.scoringManager = new ScoringManager();
    this.priorityManager = new PriorityManager();
    this.battlefieldManager = new BattlefieldManager();
    this.chainSystem = new ChainSystem();
    this.scriptRuntime = scriptRuntime;
    this.executor = executor;
    this.combatManager = new CombatManager(this.priorityManager, scriptRuntime);
  }

  /**
   * Start a new turn for the current player
   */
  async startTurn(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) {
      throw new Error('No current player found');
    }

    logger.info(`TurnManager: Starting turn ${game.round} for player ${currentPlayer.name}`);

    // Reset priority for new turn
    this.priorityManager.resetForNewTurn(game);

    // Reset scoring flags for new turn
    this.scoringManager.resetTurnScoring();

    // Emit turn start event
    await eventBus.emit(GameEventFactory.createTurnStartEvent(
      game.id,
      currentPlayer.id,
      game.round
    ));

    // Execute onTurnStart hooks for current player's cards
    await this.executeHooksForPlayerCards(game, currentPlayer, 'onTurnStart');

    // Reset turn state
    game.turnState = TurnState.NEUTRAL_OPEN;

    // Start with Awaken Phase
    game.phase = GamePhase.AWAKEN;
    await this.executeAwakenPhase(game);
  }

  /**
   * Advance to the next phase
   */
  async nextPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    const currentPhase = game.phase;
    let nextPhase: GamePhase;

    // Determine next phase based on current phase
    switch (currentPhase) {
      case GamePhase.AWAKEN:
        nextPhase = GamePhase.BEGINNING;
        break;
      case GamePhase.BEGINNING:
        nextPhase = GamePhase.CHANNEL;
        break;
      case GamePhase.CHANNEL:
        nextPhase = GamePhase.DRAW;
        break;
      case GamePhase.DRAW:
        nextPhase = GamePhase.ACTION;
        break;
      case GamePhase.ACTION:
        nextPhase = GamePhase.ENDING;
        break;
      case GamePhase.ENDING:
        nextPhase = GamePhase.EXPIRATION;
        break;
      case GamePhase.EXPIRATION:
        nextPhase = GamePhase.CLEANUP;
        break;
      case GamePhase.CLEANUP:
        // End turn and move to next player
        await this.endTurn(game);
        return;
      default:
        throw new Error(`Unknown phase: ${currentPhase}`);
    }

    // Emit phase change event
    await eventBus.emit(GameEventFactory.createPhaseChangeEvent(
      game.id,
      currentPlayer.id,
      currentPhase,
      nextPhase
    ));

    game.phase = nextPhase;

    // Execute onPhaseChange hooks for all cards in game
    await this.executeHooksForAllCards(game, 'onPhaseChange', {
      from: currentPhase,
      to: nextPhase,
    });

    // Execute the new phase
    await this.executePhase(game, nextPhase);
  }

  /**
   * End the current turn and pass to next player
   */
  async endTurn(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.info(`TurnManager: Ending turn ${game.round} for player ${currentPlayer.name}`);

    // Execute onTurnEnd hooks for current player's cards
    await this.executeHooksForPlayerCards(game, currentPlayer, 'onTurnEnd');

    // Emit turn end event
    await eventBus.emit(GameEventFactory.createTurnEndEvent(
      game.id,
      currentPlayer.id,
      game.round
    ));

    // Switch to next player
    game.currentPlayerIndex = game.currentPlayerIndex === 0 ? 1 : 0;

    // Increment round when we return to first player
    if (game.currentPlayerIndex === 0) {
      game.round++;
    }

    // Start next player's turn
    await this.startTurn(game);
  }

  /**
   * Execute a specific phase
   */
  private async executePhase(game: Game, phase: GamePhase): Promise<void> {
    switch (phase) {
      case GamePhase.AWAKEN:
        await this.executeAwakenPhase(game);
        break;
      case GamePhase.BEGINNING:
        await this.executeBeginningPhase(game);
        break;
      case GamePhase.CHANNEL:
        await this.executeChannelPhase(game);
        break;
      case GamePhase.DRAW:
        await this.executeDrawPhase(game);
        break;
      case GamePhase.ACTION:
        await this.executeActionPhase(game);
        break;
      case GamePhase.ENDING:
        await this.executeEndingPhase(game);
        break;
      case GamePhase.EXPIRATION:
        await this.executeExpirationPhase(game);
        break;
      case GamePhase.CLEANUP:
        await this.executeCleanupPhase(game);
        break;
    }
  }

  /**
   * Awaken Phase: Ready all cards the turn player controls
   */
  private async executeAwakenPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Awaken Phase for ${currentPlayer.name}`);

    // Ready all Game Objects that the turn player controls
    await this.awakenAllCards(game, currentPlayer.id);
  }

  /**
   * Beginning Phase: Handle scoring and triggers
   */
  private async executeBeginningPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Beginning Phase for ${currentPlayer.name}`);

    // Beginning Step: "at the start" effects
    // TODO: Implement triggered abilities

    // Scoring Step: Check for Hold scoring
    await this.checkScoring(game, currentPlayer.id);
  }

  /**
   * Channel Phase: Channel runes from Rune Deck
   */
  private async executeChannelPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Channel Phase for ${currentPlayer.name}`);

    // Channel 2 runes (or 3 for second player's first turn)
    let runesToChannel = 2;
    if (game.round === 1 && game.currentPlayerIndex === 1) {
      runesToChannel = 3; // Second player gets extra rune first turn
    }

    await this.channelRunes(game, currentPlayer.id, runesToChannel);
  }

  /**
   * Draw Phase: Draw a card and clear rune pool
   */
  private async executeDrawPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Draw Phase for ${currentPlayer.name}`);

    // Draw 1 card
    await this.drawCard(game, currentPlayer.id);

    // Clear rune pool at end of draw phase
    await this.clearRunePool(game, currentPlayer.id);
  }

  /**
   * Action Phase: Open phase where player can take actions
   * This phase handles priority, showdowns, and all discretionary actions
   */
  private async executeActionPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Action Phase for ${currentPlayer.name}`);

    // Reset priority for Action Phase
    this.priorityManager.resetForActionPhase(game);

    // Set initial priority to current player
    await this.priorityManager.assignPriority(game, currentPlayer.id, PriorityReason.ACTION_PHASE);

    // The Action Phase runs until:
    // 1. Player explicitly passes priority to end phase
    // 2. No more actions can be taken
    // This will be controlled by the GameManager when actions are submitted
    // For now, we don't auto-advance - phase remains open
  }

  /**
   * Handle action execution within Action Phase
   * Called by GameManager when player submits an action
   */
  async executeActionPhaseAction(game: Game, playerId: string, action: string, context: any): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];

    // PASS_PRIORITY can be called by any player at any time (e.g., during Chain)
    if (action !== 'PASS_PRIORITY') {
      if (!currentPlayer || playerId !== currentPlayer.id) {
        throw new Error('Not player\'s turn');
      }

      if (game.phase !== GamePhase.ACTION) {
        throw new Error('Not in Action Phase');
      }
    }

    logger.debug(`TurnManager: Executing action ${action} for ${playerId}`);

    // Execute the action
    switch (action) {
      case 'STANDARD_MOVE':
        await this.handleStandardMove(game, context);
        break;
      case 'PLAY_CARD':
        await this.handlePlayCard(game, context);
        break;
      case 'ACTIVATE_ABILITY':
        await this.handleActivateAbility(game, context);
        break;
      case 'HIDE_CARD':
        await this.handleHideCard(game, context);
        break;
      case 'PASS_PRIORITY':
        await this.handlePassPriority(game);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // After any action, check for triggered events
    await this.checkTriggeredEvents(game);
  }

  /**
   * Pass priority (does NOT automatically advance phase - caller decides)
   */
  private async handlePassPriority(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: ${currentPlayer.name} passed priority`);

    // If current player doesn't have priority but it's their turn, assign it first
    if (!this.priorityManager.hasPriority(game, currentPlayer.id)) {
      logger.debug(`TurnManager: Player ${currentPlayer.name} doesn't have priority yet, assigning it`);
      await this.priorityManager.assignPriority(game, currentPlayer.id, PriorityReason.ACTION_PHASE);
    }

    // Pass priority using PriorityManager
    await this.priorityManager.passPriority(game, currentPlayer.id);

    // Note: Caller (GameManager) should check hasPendingShowdowns/hasPendingChainItems
    // and decide whether to call nextPhase()
  }

  /**
   * Handle Standard Move action and potential Showdown initiation
   */
  private async handleStandardMove(game: Game, context: { unitId: string; toBattlefield: string }): Promise<void> {
    const { unitId, toBattlefield } = context;
    const currentPlayer = game.players[game.currentPlayerIndex];

    logger.debug(`TurnManager: Moving unit ${unitId} to battlefield ${toBattlefield}`);

    // Execute the move using BattlefieldManager
    await this.battlefieldManager.standardMove(game, currentPlayer.id, unitId, toBattlefield);

    // Check if this move triggers a Showdown
    const battlefield = game.battlefields.find(b => b.id === toBattlefield);
    if (battlefield && this.battlefieldManager.shouldTriggerShowdown(game, battlefield)) {
      await this.initiateShowdown(game, toBattlefield);
    }
  }

  /**
   * Handle Play Card action
   */
  private async handlePlayCard(game: Game, context: { cardId: string; targets?: string[] }): Promise<void> {
    const { cardId, targets } = context;

    logger.debug(`TurnManager: Playing card ${cardId}`);

    // This would delegate to appropriate card resolution logic
    await eventBus.emit(GameEventFactory.createCardPlayedEvent(
      game.id,
      game.players[game.currentPlayerIndex].id,
      cardId
    ));
  }

  /**
   * Handle Activate Ability action
   */
  private async handleActivateAbility(game: Game, context: { abilityId: string; targets?: string[] }): Promise<void> {
    const { abilityId, targets } = context;

    logger.debug(`TurnManager: Activating ability ${abilityId}`);

    // This would delegate to ability resolution logic
    await eventBus.emit(GameEventFactory.createAbilityActivatedEvent(
      game.id,
      game.players[game.currentPlayerIndex].id,
      abilityId,
      'source_card_id', // Would be determined by ability resolution
      context.targets
    ));
  }

  /**
   * Handle Hide Card action
   */
  private async handleHideCard(game: Game, context: { cardId: string; battlefieldId: string }): Promise<void> {
    const { cardId, battlefieldId } = context;
    const currentPlayer = game.players[game.currentPlayerIndex];

    logger.debug(`TurnManager: Hiding card ${cardId} at battlefield ${battlefieldId}`);

    // Execute hide using BattlefieldManager
    await this.battlefieldManager.hideCard(game, currentPlayer.id, cardId, battlefieldId);
  }

  /**
   * Initiate a Showdown as an event within Action Phase
   */
  private async initiateShowdown(game: Game, battlefieldId: string): Promise<void> {
    logger.info(`TurnManager: Initiating Showdown at battlefield ${battlefieldId}`);

    const focusPlayer = game.players[game.currentPlayerIndex].id;

    // Delegate to CombatManager
    await this.combatManager.initiateShowdown(game, battlefieldId, focusPlayer);

    // The Showdown will be handled by CombatManager
    // Players can now respond with spells/abilities
    // When all players pass, resolveShowdown will be called
  }

  /**
   * Resolve Showdown and return to Action Phase normal flow
   */
  private async resolveShowdown(game: Game): Promise<void> {
    logger.info('TurnManager: Resolving Showdown');

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    // Delegate to CombatManager
    await this.combatManager.resolveShowdown(game);

    // ⭐ V3: After combat resolution, remove all damage from units (RULES.md line 264)
    const removeDamageAction = new RemoveAllDamageAction(currentPlayer, {});
    const result = await this.executor.execute(removeDamageAction);

    if (result.success) {
      logger.debug(`TurnManager: Removed all damage after combat (V3)`);
    } else {
      logger.error(`TurnManager: Failed to remove damage after combat: ${result.error?.message}`);
    }

    // ⭐ V3: Process deaths after combat
    if (game.processDeaths) {
      await game.processDeaths();
    }

    // Player retains priority and can continue with more actions in Action Phase
    logger.debug('TurnManager: Showdown resolved, player can continue Action Phase');
  }

  /**
   * Assign priority to a player
   */
  private async assignPriority(game: Game, playerId: string, reason: PriorityReason = PriorityReason.ACTION_PHASE): Promise<void> {
    // Delegate to PriorityManager
    await this.priorityManager.assignPriority(game, playerId, reason);
  }

  /**
   * Check if there are pending Showdowns
   * PUBLIC: GameManager uses this to decide when to advance phases
   */
  public hasPendingShowdowns(game: Game): boolean {
    // Check if any battlefield has contested status or pending combat
    return game.battlefields.some(battlefield =>
      battlefield.contested ||
      this.battlefieldManager.shouldTriggerShowdown(game, battlefield)
    );
  }

  /**
   * Check if there are pending Chain items
   * PUBLIC: GameManager uses this to decide when to advance phases
   */
  public hasPendingChainItems(): boolean {
    // Check if ChainSystem has items to resolve
    return !this.chainSystem.isEmpty();
  }

  /**
   * Determine if a battlefield should trigger a Showdown
   */
  private shouldTriggerShowdown(game: Game, battlefield: Battlefield): boolean {
    // Delegate to BattlefieldManager
    return this.battlefieldManager.shouldTriggerShowdown(game, battlefield);
  }

  /**
   * Check for triggered events after an action
   */
  private async checkTriggeredEvents(game: Game): Promise<void> {
    // Check for triggered abilities, state-based effects, etc.
    // This would integrate with EffectSystem and ChainSystem
    logger.debug('TurnManager: Checking for triggered events');

    // If chain has items, resolve them
    if (!this.chainSystem.isEmpty()) {
      logger.info('TurnManager: Resolving chain after action');
      await this.chainSystem.resolve(game);
    }
  }

  /**
   * Ending Phase: "at the end of turn" effects
   */
  private async executeEndingPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Ending Phase for ${currentPlayer.name}`);

    // TODO: Implement "at the end of turn" triggered abilities
  }

  /**
   * Expiration Phase: Remove temporary effects and clear rune pool
   */
  private async executeExpirationPhase(game: Game): Promise<void> {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    logger.debug(`TurnManager: Executing Expiration Phase for ${currentPlayer.name}`);

    // ⭐ V3: Remove all damage from units using RemoveAllDamageAction
    const removeDamageAction = new RemoveAllDamageAction(currentPlayer, {});
    const result = await this.executor.execute(removeDamageAction);

    if (result.success) {
      logger.debug(`TurnManager: Removed all damage from units (V3)`);
    } else {
      logger.error(`TurnManager: Failed to remove damage: ${result.error?.message}`);
    }

    // TODO: V3 IMPLEMENTATION - Implement ModifierRegistry cleanup for modifiers with duration='turn'
    // This will automatically remove all temporary effects when we implement it
    logger.debug('TurnManager: TODO - Remove temporary effects via ModifierRegistry');

    // TODO: V3 IMPLEMENTATION - Implement token/temporary unit handling
    // Temporary units should be marked in metadata and removed here
    logger.debug('TurnManager: TODO - Remove temporary units');

    // Clear rune pool
    await this.clearRunePool(game, currentPlayer.id);
  }

  /**
   * Cleanup Phase: Final cleanup and check for new effects
   */
  private async executeCleanupPhase(game: Game): Promise<void> {
    logger.debug('TurnManager: Executing Cleanup Phase');

    // ⭐ V3: Process deaths (state-based action)
    if (game.processDeaths) {
      await game.processDeaths();
    }

    // TODO: V3 IMPLEMENTATION - Check for contested battlefields
    // This should be a query method on BattlefieldManager
    logger.debug('TurnManager: TODO - Check for contested battlefields');
  }

  // Helper methods

  private async awakenAllCards(game: Game, playerId: string): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return;

    // ⭐ V3: Use ReadyAllCardsAction
    const readyAction = new ReadyAllCardsAction(player, {});
    const result = await this.executor.execute(readyAction);

    if (result.success) {
      logger.debug(`TurnManager: Readied all cards for player ${playerId} (V3)`);
    } else {
      logger.error(`TurnManager: Failed to ready cards: ${result.error?.message}`);
    }
  }

  private async checkScoring(game: Game, playerId: string): Promise<void> {
    // Check each battlefield for Hold scoring
    for (const battlefield of game.battlefields) {
      if (battlefield.controller === playerId) {
        await this.scoringManager.checkHoldScoring(game, playerId, battlefield.id);
      }
    }
  }

  private async channelRunes(game: Game, playerId: string, count: number): Promise<void> {
    await this.runePoolManager.channelRunes(game, playerId, count);
  }

  private async drawCard(game: Game, playerId: string): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return;

    // ⭐ V3: Use DrawCardAction
    const drawAction = new DrawCardAction(player, { amount: 1 });
    const result = await this.executor.execute(drawAction);

    if (result.success) {
      logger.debug(`TurnManager: Player ${playerId} drew a card (V3)`);
    } else {
      logger.error(`TurnManager: Failed to draw card: ${result.error?.message}`);
    }
  }

  private async clearRunePool(game: Game, playerId: string): Promise<void> {
    await this.runePoolManager.clearRunePool(game, playerId);
  }

  /**
   * Execute a hook for all cards owned by a specific player
   */
  private async executeHooksForPlayerCards(
    game: Game,
    player: Player,
    hookName: keyof CardScript,
    additionalContext?: any
  ): Promise<void> {
    // Skip hook execution if scriptRuntime not available
    if (!this.scriptRuntime) {
      return;
    }

    // Collect all cards the player controls across all zones
    const allCards: GameCard[] = [
      ...player.zones.hand,
      ...player.zones.base,
      ...player.zones.championZone,
      ...player.zones.runes,
      ...this.getPlayerUnitsOnBattlefields(game, player.id),
    ];

    for (const card of allCards) {
      try {
        // CardScriptRuntime.executeHook handles loading the script, checking the hook, and building context
        await this.scriptRuntime.executeHook(hookName as any, card as any, game, {
          ...additionalContext,
        });
      } catch (error) {
        // Script not found or hook execution failed - log warning but continue
        logger.warn(`TurnManager: Failed to execute ${String(hookName)} for card ${card.cardId}:`, error);
      }
    }
  }

  /**
   * Execute a hook for all cards in the game
   */
  private async executeHooksForAllCards(
    game: Game,
    hookName: keyof CardScript,
    additionalContext?: any
  ): Promise<void> {
    for (const player of game.players) {
      await this.executeHooksForPlayerCards(game, player, hookName, additionalContext);
    }
  }

  /**
   * Get all units controlled by a player across all battlefields
   */
  private getPlayerUnitsOnBattlefields(game: Game, playerId: string): GameCard[] {
    const units: GameCard[] = [];

    for (const battlefield of game.battlefields) {
      if (battlefield.units) {
        for (const unit of battlefield.units) {
          if (unit.controllerId === playerId) {
            units.push(unit);
          }
        }
      }
    }

    return units;
  }

}

// Note: Global turn manager instance cannot be created here anymore
// because it requires CardScriptRuntime dependency.
// Create it in the code that initializes the runtime.