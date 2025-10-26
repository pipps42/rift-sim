/**
 * Game Integration Test
 *
 * Tests that CardStorage and HistoryQueryAPI are properly initialized
 * when creating a game through GameManager.
 */

import { GameManager } from '../GameManager';
import type { Player, Deck } from '../../../types/game';

describe('Game Integration with Storage and History', () => {
  let gameManager: GameManager;
  let mockPlayers: Player[];
  let mockDecks: Deck[];

  beforeEach(() => {
    gameManager = new GameManager();

    // Create mock players
    mockPlayers = [
      {
        id: 'player1',
        name: 'Player 1',
        score: 0,
        championLegend: null as any,
        zones: {
          hand: [],
          mainDeck: [],
          runeDeck: [],
          championZone: [],
          trash: [],
          banishment: [],
          base: [],
          runes: [],
        },
        runePool: {
          energy: 0,
          power: [],
        },
        hasPlayedCard: false,
        turnsPassed: 0,
      },
      {
        id: 'player2',
        name: 'Player 2',
        score: 0,
        championLegend: null as any,
        zones: {
          hand: [],
          mainDeck: [],
          runeDeck: [],
          championZone: [],
          trash: [],
          banishment: [],
          base: [],
          runes: [],
        },
        runePool: {
          energy: 0,
          power: [],
        },
        hasPlayedCard: false,
        turnsPassed: 0,
      },
    ];

    // Create mock valid decks
    mockDecks = [
      {
        id: 'deck1',
        name: 'Deck 1',
        playerId: 'player1',
        championLegend: 'LEGEND_001',
        chosenChampion: 'CHAMPION_001',
        mainDeck: Array(40).fill({ cardId: 'CARD_001', quantity: 1 }),
        runeDeck: Array(12).fill({ cardId: 'RUNE_001', quantity: 1 }),
        battlefields: ['BF_001', 'BF_002', 'BF_003'],
        isValid: true,
        validationErrors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
      {
        id: 'deck2',
        name: 'Deck 2',
        playerId: 'player2',
        championLegend: 'LEGEND_002',
        chosenChampion: 'CHAMPION_002',
        mainDeck: Array(40).fill({ cardId: 'CARD_002', quantity: 1 }),
        runeDeck: Array(12).fill({ cardId: 'RUNE_002', quantity: 1 }),
        battlefields: ['BF_001', 'BF_002', 'BF_003'],
        isValid: true,
        validationErrors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ];
  });

  describe('Game Creation', () => {
    it('should initialize CardStorage when creating game', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      expect(game.storage).toBeDefined();
      expect(typeof game.storage.getCardStorage).toBe('function');
      expect(typeof game.storage.clearAll).toBe('function');
    });

    it('should initialize HistoryQueryAPI when creating game', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      expect(game.historyQuery).toBeDefined();
      expect(typeof game.historyQuery.getSpellsCastThisTurn).toBe('function');
      expect(typeof game.historyQuery.getUnitsPlayedThisTurn).toBe('function');
    });

    it('should initialize empty history array', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      expect(game.history).toBeDefined();
      expect(Array.isArray(game.history)).toBe(true);
      expect(game.history).toHaveLength(0);
    });
  });

  describe('Storage Integration', () => {
    it('should allow storing data for cards', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      const cardStorage = game.storage.getCardStorage('test-card-1');
      cardStorage.set('testKey', 'testValue');

      expect(cardStorage.get('testKey')).toBe('testValue');
    });

    it('should maintain separate storage per card', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      game.storage.getCardStorage('card-1').set('value', 'A');
      game.storage.getCardStorage('card-2').set('value', 'B');

      expect(game.storage.getCardStorage('card-1').get('value')).toBe('A');
      expect(game.storage.getCardStorage('card-2').get('value')).toBe('B');
    });

    it('should allow clearing storage', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      game.storage.getCardStorage('card-1').set('data', 'value');
      expect(game.storage.getCardCount()).toBe(1);

      game.storage.clearAll();
      expect(game.storage.getCardCount()).toBe(0);
    });
  });

  describe('History Integration', () => {
    it('should allow querying empty history', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      const spells = game.historyQuery.getSpellsCastThisTurn('player1');
      const units = game.historyQuery.getUnitsPlayedThisTurn('player1');

      expect(spells).toBe(0);
      expect(units).toBe(0);
    });

    it('should track events when added to history', async () => {
      const game = await gameManager.createGame(mockPlayers, mockDecks);

      // Simulate adding events to history
      game.history.push({
        id: 'event-1',
        gameId: game.id,
        type: 'SPELL_CAST' as any,
        playerId: 'player1',
        timestamp: new Date(),
        data: { turn: game.round },
      });

      game.history.push({
        id: 'event-2',
        gameId: game.id,
        type: 'UNIT_PLAYED' as any,
        playerId: 'player1',
        timestamp: new Date(),
        data: { turn: game.round },
      });

      const spells = game.historyQuery.getSpellsCastThisTurn('player1');
      const units = game.historyQuery.getUnitsPlayedThisTurn('player1');

      expect(spells).toBe(1);
      expect(units).toBe(1);
    });
  });

  describe('Multiple Games', () => {
    it('should create separate storage instances per game', async () => {
      const game1 = await gameManager.createGame(mockPlayers, mockDecks);
      const game2 = await gameManager.createGame(mockPlayers, mockDecks);

      game1.storage.getCardStorage('card-1').set('value', 'game1');
      game2.storage.getCardStorage('card-1').set('value', 'game2');

      expect(game1.storage.getCardStorage('card-1').get('value')).toBe('game1');
      expect(game2.storage.getCardStorage('card-1').get('value')).toBe('game2');
    });

    it('should create separate history instances per game', async () => {
      const game1 = await gameManager.createGame(mockPlayers, mockDecks);
      const game2 = await gameManager.createGame(mockPlayers, mockDecks);

      game1.history.push({
        id: 'event-1',
        gameId: game1.id,
        type: 'SPELL_CAST' as any,
        playerId: 'player1',
        timestamp: new Date(),
        data: {},
      });

      expect(game1.history).toHaveLength(1);
      expect(game2.history).toHaveLength(0);
    });
  });
});
