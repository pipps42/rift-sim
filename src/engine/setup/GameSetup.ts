import {
  Game,
  Player,
  GamePhase,
  TurnState,
  GameCard,
  BattlefieldCard,
  Battlefield,
  RunePool,
  PowerPool
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { createGameCard } from '@/utils/cardHelpers';

/**
 * Handles initial game setup according to Riftbound rules
 */
export class GameSetup {

  /**
   * Perform complete game setup
   */
  async setupGame(game: Game): Promise<void> {
    logger.info(`GameSetup: Starting setup for game ${game.id}`);

    try {
      // 1. Place Champion Legends in Legend Zone
      await this.setupChampionLegends(game);

      // 2. Place Chosen Champions in Champion Zone
      await this.setupChosenChampions(game);

      // 3. Choose random battlefield for each player
      await this.setupBattlefields(game);

      // 4. Shuffle decks
      await this.shuffleDecks(game);

      // 5. Determine turn order randomly
      await this.determineTurnOrder(game);

      // 6. Draw initial hands (4 cards each)
      await this.drawInitialHands(game);

      // 7. Perform mulligan phase
      await this.performMulligan(game);

      // 8. Setup initial game state
      await this.setupInitialGameState(game);

      logger.info(`GameSetup: Setup completed for game ${game.id}`);

    } catch (error) {
      logger.error(`GameSetup: Failed to setup game ${game.id}:`, error);
      throw error;
    }
  }

  /**
   * Setup Champion Legends in Legend Zone
   */
  private async setupChampionLegends(game: Game): Promise<void> {
    // Champion Legends are already assigned to players
    // They remain in the Legend Zone and cannot be moved/removed

    for (const player of game.players) {
      logger.debug(`GameSetup: Player ${player.name} Champion Legend: ${player.championLegend.name}`);
    }
  }

  /**
   * Setup Chosen Champions in Champion Zone
   */
  private async setupChosenChampions(game: Game): Promise<void> {
    for (const player of game.players) {
      if (player.chosenChampion) {
        // Move Chosen Champion to Champion Zone
        const championCard = createGameCard(player.chosenChampion, player, 'champion');
        championCard.ready = true; // Champions start ready

        player.zones.championZone.push(championCard);
        logger.debug(`GameSetup: Placed ${player.chosenChampion.name} in Champion Zone for ${player.name}`);
      }
    }
  }

  /**
   * Setup battlefields (randomly choose 1 from each player's 3)
   */
  private async setupBattlefields(game: Game): Promise<void> {
    // For now, create placeholder battlefields
    // TODO: Implement proper battlefield selection from player's 3 battlefields

    for (let i = 0; i < 2; i++) { // Assuming 2 battlefields for 1v1
      const battlefield: Battlefield = {
        id: uuidv4(),
        card: {
          id: `battlefield-${i + 1}`,
          name: `Battlefield ${i + 1}`,
          energyCost: 0,
          powerCost: [],
          description: 'A battlefield where units clash',
          cardType: 'battlefield' as any,
          rarity: 'common' as any,
          domains: [],
          keywords: [],
          tags: [],
          battlefieldAbilities: [],
          scoreValue: 1
        },
        units: [],
        sides: {}, // Units organized by controlling player
        contested: false,
        facedownCards: []
      };

      game.battlefields.push(battlefield);
    }

    logger.debug(`GameSetup: Created ${game.battlefields.length} battlefields`);
  }

  /**
   * Shuffle main decks and rune decks
   */
  private async shuffleDecks(game: Game): Promise<void> {
    for (const player of game.players) {
      // Shuffle main deck
      this.shuffleArray(player.zones.mainDeck);

      // Shuffle rune deck
      this.shuffleArray(player.zones.runeDeck);

      logger.debug(`GameSetup: Shuffled decks for player ${player.name}`);
    }
  }

  /**
   * Determine random turn order
   */
  private async determineTurnOrder(game: Game): Promise<void> {
    // Randomly choose starting player
    game.currentPlayerIndex = Math.random() < 0.5 ? 0 : 1;

    const startingPlayer = game.players[game.currentPlayerIndex];
    logger.info(`GameSetup: ${startingPlayer?.name} will go first`);
  }

  /**
   * Draw initial hands (4 cards each)
   */
  private async drawInitialHands(game: Game): Promise<void> {
    for (const player of game.players) {
      for (let i = 0; i < 4; i++) {
        await this.drawCard(player);
      }

      logger.debug(`GameSetup: Player ${player.name} drew initial hand of 4 cards`);
    }
  }

  /**
   * Perform mulligan phase
   */
  private async performMulligan(game: Game): Promise<void> {
    // TODO: Implement interactive mulligan
    // For now, players keep their initial hands

    logger.debug('GameSetup: Mulligan phase skipped (auto-keep)');
  }

  /**
   * Setup initial game state
   */
  private async setupInitialGameState(game: Game): Promise<void> {
    // Initialize rune pools
    for (const player of game.players) {
      player.runePool = {
        energy: 0,
        power: []
      };
    }

    // Set initial phase and turn state
    game.phase = GamePhase.AWAKEN;
    game.turnState = TurnState.NEUTRAL_OPEN;
    game.round = 1;

    logger.debug('GameSetup: Initialized game state');
  }

  /**
   * Draw a card for a player
   */
  private async drawCard(player: Player): Promise<GameCard | null> {
    if (player.zones.mainDeck.length === 0) {
      // Handle Burn Out
      logger.warn(`GameSetup: Player ${player.name} has empty deck during setup`);
      return null;
    }

    const drawnCard = player.zones.mainDeck.shift();
    if (drawnCard) {
      player.zones.hand.push(drawnCard);
      return drawnCard;
    }

    return null;
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j]!, array[i]!];
    }
  }

}