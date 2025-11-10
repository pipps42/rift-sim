/**
 * GameCLI - Main CLI game loop
 *
 * Manages:
 * - Game initialization
 * - Turn phases
 * - Player actions during Action Phase
 * - Hot-seat play (both players controlled by user)
 */

import { GameManager } from '@/engine/managers/GameManager';
import { TurnManager } from '@/engine/managers/TurnManager';
import { CLIRenderer } from './CLIRenderer';
import { CLIInputHandler, Command } from './CLIInputHandler';
import { Game, Player, Deck, GamePhase, TurnState, CardType, Domain, Rarity, GameCard } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

export class GameCLI {
  private gameManager: GameManager;
  private renderer: CLIRenderer;
  private inputHandler: CLIInputHandler;
  private game?: Game;
  private running: boolean = false;

  constructor() {
    this.gameManager = new GameManager();
    this.renderer = new CLIRenderer();
    this.inputHandler = new CLIInputHandler();
  }

  /**
   * Start the CLI game
   */
  async start(): Promise<void> {
    await this.gameManager.initialize();

    this.renderer.renderInfo('Welcome to Riftbound Simulator!');
    console.log('This is a hot-seat game - you control both players.\n');

    // Get player names
    const player1Name = await this.inputHandler.prompt('Player 1 name: ') || 'Alice';
    const player2Name = await this.inputHandler.prompt('Player 2 name: ') || 'Bob';

    // Create game
    await this.createGame(player1Name, player2Name);

    if (!this.game) {
      this.renderer.renderError('Failed to create game');
      return;
    }

    this.renderer.renderSuccess('Game created! Starting...');
    await this.inputHandler.waitForEnter();

    // Start game loop
    this.running = true;
    await this.gameLoop();
  }

  /**
   * Create a new game with test players
   */
  private async createGame(player1Name: string, player2Name: string): Promise<void> {
    const players = [
      this.createTestPlayer('player-1', player1Name),
      this.createTestPlayer('player-2', player2Name)
    ];

    const decks = [
      this.createTestDeck(players[0]!),
      this.createTestDeck(players[1]!)
    ];

    this.game = await this.gameManager.createGame(players, decks);
    await this.gameManager.startGame(this.game.id);
    this.game = this.gameManager.getGame(this.game.id)!;
  }

  /**
   * Main game loop
   */
  private async gameLoop(): Promise<void> {
    while (this.running && this.game) {
      // Refresh game state
      this.game = this.gameManager.getGame(this.game.id)!;

      // Check victory
      if (this.game.status === 'finished') {
        this.handleGameEnd();
        break;
      }

      // Render current state
      this.renderer.render(this.game);

      // Show combat state if active
      if (this.game.combatState) {
        this.renderer.renderCombatState(this.game);

        // Show damage distribution if available
        if (this.game.combatState.damageDistribution) {
          this.renderer.renderDamageDistribution(this.game.combatState.damageDistribution);
        }
      }

      // Handle current phase
      await this.handlePhase();
    }

    this.inputHandler.close();
  }

  /**
   * Handle current phase
   */
  private async handlePhase(): Promise<void> {
    if (!this.game) return;

    switch (this.game.phase) {
      case GamePhase.AWAKEN:
        await this.handleAwakenPhase();
        break;
      case GamePhase.BEGINNING:
        await this.handleBeginningPhase();
        break;
      case GamePhase.CHANNEL:
        await this.handleChannelPhase();
        break;
      case GamePhase.DRAW:
        await this.handleDrawPhase();
        break;
      case GamePhase.ACTION:
        await this.handleActionPhase();
        break;
      case GamePhase.ENDING:
        await this.handleEndingPhase();
        break;
      case GamePhase.EXPIRATION:
        await this.handleExpirationPhase();
        break;
      case GamePhase.CLEANUP:
        await this.handleCleanupPhase();
        break;
      default:
        this.renderer.renderError(`Unknown phase: ${this.game.phase}`);
        this.running = false;
    }
  }

  /**
   * AWAKEN PHASE - Ready all cards
   */
  private async handleAwakenPhase(): Promise<void> {
    this.renderer.renderInfo('AWAKEN PHASE - Readying all cards...');
    await this.inputHandler.waitForEnter();

    // Advance to next phase
    await this.advancePhase();
  }

  /**
   * BEGINNING PHASE - Scoring step
   */
  private async handleBeginningPhase(): Promise<void> {
    this.renderer.renderInfo('BEGINNING PHASE - Scoring step (Hold)...');
    await this.inputHandler.waitForEnter();

    // TODO: Implement scoring logic
    await this.advancePhase();
  }

  /**
   * CHANNEL PHASE - Channel 2 runes
   */
  private async handleChannelPhase(): Promise<void> {
    if (!this.game) return;

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) return;

    const runesToChannel = this.game.round === 1 && this.game.currentPlayerIndex === 1 ? 3 : 2;
    const runesBeforeCount = currentPlayer.zones.runes.length;

    this.renderer.renderInfo(`CHANNEL PHASE - Channeling ${runesToChannel} runes from Rune Deck...`);
    this.renderer.renderInfo(`Runes in deck: ${currentPlayer.zones.runeDeck.length}`);

    // TurnManager already handles channeling via advancePhase
    // Just show what was channeled
    await this.advancePhase();

    // Refresh to see channeled runes
    this.game = this.gameManager.getGame(this.game.id)!;
    const runesAfterCount = currentPlayer.zones.runes.length;
    const channeled = runesAfterCount - runesBeforeCount;

    if (channeled > 0) {
      this.renderer.renderSuccess(`Channeled ${channeled} runes!`);

      // Show the newly channeled runes
      const newRunes = currentPlayer.zones.runes.slice(-channeled);
      console.log('\nNewly channeled runes:');
      newRunes.forEach((rune, index) => {
        console.log(`  [${index + 1}] ${rune.name} - ${rune.domains?.join(', ') || 'No domains'}`);
      });
    } else {
      this.renderer.renderInfo('No runes available to channel');
    }

    await this.inputHandler.waitForEnter();
  }

  /**
   * DRAW PHASE - Draw 1 card
   */
  private async handleDrawPhase(): Promise<void> {
    this.renderer.renderInfo('DRAW PHASE - Drawing 1 card...');

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer && currentPlayer.zones.mainDeck.length > 0) {
      const drawnCard = currentPlayer.zones.mainDeck.shift();
      if (drawnCard) {
        drawnCard.zone = 'hand';
        currentPlayer.zones.hand.push(drawnCard);
        this.renderer.renderSuccess(`Drew: ${drawnCard.name}`);
      }
    } else {
      this.renderer.renderInfo('Main deck is empty - Burn Out!');
    }

    await this.inputHandler.waitForEnter();
    await this.advancePhase();
  }

  /**
   * ACTION PHASE - Player can take actions
   */
  private async handleActionPhase(): Promise<void> {
    if (!this.game) return;

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) return;

    this.renderer.renderInfo(`ACTION PHASE - ${currentPlayer.name}, what would you like to do?`);

    let passed = false;
    while (!passed && this.game.phase === GamePhase.ACTION) {
      // Show available actions
      this.renderer.renderActionsMenu([
        'help - Show available commands',
        'hand - View your hand',
        'base - View your base',
        'play <index> - Play card from hand',
        'move <unit_index> <battlefield_index> - Move unit to battlefield',
        'pass - End Action Phase'
      ]);

      const input = await this.inputHandler.prompt('\nAction: ');
      const cmd = this.inputHandler.parseCommand(input);

      const shouldContinue = await this.handleActionCommand(cmd, currentPlayer);
      if (!shouldContinue) {
        passed = true;
      }
    }

    await this.advancePhase();
  }

  /**
   * Handle action command during Action Phase
   */
  private async handleActionCommand(cmd: Command, player: Player): Promise<boolean> {
    if (!this.game) return false;

    switch (cmd.action) {
      case 'help':
        this.renderer.renderActionsMenu([
          'hand - View your hand',
          'base - View your base',
          'runes - View your runes',
          'play <index> - Play card from hand (e.g., "play 1")',
          'move <unit_index> <battlefield_index> - Move unit to battlefield (e.g., "move 1 1")',
          'tap <rune_index> - Tap rune for energy (e.g., "tap 1")',
          'pass - End Action Phase'
        ]);
        await this.inputHandler.waitForEnter();
        return true;

      case 'hand':
        this.renderer.renderHand(player);
        await this.inputHandler.waitForEnter();
        return true;

      case 'base':
        this.renderer.renderBase(player);
        await this.inputHandler.waitForEnter();
        return true;

      case 'play':
        return await this.handlePlayCard(cmd, player);

      case 'move':
        return await this.handleMoveUnit(cmd, player);

      case 'runes':
        this.renderer.renderRunes(player);
        await this.inputHandler.waitForEnter();
        return true;

      case 'tap':
        return await this.handleTapRune(cmd, player);

      case 'pass':
        this.renderer.renderInfo('Passing - ending Action Phase...');
        await this.inputHandler.waitForEnter();
        return false;

      case 'quit':
        this.renderer.renderInfo('Quitting game...');
        this.running = false;
        return false;

      default:
        this.renderer.renderError(`Unknown command: ${cmd.action}. Type "help" for available commands.`);
        await this.inputHandler.waitForEnter();
        return true;
    }
  }

  /**
   * Handle play card command
   */
  private async handlePlayCard(cmd: Command, player: Player): Promise<boolean> {
    if (!this.game) return true;

    const validation = this.inputHandler.validatePlayCommand(cmd, player);
    if (!validation.success) {
      this.renderer.renderError(validation.message || 'Invalid play command');
      await this.inputHandler.waitForEnter();
      return true;
    }

    const { card } = validation.data;

    // Handle targeting for spells/abilities
    let targets: GameCard[] = [];
    if (this.cardNeedsTarget(card)) {
      const availableTargets = this.getAvailableTargets(card, player);

      if (availableTargets.length > 0) {
        const wantsTarget = await this.inputHandler.confirm('This card can target. Select target?');

        if (wantsTarget) {
          const target = await this.inputHandler.selectTarget(availableTargets, `Select target for ${card.name}:`);
          if (target) {
            targets = [target];
          } else {
            this.renderer.renderInfo('Cancelled - no target selected');
            await this.inputHandler.waitForEnter();
            return true;
          }
        }
      }
    }

    try {
      // Convert GameCard[] to Target[] for playCard
      const targetObjects = targets.map(t => ({
        type: 'unit' as any,
        cardId: t.instanceId,
        restrictions: []
      }));

      const result = await this.gameManager.playCard(this.game.id, player.id, card.instanceId, targetObjects);
      this.game = this.gameManager.getGame(this.game.id)!;

      if (result.success) {
        this.renderer.renderSuccess(`Played ${card.name}!`);

        // Check if chain is active and handle responses
        if (this.game.chain.length > 0) {
          await this.handleChainResolution();
        }
      } else {
        this.renderer.renderError(result.error || 'Failed to play card');
      }
    } catch (error) {
      this.renderer.renderError(`Error playing card: ${error}`);
    }

    await this.inputHandler.waitForEnter();
    return true;
  }

  /**
   * Handle move unit command
   */
  private async handleMoveUnit(cmd: Command, player: Player): Promise<boolean> {
    if (!this.game) return true;

    const validation = this.inputHandler.validateMoveCommand(cmd, player, this.game);
    if (!validation.success) {
      this.renderer.renderError(validation.message || 'Invalid move command');
      await this.inputHandler.waitForEnter();
      return true;
    }

    const { unit, battlefield } = validation.data;

    try {
      const result = await this.gameManager.standardMove(
        this.game.id,
        player.id,
        unit.instanceId,
        battlefield.id
      );
      this.game = this.gameManager.getGame(this.game.id)!;

      if (result.success) {
        this.renderer.renderSuccess(`Moved ${unit.name} to ${battlefield.card.name}!`);
      } else {
        this.renderer.renderError(result.error || 'Failed to move unit');
      }
    } catch (error) {
      this.renderer.renderError(`Error moving unit: ${error}`);
    }

    await this.inputHandler.waitForEnter();
    return true;
  }

  /**
   * Handle tap rune command
   */
  private async handleTapRune(cmd: Command, player: Player): Promise<boolean> {
    if (!this.game) return true;

    if (cmd.args.length === 0) {
      this.renderer.renderError('Usage: tap <rune_index>');
      await this.inputHandler.waitForEnter();
      return true;
    }

    const runeIndex = parseInt(cmd.args[0] || '') - 1;
    if (isNaN(runeIndex) || runeIndex < 0 || runeIndex >= player.zones.runes.length) {
      this.renderer.renderError(`Invalid rune index. You have ${player.zones.runes.length} runes.`);
      await this.inputHandler.waitForEnter();
      return true;
    }

    const rune = player.zones.runes[runeIndex];
    if (!rune) {
      this.renderer.renderError('Rune not found.');
      await this.inputHandler.waitForEnter();
      return true;
    }

    if (!rune.ready) {
      this.renderer.renderError('Rune is already exhausted.');
      await this.inputHandler.waitForEnter();
      return true;
    }

    try {
      // Get the TurnManager's RunePoolManager
      const turnManager = this.gameManager['turnManagers'].get(this.game.id);
      if (!turnManager) {
        this.renderer.renderError('Turn manager not found');
        await this.inputHandler.waitForEnter();
        return true;
      }

      const runePoolManager = turnManager['runePoolManager'];
      if (!runePoolManager) {
        this.renderer.renderError('Rune pool manager not found');
        await this.inputHandler.waitForEnter();
        return true;
      }

      // Tap the rune for energy
      await runePoolManager.tapRuneForEnergy(this.game, player.id, rune.instanceId);
      this.game = this.gameManager.getGame(this.game.id)!;

      this.renderer.renderSuccess(`Tapped ${rune.name} for 1 energy! Current energy: ${player.runePool.energy}`);
    } catch (error) {
      this.renderer.renderError(`Error tapping rune: ${error}`);
    }

    await this.inputHandler.waitForEnter();
    return true;
  }

  /**
   * ENDING PHASE
   */
  private async handleEndingPhase(): Promise<void> {
    this.renderer.renderInfo('ENDING PHASE - End of turn effects...');
    await this.inputHandler.waitForEnter();
    await this.advancePhase();
  }

  /**
   * EXPIRATION PHASE
   */
  private async handleExpirationPhase(): Promise<void> {
    this.renderer.renderInfo('EXPIRATION PHASE - Removing damage and expiring effects...');

    // Remove damage from all units
    if (this.game) {
      for (const player of this.game.players) {
        for (const unit of player.zones.base) {
          if (unit.damage > 0) {
            unit.damage = 0;
          }
        }
      }
      for (const bf of this.game.battlefields) {
        for (const unit of bf.units) {
          if (unit.damage > 0) {
            unit.damage = 0;
          }
        }
      }

      // Clear rune pool
      const currentPlayer = this.getCurrentPlayer();
      if (currentPlayer) {
        currentPlayer.runePool.energy = 0;
        currentPlayer.runePool.power = [];
      }
    }

    await this.inputHandler.waitForEnter();
    await this.advancePhase();
  }

  /**
   * CLEANUP PHASE
   */
  private async handleCleanupPhase(): Promise<void> {
    this.renderer.renderInfo('CLEANUP PHASE - Processing state-based actions...');

    // Call processDeaths
    if (this.game?.processDeaths) {
      await this.game.processDeaths();
    }

    await this.inputHandler.waitForEnter();

    // End turn - advance to next player
    await this.endTurn();
  }

  /**
   * Advance to next phase
   */
  private async advancePhase(): Promise<void> {
    if (!this.game) return;

    const turnManager = this.gameManager['turnManagers'].get(this.game.id);
    if (turnManager) {
      await turnManager.nextPhase(this.game);
      this.game = this.gameManager.getGame(this.game.id)!;
    }
  }

  /**
   * End turn and pass to next player
   */
  private async endTurn(): Promise<void> {
    if (!this.game) return;

    const turnManager = this.gameManager['turnManagers'].get(this.game.id);
    if (turnManager) {
      await turnManager.endTurn(this.game);
      this.game = this.gameManager.getGame(this.game.id)!;
    }
  }

  /**
   * Get current player
   */
  private getCurrentPlayer(): Player | undefined {
    return this.game?.players[this.game.currentPlayerIndex];
  }

  /**
   * Check if card needs/can have a target
   */
  private cardNeedsTarget(card: GameCard): boolean {
    // Spells and units with damage effects typically need targets
    // For now, we'll make it simple: spells can have targets
    return card.cardType === CardType.SPELL ||
           card.description?.toLowerCase().includes('target') ||
           card.description?.toLowerCase().includes('deal');
  }

  /**
   * Get available targets for a card
   */
  private getAvailableTargets(card: GameCard, player: Player): GameCard[] {
    if (!this.game) return [];

    const targets: GameCard[] = [];

    // Add all units on battlefields
    for (const bf of this.game.battlefields) {
      targets.push(...bf.units);
    }

    // Add all units in bases
    for (const p of this.game.players) {
      targets.push(...p.zones.base.filter(c => c.cardType === CardType.UNIT || c.cardType === CardType.CHAMPION));
      targets.push(...p.zones.championZone);
    }

    return targets;
  }

  /**
   * Handle chain resolution with priority passing
   */
  private async handleChainResolution(): Promise<void> {
    if (!this.game) return;

    this.renderer.renderInfo('Chain is active! Players can respond...');
    this.renderer.render(this.game);

    let allPlayersPassed = false;
    const passCounts = new Map<string, number>();

    while (this.game.chain.length > 0 && !allPlayersPassed) {
      // Give priority to each player to respond
      for (const player of this.game.players) {
        const wantsToRespond = await this.inputHandler.promptForChainResponse(player.name);

        if (wantsToRespond) {
          passCounts.set(player.id, 0); // Reset pass count

          // Show hand and allow playing a spell/ability
          this.renderer.renderHand(player);
          const input = await this.inputHandler.prompt('Play card (index) or pass: ');

          if (input.toLowerCase() === 'pass') {
            continue;
          }

          const cardIndex = parseInt(input) - 1;
          const card = player.zones.hand[cardIndex];

          if (card && (card.cardType === CardType.SPELL || card.keywords?.includes('REACTION' as any))) {
            // Handle targeting
            let targets: GameCard[] = [];
            if (this.cardNeedsTarget(card)) {
              const availableTargets = this.getAvailableTargets(card, player);
              const target = await this.inputHandler.selectTarget(availableTargets, `Select target for ${card.name}:`);
              if (target) targets = [target];
            }

            // Convert to Target objects
            const targetObjects = targets.map(t => ({
              type: 'unit' as any,
              cardId: t.instanceId,
              restrictions: []
            }));

            // Play the card
            const result = await this.gameManager.playCard(this.game.id, player.id, card.instanceId, targetObjects);
            this.game = this.gameManager.getGame(this.game.id)!;

            if (result.success) {
              this.renderer.renderSuccess(`${player.name} played ${card.name} in response!`);
              this.renderer.render(this.game);
            }
          }
        } else {
          // Player passed
          const count = (passCounts.get(player.id) || 0) + 1;
          passCounts.set(player.id, count);
        }
      }

      // Check if all players passed
      allPlayersPassed = Array.from(passCounts.values()).every(count => count >= 1);

      if (allPlayersPassed) {
        // Resolve chain
        this.renderer.renderInfo('All players passed - resolving chain...');

        const turnManager = this.gameManager['turnManagers'].get(this.game.id);
        if (turnManager) {
          const chainSystem = turnManager['chainSystem'];
          if (chainSystem) {
            await chainSystem.resolve(this.game);
            this.game = this.gameManager.getGame(this.game.id)!;
            this.renderer.renderSuccess('Chain resolved!');
          }
        }

        // Reset for next chain iteration
        passCounts.clear();
        allPlayersPassed = false;
      }
    }

    this.renderer.renderInfo('Chain is empty - continuing...');
    await this.inputHandler.waitForEnter();
  }

  /**
   * Handle game end
   */
  private handleGameEnd(): void {
    if (!this.game) return;

    console.clear();
    console.log(chalk.bold.green('\n🎉 GAME OVER! 🎉\n'));

    const winner = this.game.players.find(p => p.score >= 8);
    if (winner) {
      console.log(chalk.bold.yellow(`${winner.name} wins with ${winner.score} points!\n`));
    }

    // Show final scores
    this.game.players.forEach(player => {
      console.log(`${player.name}: ${player.score} points`);
    });

    console.log('\nThanks for playing Riftbound Simulator!\n');
  }

  // ===================================================================
  // TEST HELPERS (temporary - will be replaced with proper deck building)
  // ===================================================================

  private createTestPlayer(id: string, name: string): Player {
    return {
      id,
      name,
      score: 0,
      championLegend: {
        id: `legend-${id}`,
        name: `${name}'s Legend`,
        energyCost: 0,
        powerCost: [],
        description: 'A champion legend',
        cardType: CardType.LEGEND,
        rarity: Rarity.MYTHIC,
        domains: [Domain.UNIVERSAL],
        keywords: [],
        tags: [],
        domainIdentity: [Domain.UNIVERSAL],
        championTag: 'warrior',
        legendaryAbility: {
          id: 'legendary-ability',
          name: 'Test Ability',
          description: 'A test ability',
          type: 'static' as any,
          timing: 'normal' as any,
          effects: []
        }
      },
      chosenChampion: {
        id: `champion-${id}`,
        name: `${name}'s Champion`,
        energyCost: 3,
        powerCost: [],
        description: 'A champion',
        cardType: CardType.CHAMPION,
        rarity: Rarity.RARE,
        domains: [Domain.FURY],
        keywords: [],
        tags: ['warrior'],
        might: 4,
        subtypes: [],
        abilities: []
      },
      zones: {
        base: [],
        runes: [],
        hand: [],
        mainDeck: this.createMainDeckCards(id),
        runeDeck: Array.from({ length: 12 }, (_, i) => ({
          instanceId: uuidv4(),
          cardId: `rune-${i}`,
          id: `rune-${i}`,
          name: `Universal Rune ${i}`,
          energyCost: 0,
          powerCost: [],
          description: '[T]: Add [1]. Recycle this: Add [U]',
          cardType: CardType.RUNE,
          rarity: Rarity.COMMON,
          domains: [Domain.UNIVERSAL],
          keywords: [],
          tags: [],
          isBasicRune: true,
          abilities: [],
          controllerId: id,
          ownerId: id,
          zone: 'runeDeck',
          ready: false,
          damage: 0,
          temporaryModifiers: [],
          counters: []
        })),
        championZone: [],
        trash: [],
        banishment: []
      },
      runePool: {
        energy: 0,
        power: []
      },
      hasPlayedCard: false,
      turnsPassed: 0
    };
  }

  private createTestDeck(player: Player): Deck {
    return {
      id: `deck-${player.id}`,
      name: `${player.name}'s Deck`,
      playerId: player.id,
      championLegend: player.championLegend.id,
      chosenChampion: player.chosenChampion?.id || '',
      mainDeck: Array.from({ length: 40 }, (_, i) => ({
        cardId: `card-${i}`,
        quantity: 1
      })),
      runeDeck: Array.from({ length: 12 }, (_, i) => ({
        cardId: `rune-${i}`,
        quantity: 1
      })),
      battlefields: ['battlefield-1', 'battlefield-2', 'battlefield-3'],
      isValid: true,
      validationErrors: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Create a main deck with real cards at various costs
   */
  private createMainDeckCards(playerId: string): GameCard[] {
    const cards: GameCard[] = [];

    // Card definitions with real cards
    const cardPool = [
      // 1-cost units (10 copies)
      { id: 'swift-scout', name: 'Swift Scout', cost: 1, might: 1, count: 10 },

      // 2-cost units (10 copies)
      { id: 'simple-warrior', name: 'Simple Warrior', cost: 2, might: 2, count: 10 },

      // 3-cost units (8 copies)
      { id: 'veteran-soldier', name: 'Veteran Soldier', cost: 3, might: 3, count: 8 },

      // 4-cost units (6 copies)
      { id: 'mighty-vanguard', name: 'Mighty Vanguard', cost: 4, might: 4, count: 6 },

      // 4-cost spells (3 copies)
      { id: 'disintegrate', name: 'Disintegrate', cost: 4, might: 0, count: 3, cardType: CardType.SPELL },

      // 5-cost units (3 copies)
      { id: 'playful-phantom', name: 'Playful Phantom', cost: 5, might: 5, count: 3 },
    ];

    for (const cardDef of cardPool) {
      for (let i = 0; i < cardDef.count; i++) {
        const baseCard: any = {
          instanceId: uuidv4(),
          cardId: cardDef.id,
          id: cardDef.id,
          name: cardDef.name,
          energyCost: cardDef.cost,
          powerCost: [],
          description: cardDef.cardType === CardType.SPELL
            ? 'ACTION (Play on your turn or in showdowns.) Deal 3 to a unit at a battlefield. If this kills it, do this: draw 1.'
            : `A ${cardDef.cost}-cost ${cardDef.might}/${cardDef.might} unit`,
          cardType: cardDef.cardType || CardType.UNIT,
          rarity: Rarity.COMMON,
          domains: [Domain.FURY],
          keywords: [],
          tags: [],
          controllerId: playerId,
          ownerId: playerId,
          zone: 'mainDeck',
          ready: false,
          damage: 0,
          temporaryModifiers: [],
          counters: []
        };

        // Add type-specific properties
        if (cardDef.cardType === CardType.SPELL) {
          baseCard.spellTiming = 'normal';
          baseCard.targetRequirements = [];
          baseCard.effects = [];
        } else {
          // Unit
          baseCard.might = cardDef.might;
          baseCard.subtypes = [];
          baseCard.abilities = [];
        }

        cards.push(baseCard as GameCard);
      }
    }

    return cards;
  }
}
