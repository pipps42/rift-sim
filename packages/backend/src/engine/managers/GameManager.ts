import { Game, Player, Deck, GameStatus, GamePhase, TurnState, GameCard, CardType } from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { DeckValidator } from '../validators/DeckValidator';
import { GameSetup } from '../setup/GameSetup';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { CardStorage } from '../storage/CardStorage';
import { HistoryQueryAPI } from '../history/HistoryQueryAPI';
import { CardStateScanner } from '../scanning/CardStateScanner';
import { CardScriptRuntime } from '../scripting/CardScriptRuntime';
import { ModifierRegistry } from '../actions/ModifierRegistry';
import { ActionExecutor } from '../actions/ActionExecutor';
import { TurnManager } from './TurnManager';
import { SpendEnergyAction, SpendPowerAction, PlayCardAction, MoveUnitAction, HideCardAction } from '../actions/concrete';
import type { ScanDelta, ActivatedAbilityInfo } from '../scanning/types/ScanTypes';
import { TargetingSystem } from '../systems/TargetingSystem';
import type { Target } from '@/types/game';
import { PrismaClient } from '@/generated/prisma';
import { createGameCard } from '@/utils/cardHelpers';
import { CardFactory } from '@/data/CardFactory';

/**
 * Central orchestrator for all Riftbound game operations
 * Manages game lifecycle, validation, and coordination between systems
 */
export class GameManager {
  private games: Map<string, Game> = new Map();
  private deckValidator: DeckValidator;
  private gameSetup: GameSetup;

  // ⭐ NEW: Scanner system for card state tracking
  private cardScriptRuntime: CardScriptRuntime;
  private modifierRegistry: ModifierRegistry;
  private scanners: Map<string, CardStateScanner> = new Map(); // One scanner per game

  // ⭐ NEW: V3 Action system - one executor per game
  private executors: Map<string, ActionExecutor> = new Map(); // One executor per game

  // ⭐ NEW: Turn management - one turn manager per game
  private turnManagers: Map<string, TurnManager> = new Map(); // One turn manager per game

  // ⭐ NEW: Targeting system for validation and resolution
  private targetingSystem: TargetingSystem;

  // ⭐ NEW: Database and card loading
  private prisma: PrismaClient;
  private cardFactory: CardFactory;

  // ⭐ NEW: Store decks for setup phase
  private gameDecks: Map<string, Deck[]> = new Map(); // Decks keyed by game ID

  constructor() {
    this.deckValidator = new DeckValidator();
    this.gameSetup = new GameSetup();
    this.targetingSystem = new TargetingSystem();

    // Initialize card script runtime
    this.cardScriptRuntime = new CardScriptRuntime({
      scriptsDir: 'src/cards',
      hotReload: false,
      debug: false,
      timeout: 5000,
    });

    // Initialize modifier registry (global for now, could be per-game)
    this.modifierRegistry = new ModifierRegistry();

    // Initialize Prisma client
    this.prisma = new PrismaClient();

    // Initialize card factory
    this.cardFactory = new CardFactory(this.prisma, this.cardScriptRuntime);
  }

  /**
   * Initialize the runtime (load scripts and card factory)
   */
  async initialize(): Promise<void> {
    await this.cardScriptRuntime.initialize();
    logger.info('GameManager: CardScriptRuntime initialized');

    await this.cardFactory.initialize();
    logger.info('GameManager: CardFactory initialized');
  }

  /**
   * ⭐ NEW: Load deck cards from database and populate player zones
   *
   * This converts a Deck (with DeckCard[] containing cardId + quantity)
   * into GameCard instances that populate the player's mainDeck and runeDeck zones.
   */
  private async loadDeckCards(deck: Deck, player: Player): Promise<void> {
    logger.debug(`GameManager: Loading deck cards for player ${player.name}`);

    // Load main deck cards
    for (const deckCard of deck.mainDeck) {
      // Get card definition from factory (which has cached all cards)
      const card = this.cardFactory.getCard(deckCard.cardId);

      if (!card) {
        logger.warn(`GameManager: Card ${deckCard.cardId} not found in factory, skipping`);
        continue;
      }

      // Create GameCard instances for the specified quantity
      for (let i = 0; i < deckCard.quantity; i++) {
        const gameCard = createGameCard(card, player, 'mainDeck');
        player.zones.mainDeck.push(gameCard);
      }
    }

    // Load rune deck cards
    for (const deckCard of deck.runeDeck) {
      const card = this.cardFactory.getCard(deckCard.cardId);

      if (!card) {
        logger.warn(`GameManager: Rune card ${deckCard.cardId} not found in factory, skipping`);
        continue;
      }

      // Create GameCard instances for the specified quantity
      for (let i = 0; i < deckCard.quantity; i++) {
        const gameCard = createGameCard(card, player, 'runeDeck');
        player.zones.runeDeck.push(gameCard);
      }
    }

    logger.info(
      `GameManager: Loaded ${player.zones.mainDeck.length} cards to main deck ` +
      `and ${player.zones.runeDeck.length} cards to rune deck for player ${player.name}`
    );
  }

  /**
   * Create a new Riftbound game
   */
  async createGame(players: Player[], decks: Deck[]): Promise<Game> {
    // Validate inputs
    if (players.length !== 2) {
      throw new Error('Riftbound games require exactly 2 players');
    }

    if (decks.length !== 2) {
      throw new Error('Must provide exactly 2 decks');
    }

    // Validate each deck
    for (let i = 0; i < decks.length; i++) {
      const validation = await this.deckValidator.validateDeck(decks[i]!);
      if (!validation.isValid) {
        throw new Error(`Deck ${i + 1} is invalid: ${validation.errors.join(', ')}`);
      }
    }

    // ⭐ NEW: Load deck cards into player zones BEFORE creating game
    await this.loadDeckCards(decks[0]!, players[0]!);
    await this.loadDeckCards(decks[1]!, players[1]!);

    // Initialize card storage system
    const storage = new CardStorage();

    // Create game instance (temporarily without historyQuery to avoid circular ref)
    const game: Game = {
      id: uuidv4(),
      players: [players[0]!, players[1]!],
      currentPlayerIndex: 0, // Will be randomized during setup
      phase: GamePhase.AWAKEN,
      turnState: TurnState.NEUTRAL_OPEN,
      round: 0,
      currentTurn: 1, // Absolute turn counter, starts at 1
      status: GameStatus.SETUP,
      battlefields: [],
      chain: [],
      storage, // Card storage for sharing data between cards
      history: [], // Game event history
      historyQuery: null as any, // Will be set below
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize history query API (needs game reference)
    game.historyQuery = new HistoryQueryAPI(game);

    // Bind processDeaths method to this game
    game.processDeaths = async () => {
      await this.processDeaths(game);
    };

    // Store game
    this.games.set(game.id, game);

    // ⭐ NEW: Store decks for setup phase
    this.gameDecks.set(game.id, decks);

    // ⭐ NEW: Create scanner for this game
    const scanner = new CardStateScanner(this.cardScriptRuntime, this.modifierRegistry, this.targetingSystem);
    this.scanners.set(game.id, scanner);

    // ⭐ NEW: Create V3 ActionExecutor for this game
    const executor = new ActionExecutor(game);
    this.executors.set(game.id, executor);

    // ⭐ NEW: Create TurnManager for this game
    const turnManager = new TurnManager(this.cardScriptRuntime, executor);
    this.turnManagers.set(game.id, turnManager);

    logger.info(`GameManager: Created game ${game.id} with players ${players.map(p => p.name).join(', ')}`);

    // Emit game creation event
    await eventBus.emit(GameEventFactory.createGameStartEvent(
      game.id,
      players.map(p => p.id)
    ));

    return game;
  }

  /**
   * Join an existing game (placeholder for multiplayer expansion)
   */
  async joinGame(gameId: string, player: Player): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error(`Cannot join game ${gameId}: game already started`);
    }

    // For now, Riftbound is 1v1 only
    throw new Error('Game joining not implemented - Riftbound is currently 1v1 only');
  }

  /**
   * Start a created game
   */
  async startGame(gameId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error(`Cannot start game ${gameId}: game status is ${game.status}`);
    }

    // Get decks for this game
    const decks = this.gameDecks.get(gameId);
    if (!decks) {
      throw new Error(`Game ${gameId}: decks not found - game may have already been started`);
    }

    logger.info(`GameManager: Starting game ${gameId}`);

    try {
      // Perform game setup (pass decks to extract chosen champion)
      await this.gameSetup.setupGame(game, decks);

      // Clean up decks from memory (no longer needed after setup)
      this.gameDecks.delete(gameId);

      // Update game status
      game.status = GameStatus.IN_PROGRESS;
      game.updatedAt = new Date();

      logger.info(`GameManager: Game ${gameId} started successfully`);

    } catch (error) {
      logger.error(`GameManager: Failed to start game ${gameId}:`, error);
      game.status = GameStatus.ABANDONED;
      throw error;
    }
  }

  /**
   * End a game
   */
  async endGame(gameId: string, reason: string, winnerId?: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status === GameStatus.FINISHED) {
      logger.warn(`GameManager: Game ${gameId} already finished`);
      return;
    }

    game.status = GameStatus.FINISHED;
    if (winnerId) {
      game.winner = winnerId;
    }
    game.updatedAt = new Date();

    logger.info(`GameManager: Game ${gameId} ended. Winner: ${winnerId || 'None'}, Reason: ${reason}`);

    // Emit game end event
    await eventBus.emit(GameEventFactory.createGameEndEvent(gameId, winnerId || '', reason));

    // ⭐ Clean up scanner, executor, turn manager, and decks
    this.scanners.delete(gameId);
    this.executors.delete(gameId);
    this.turnManagers.delete(gameId);
    this.gameDecks.delete(gameId); // Clean up decks if game ended during setup

    // Clean up game after some time (placeholder for proper cleanup)
    setTimeout(() => {
      this.games.delete(gameId);
      logger.debug(`GameManager: Cleaned up game ${gameId}`);
    }, 300000); // 5 minutes
  }

  /**
   * Get a game by ID
   */
  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  /**
   * Get all active games
   */
  getActiveGames(): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.status === GameStatus.IN_PROGRESS
    );
  }

  /**
   * Get games for a specific player
   */
  getPlayerGames(playerId: string): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.players.some(p => p.id === playerId)
    );
  }

  /**
   * Validate a deck for Riftbound rules
   */
  async validateDeck(deck: Deck): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    return await this.deckValidator.validateDeck(deck);
  }

  /**
   * Surrender a player from a game
   */
  async surrender(gameId: string, playerId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error(`Cannot surrender from game ${gameId}: game not in progress`);
    }

    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error(`Player ${playerId} not found in game ${gameId}`);
    }

    // Determine winner (the other player)
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    const winnerId = game.players[opponentIndex]!.id;

    await this.endGame(gameId, 'Surrender', winnerId);

    logger.info(`GameManager: Player ${playerId} surrendered from game ${gameId}`);
  }

  /**
   * Get game statistics
   */
  getStatistics(): {
    totalGames: number;
    activeGames: number;
    finishedGames: number;
    abandonedGames: number;
  } {
    const games = Array.from(this.games.values());

    return {
      totalGames: games.length,
      activeGames: games.filter(g => g.status === GameStatus.IN_PROGRESS).length,
      finishedGames: games.filter(g => g.status === GameStatus.FINISHED).length,
      abandonedGames: games.filter(g => g.status === GameStatus.ABANDONED).length
    };
  }

  /**
   * Check if a player can perform an action in a game
   */
  canPlayerAct(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== GameStatus.IN_PROGRESS) {
      return false;
    }

    // Check if it's the player's turn (simplified for now)
    const currentPlayer = game.players[game.currentPlayerIndex];
    return currentPlayer?.id === playerId;
  }

  /**
   * Update game state (for internal use by other managers)
   */
  updateGame(gameId: string, updates: Partial<Game>): void {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    Object.assign(game, updates, { updatedAt: new Date() });

    // ⭐ Trigger state scan after update
    this.onStateChanged(game).catch(err => {
      logger.error(`GameManager: Error scanning state after update:`, err);
    });
  }

  // ============================================================================
  // ⭐ NEW: CardStateScanner Integration
  // ============================================================================

  /**
   * Called after any state change to scan cards and notify UI
   */
  private async onStateChanged(game: Game): Promise<void> {
    const scanner = this.scanners.get(game.id);
    if (!scanner) {
      logger.warn(`GameManager: No scanner found for game ${game.id}`);
      return;
    }

    try {
      const delta = await scanner.scanGameState(game);

      if (delta.changed && delta.changes) {
        logger.debug(`GameManager: State scan found ${delta.changes.length} changes in game ${game.id}`);

        // TODO: Notify UI/clients about changes
        // For now, just log
        for (const change of delta.changes) {
          logger.debug(`  - ${change.type}: ${change.card.name}`);
        }
      }
    } catch (error) {
      logger.error(`GameManager: Error during state scan:`, error);
    }
  }

  /**
   * Get scanner for a game (for external queries)
   */
  getScanner(gameId: string): CardStateScanner | undefined {
    return this.scanners.get(gameId);
  }

  /**
   * Get ActionExecutor for a game (for executing V3 actions)
   */
  getExecutor(gameId: string): ActionExecutor | undefined {
    return this.executors.get(gameId);
  }

  /**
   * Query which cards are playable for a player
   */
  getPlayableCards(gameId: string, playerId: string): GameCard[] {
    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return [];
    }

    const results = scanner.getPlayableCards(playerId);
    return results.map(r => r.card);
  }

  /**
   * Query which cards have activatable abilities for a player
   */
  getActivatableCards(gameId: string, playerId: string): Array<{
    card: GameCard;
    abilities: ActivatedAbilityInfo[];
  }> {
    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return [];
    }

    const results = scanner.getActivatableCards(playerId);
    return results.map(r => ({
      card: r.card,
      abilities: r.abilities,
    }));
  }

  /**
   * ⭐ V3: Play a card from hand
   *
   * Delegates to PlayCardAction for costs + zone movement, then executes card scripts
   */
  async playCard(
    gameId: string,
    playerId: string,
    cardInstanceId: string,
    targets?: Target[]
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      return { success: false, error: 'Game is not in progress' };
    }

    // Find player
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, error: `Player ${playerId} not found` };
    }

    // Find card in hand
    const card = player.zones.hand.find(c => c.instanceId === cardInstanceId);
    if (!card) {
      return { success: false, error: `Card ${cardInstanceId} not found in hand` };
    }

    try {
      // Get ActionExecutor for this game
      const executor = this.executors.get(gameId);
      if (!executor) {
        return { success: false, error: 'Game executor not initialized' };
      }

      // ⭐ NEW: Load script early to get target requirements
      let script;
      try {
        const scriptId = card.scriptPath
          ? card.scriptPath.replace('cards/', '').replace('.ts', '')
          : card.cardId;
        script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);
      } catch (error) {
        // No script found - card has no scripted behavior
        script = null;
      }

      // ⭐ NEW: Validate and resolve targets if card has target requirements
      let resolvedTargets: any[] = [];
      if (script?.metadata?.targetRequirements && script.metadata.targetRequirements.length > 0) {
        const requirements = script.metadata.targetRequirements;
        const selectedTargets = targets || [];

        // Validate targets
        const validation = this.targetingSystem.validateTargets(
          game,
          playerId,
          requirements,
          selectedTargets
        );

        if (!validation.valid) {
          const errorMessages = validation.errors?.map(e => e.message).join(', ') || 'Invalid targets';
          return { success: false, error: errorMessages };
        }

        // Resolve targets (convert IDs to actual game objects)
        const resolved = this.targetingSystem.resolveTargets(game, selectedTargets);
        resolvedTargets = resolved.map(r => r.resolved);
      }

      // Delegate to PlayCardAction (handles cost payment + zone movement)
      const playActionData: { card: GameCard; targets?: any[] } = { card };
      if (targets) {
        playActionData.targets = targets;
      }
      const playAction = new PlayCardAction(player, playActionData);
      const result = await executor.execute(playAction);

      if (!result.success) {
        return {
          success: false,
          error: result.error?.message || 'Failed to play card'
        };
      }

      // Execute hooks based on card type
      if (script) {
        // ⭐ UPDATED: Pass resolved targets to context
        const context = await this.buildCardContext(game, player, card, script, resolvedTargets);

        // Execute onPlay hook (all cards)
        if (script.onPlay) {
          await this.cardScriptRuntime.executeHook('onPlay', card as any, game, context);
        }

        // Execute onEntersPlay hook (permanents only)
        if ((card.cardType === CardType.UNIT || card.cardType === CardType.CHAMPION || card.cardType === CardType.GEAR) && script.onEntersPlay) {
          await this.cardScriptRuntime.executeHook('onEntersPlay', card as any, game, context);
        }
      }

      // Trigger state change
      game.updatedAt = new Date();
      await this.onStateChanged(game);

      logger.info(`GameManager: Player ${playerId} played card ${card.name} in game ${gameId}`);

      return { success: true, data: { cardId: card.instanceId } };

    } catch (error) {
      logger.error(`GameManager: Error playing card:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * ⭐ V3: Move a unit between battlefields (Standard Move)
   *
   * Delegates to MoveUnitAction
   */
  async standardMove(
    gameId: string,
    playerId: string,
    unitInstanceId: string,
    toBattlefieldId: string
  ): Promise<{ success: boolean; error?: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      return { success: false, error: 'Game is not in progress' };
    }

    // Check if it's the player's turn
    if (!this.canPlayerAct(gameId, playerId)) {
      return { success: false, error: 'Not your turn' };
    }

    // Find player
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, error: `Player ${playerId} not found` };
    }

    // Find unit in game
    const unit = this.findCardInGame(game, unitInstanceId);
    if (!unit) {
      return { success: false, error: `Unit ${unitInstanceId} not found` };
    }

    // Verify ownership
    if (unit.ownerId !== playerId) {
      return { success: false, error: 'You do not own this unit' };
    }

    // Verify it's a unit or champion (only units can move)
    if (unit.cardType !== CardType.UNIT && unit.cardType !== CardType.CHAMPION && unit.cardType !== CardType.TOKEN) {
      return { success: false, error: 'Only units can move' };
    }

    try {
      // Get ActionExecutor
      const executor = this.executors.get(gameId);
      if (!executor) {
        return { success: false, error: 'Game executor not initialized' };
      }

      // Delegate to MoveUnitAction (handles validation + zone movement)
      const moveAction = new MoveUnitAction(player, {
        unit,
        destination: {
          type: 'battlefield',
          battlefieldId: toBattlefieldId
        }
      });

      const result = await executor.execute(moveAction);

      if (!result.success) {
        return {
          success: false,
          error: result.error?.message || 'Failed to move unit'
        };
      }

      // Execute onMove hook if script exists
      try {
        const scriptId = unit.scriptPath
          ? unit.scriptPath.replace('cards/', '').replace('.ts', '')
          : unit.cardId;
        const script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);

        if (script && (script as any).onMove) {
          const context = await this.buildCardContext(game, player, unit, script);
          await this.cardScriptRuntime.executeHook('onMove' as any, unit as any, game, context);
        }
      } catch (error) {
        // No script or no onMove hook - that's fine
      }

      // Trigger state change
      game.updatedAt = new Date();
      await this.onStateChanged(game);

      logger.info(`GameManager: Player ${playerId} moved unit ${unit.name} to battlefield ${toBattlefieldId}`);

      return { success: true };

    } catch (error) {
      logger.error(`GameManager: Error moving unit:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * ⭐ V3: Hide a card facedown at a battlefield
   *
   * Uses the HIDDEN keyword ability - delegates to HideCardAction
   */
  async hideCard(
    gameId: string,
    playerId: string,
    cardInstanceId: string,
    battlefieldId: string
  ): Promise<{ success: boolean; error?: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return { success: false, error: 'Scanner not initialized' };
    }

    // Find player
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, error: `Player ${playerId} not found` };
    }

    // Find card
    const card = this.findCardInGame(game, cardInstanceId);
    if (!card) {
      return { success: false, error: `Card ${cardInstanceId} not found` };
    }

    // Verify ownership
    if (card.ownerId !== playerId) {
      return { success: false, error: 'You do not own this card' };
    }

    try {
      // Get card state from scanner to validate hide ability
      const cardState = scanner.getCardState(cardInstanceId);
      if (!cardState) {
        return { success: false, error: 'Card state not found in scanner' };
      }

      // Find hide ability
      const hideAbility = cardState.abilities.find(a => a.id === 'hide');
      if (!hideAbility) {
        return { success: false, error: 'Card does not have hide ability' };
      }

      // Check if can activate
      if (!hideAbility.canActivate) {
        return { success: false, error: hideAbility.reason || 'Cannot hide card at this time' };
      }

      // Get ActionExecutor
      const executor = this.executors.get(gameId);
      if (!executor) {
        return { success: false, error: 'Game executor not initialized' };
      }

      // Pay costs using V3 actions
      if (hideAbility.costs) {
        if (hideAbility.costs.energy !== undefined && hideAbility.costs.energy > 0) {
          const spendEnergyAction = new SpendEnergyAction(
            player,
            { amount: hideAbility.costs.energy },
            card
          );
          const result = await executor.execute(spendEnergyAction);

          if (!result.success) {
            return {
              success: false,
              error: `Failed to pay energy cost: ${result.error?.message}`
            };
          }
        }

        if (hideAbility.costs.power) {
          for (const pc of hideAbility.costs.power) {
            const spendPowerAction = new SpendPowerAction(
              player,
              { domain: pc.domain, amount: pc.amount },
              card
            );
            const result = await executor.execute(spendPowerAction);

            if (!result.success) {
              return {
                success: false,
                error: `Failed to pay ${pc.domain} power cost: ${result.error?.message}`
              };
            }
          }
        }
      }

      // Find target battlefield
      const targetBattlefield = game.battlefields.find(bf => bf.id === battlefieldId);
      if (!targetBattlefield) {
        return { success: false, error: `Battlefield ${battlefieldId} not found` };
      }

      // Delegate to HideCardAction (handles validation + zone movement)
      const hideAction = new HideCardAction(player, {
        card,
        battlefield: targetBattlefield
      });

      const hideResult = await executor.execute(hideAction);

      if (!hideResult.success) {
        return {
          success: false,
          error: hideResult.error?.message || 'Failed to hide card'
        };
      }

      // Execute onActivate hook if script exists
      try {
        const scriptId = card.scriptPath
          ? card.scriptPath.replace('cards/', '').replace('.ts', '')
          : card.cardId;
        const script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);

        if (script && (script as any).onActivate) {
          const context = await this.buildCardContext(game, player, card, script);
          await this.cardScriptRuntime.executeHook('onActivate' as any, card as any, game, context);
        }
      } catch (error) {
        // No script - that's fine
      }

      // Trigger state change
      game.updatedAt = new Date();
      await this.onStateChanged(game);

      logger.info(`GameManager: Player ${playerId} hid card at battlefield ${battlefieldId}`);

      return { success: true };

    } catch (error) {
      logger.error(`GameManager: Error hiding card:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * ⭐ UPDATED: Activate an ability on a card
   *
   * This is called by the UI/controller when a player wants to activate an ability
   * (e.g., HIDDEN keyword, Phoenix resurrection, etc.)
   */
  async activateAbility(
    gameId: string,
    playerId: string,
    cardInstanceId: string,
    abilityId: string,
    targets?: any[]
  ): Promise<{ success: boolean; error?: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return { success: false, error: 'Scanner not initialized' };
    }

    try {
      // Find the card in game
      const card = this.findCardInGame(game, cardInstanceId);
      if (!card) {
        return { success: false, error: `Card ${cardInstanceId} not found` };
      }

      // Get card state from scanner
      const cardState = scanner.getCardState(cardInstanceId);
      if (!cardState) {
        return { success: false, error: 'Card state not found' };
      }

      // Find the ability
      const ability = cardState.abilities.find(a => a.id === abilityId);
      if (!ability) {
        return { success: false, error: `Ability ${abilityId} not found on card` };
      }

      // Check if ability can be activated
      if (!ability.canActivate) {
        return { success: false, error: ability.reason ?? 'Cannot activate ability' };
      }

      // Verify player ownership
      if (card.ownerId !== playerId) {
        return { success: false, error: 'You do not own this card' };
      }

      // Pay costs
      const player = game.players.find(p => p.id === playerId);
      if (!player) {
        return { success: false, error: 'Player not found' };
      }

      // ⭐ V3: Get ActionExecutor for this game
      const executor = this.executors.get(gameId);
      if (!executor) {
        return { success: false, error: 'Game executor not initialized' };
      }

      // ⭐ V3: Pay costs using V3 actions
      if (ability.costs) {
        if (ability.costs.energy !== undefined && ability.costs.energy > 0) {
          const spendEnergyAction = new SpendEnergyAction(
            player,
            { amount: ability.costs.energy },
            card
          );
          const result = await executor.execute(spendEnergyAction);

          if (!result.success) {
            return {
              success: false,
              error: `Failed to pay energy cost: ${result.error?.message}`
            };
          }
        }

        if (ability.costs.power) {
          for (const pc of ability.costs.power) {
            const spendPowerAction = new SpendPowerAction(
              player,
              { domain: pc.domain, amount: pc.amount },
              card
            );
            const result = await executor.execute(spendPowerAction);

            if (!result.success) {
              return {
                success: false,
                error: `Failed to pay ${pc.domain} power cost: ${result.error?.message}`
              };
            }
          }
        }
      }

      // Execute ability via CardScriptRuntime
      let script;
      try {
        const scriptId = card.scriptPath
          ? card.scriptPath.replace('cards/', '').replace('.ts', '')
          : card.cardId;
        script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);
      } catch (error) {
        // No script found
        logger.warn(`GameManager: No script found for card ${card.cardId}, ability will not execute`);
        script = null;
      }

      if (script && script.metadata?.activatedAbilities) {
        const abilityDef = script.metadata.activatedAbilities.find(a => a.id === abilityId);
        if (abilityDef && abilityDef.onActivate) {
          const context = await this.buildCardContext(game, player, card, script, targets);
          await abilityDef.onActivate(context);
        }
      }

      logger.info(`GameManager: Activated ability ${abilityId} on card ${card.name} for player ${playerId}`);

      // Trigger state change
      game.updatedAt = new Date();
      await this.onStateChanged(game);

      return { success: true };
    } catch (error) {
      logger.error(`GameManager: Error activating ability:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * ⭐ NEW: Pass priority
   *
   * Player passes priority to opponent or advances game state
   */
  /**
   * ⭐ V3: Pass priority to opponent
   *
   * Delegates to TurnManager.executeActionPhaseAction()
   */
  async passPriority(
    gameId: string,
    playerId: string
  ): Promise<{ success: boolean; error?: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      return { success: false, error: 'Game is not in progress' };
    }

    // Find player
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, error: `Player ${playerId} not found` };
    }

    try {
      // Get TurnManager for this game
      const turnManager = this.turnManagers.get(gameId);
      if (!turnManager) {
        return { success: false, error: 'Turn manager not initialized' };
      }

      // Delegate to TurnManager.executeActionPhaseAction()
      await turnManager.executeActionPhaseAction(game, playerId, 'PASS_PRIORITY', {});

      logger.info(`GameManager: Player ${playerId} passed priority in game ${gameId}`);

      // Trigger state change
      game.updatedAt = new Date();
      await this.onStateChanged(game);

      // Check if we should advance phase
      if (!turnManager.hasPendingShowdowns(game) && !turnManager.hasPendingChainItems(game)) {
        logger.debug('GameManager: No pending actions, caller should advance to next phase');
      }

      return { success: true };

    } catch (error) {
      logger.error(`GameManager: Error passing priority:`, error);
      return { success: false, error: String(error) };
    }
  }

  // ============================================================================
  // ⭐ TARGETING METHODS
  // ============================================================================

  /**
   * Get valid targets for a card
   *
   * Used by UI to show which targets can be selected
   */
  async getValidTargets(
    gameId: string,
    playerId: string,
    cardInstanceId: string
  ): Promise<{ success: boolean; error?: string; targets?: any[] }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    // Find card in game
    const card = this.findCardInGame(game, cardInstanceId);
    if (!card) {
      return { success: false, error: `Card ${cardInstanceId} not found` };
    }

    try {
      // Load card script to get target requirements
      let script;
      try {
        const scriptId = card.scriptPath
          ? card.scriptPath.replace('cards/', '').replace('.ts', '')
          : card.cardId;
        script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);
      } catch (error) {
        // No script = no targets needed
        return { success: true, targets: [] };
      }

      // Check if card has target requirements
      if (!script?.metadata?.targetRequirements || script.metadata.targetRequirements.length === 0) {
        return { success: true, targets: [] };
      }

      // Get valid targets from targeting system
      const validTargets = this.targetingSystem.getValidTargets(
        game,
        playerId,
        script.metadata.targetRequirements
      );

      return { success: true, targets: validTargets };
    } catch (error) {
      logger.error(`GameManager: Error getting valid targets:`, error);
      return { success: false, error: String(error) };
    }
  }

  // ============================================================================
  // ⭐ HELPER METHODS
  // ============================================================================

  /**
   * Build CardContext for script execution with full V3 API integration
   */
  private async buildCardContext(
    game: Game,
    player: Player,
    card: GameCard,
    script: any,
    targets?: any[]
  ): Promise<any> {
    const opponent = game.players.find(p => p.id !== player.id);
    if (!opponent) {
      throw new Error('Cannot find opponent player');
    }

    return {
      self: card,
      owner: player,
      opponent,
      game,
      targets: targets || [],
      // Additional properties that may be used by scripts
      eventData: undefined,
    };
  }

  /**
   * Remove a card from player zones
   * Returns true if card was found and removed
   */
  private removeCardFromZones(game: Game, player: Player, card: GameCard): boolean {
    // Try all player zones
    const zones = [
      player.zones.hand,
      player.zones.mainDeck,
      player.zones.trash,
      player.zones.runeDeck,
      player.zones.runes,
      player.zones.base,
      player.zones.championZone,
      player.zones.banishment,
    ];

    for (const zone of zones) {
      const index = zone.findIndex(c => c.instanceId === card.instanceId);
      if (index !== -1) {
        zone.splice(index, 1);
        return true;
      }
    }

    // Try battlefields
    for (const bf of game.battlefields) {
      if (bf.units) {
        const index = bf.units.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
          bf.units.splice(index, 1);

          // Also remove from sides
          if (bf.sides && bf.sides[card.ownerId]) {
            const sideIndex = bf.sides[card.ownerId]!.findIndex(c => c.instanceId === card.instanceId);
            if (sideIndex !== -1) {
              bf.sides[card.ownerId]!.splice(sideIndex, 1);
            }
          }

          return true;
        }
      }

      // Try facedown cards
      if (bf.facedownCards) {
        const index = bf.facedownCards.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
          bf.facedownCards.splice(index, 1);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Find a card anywhere in the game by instance ID
   */
  private findCardInGame(game: Game, instanceId: string): GameCard | undefined {
    // Check all player zones
    for (const player of game.players) {
      const zones = [
        player.zones.hand,
        player.zones.mainDeck,
        player.zones.trash,
        player.zones.runeDeck,
        player.zones.runes,
        player.zones.base,
        player.zones.championZone,
        player.zones.banishment,
      ];

      for (const zone of zones) {
        const found = zone.find(c => c.instanceId === instanceId);
        if (found) return found;
      }
    }

    // Check battlefields
    for (const bf of game.battlefields) {
      if (bf.units) {
        const found = bf.units.find(c => c.instanceId === instanceId);
        if (found) return found;
      }

      if (bf.sides) {
        for (const side of Object.values(bf.sides)) {
          const found = side.find(c => c.instanceId === instanceId);
          if (found) return found;
        }
      }

      if (bf.facedownCards) {
        const found = bf.facedownCards.find(c => c.instanceId === instanceId);
        if (found) return found;
      }
    }

    // Check chain
    for (const item of game.chain) {
      if (item.sourceCard?.instanceId === instanceId) {
        return item.sourceCard;
      }
    }

    return undefined;
  }

  /**
   * Process deaths - State-based action to handle units with lethal damage
   * Called automatically by ActionExecutor Phase 7 or manually when needed
   */
  async processDeaths(game: Game): Promise<void> {
    const deadUnits: GameCard[] = [];

    // Identify units with lethal damage (damage >= might)
    for (const battlefield of game.battlefields) {
      if (battlefield.units) {
        for (const unit of battlefield.units) {
          if (
            unit.damage !== undefined &&
            unit.might !== undefined &&
            unit.damage >= unit.might
          ) {
            deadUnits.push(unit);
          }
        }
      }
    }

    if (deadUnits.length === 0) {
      return; // No deaths to process
    }

    logger.info(`GameManager: Processing ${deadUnits.length} unit deaths`);

    // Execute onDeath hooks BEFORE moving units to trash
    for (const deadUnit of deadUnits) {
      const owner = game.players.find(p => p.id === deadUnit.controllerId);
      if (!owner) {
        logger.warn(`GameManager: Cannot find owner for dead unit ${deadUnit.instanceId}`);
        continue;
      }

      try {
        // Load card script
        const scriptId = deadUnit.scriptPath
          ? deadUnit.scriptPath.replace('cards/', '').replace('.ts', '')
          : deadUnit.cardId;

        const script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);

        // Execute onDeath hook if it exists
        if (script && script.onDeath) {
          const context = await this.buildCardContext(game, owner, deadUnit, script);
          await this.cardScriptRuntime.executeHook('onDeath', deadUnit as any, game, context);
          logger.debug(`GameManager: Executed onDeath for ${deadUnit.name}`);
        }
      } catch (error) {
        // Script not found or hook failed - log warning but continue
        logger.warn(`GameManager: Failed to execute onDeath for card ${deadUnit.cardId}:`, error);
      }

      // Move unit to trash
      this.moveCardToTrash(game, owner, deadUnit);

      logger.info(`GameManager: Unit ${deadUnit.name} died and moved to trash`);
    }

    // Trigger state change after all deaths processed
    game.updatedAt = new Date();
    await this.onStateChanged(game);
  }

  /**
   * Move a card to its owner's trash zone
   */
  private moveCardToTrash(game: Game, owner: Player, card: GameCard): void {
    // Remove card from current location
    const removed = this.removeCardFromZones(game, owner, card);

    if (!removed) {
      logger.warn(`GameManager: Failed to remove card ${card.instanceId} from zones when moving to trash`);
    }

    // Add to trash
    card.zone = 'trash';
    owner.zones.trash.push(card);
  }
}

// Global game manager instance
export const gameManager = new GameManager();