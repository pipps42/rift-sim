import { gameManager } from '../managers/GameManager';
import { turnManager } from '../managers/TurnManager';
import { Player, Deck, GameStatus, GamePhase } from '../../types/game';

describe('Riftbound Engine Integration', () => {

  // Mock player data
  const createMockPlayer = (id: string, name: string): Player => ({
    id,
    name,
    score: 0,
    championLegend: {
      id: `legend-${id}`,
      name: `Legend of ${name}`,
      energyCost: 0,
      powerCost: [],
      description: 'A legendary champion',
      cardType: 'champion_legend' as any,
      rarity: 'mythic' as any,
      domains: ['fire' as any],
      keywords: [],
      tags: [],
      domainIdentity: ['fire' as any],
      championTag: 'warrior',
      legendaryAbility: {
        id: 'legendary-ability',
        name: 'Legendary Power',
        description: 'A powerful ability',
        type: 'static' as any,
        timing: 'normal' as any,
        effects: []
      }
    },
    chosenChampion: {
      id: `champion-${id}`,
      name: `Champion ${name}`,
      energyCost: 3,
      powerCost: [],
      description: 'A chosen champion',
      cardType: 'unit' as any,
      rarity: 'rare' as any,
      domains: ['fire' as any],
      keywords: [],
      tags: ['warrior'],
      might: 3,
      subtypes: ['warrior' as any],
      abilities: []
    },
    zones: {
      base: [],
      runes: [],
      hand: [],
      mainDeck: Array.from({ length: 40 }, (_, i) => ({
        instanceId: `card-${id}-${i}`,
        cardId: `generic-card-${i}`,
        controllerId: id,
        ownerId: id,
        zone: 'mainDeck',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      })),
      runeDeck: Array.from({ length: 12 }, (_, i) => ({
        instanceId: `rune-${id}-${i}`,
        cardId: `basic-rune-${i}`,
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
  });

  const createMockDeck = (playerId: string): Deck => ({
    id: `deck-${playerId}`,
    name: `Test Deck`,
    playerId,
    championLegend: `legend-${playerId}`,
    chosenChampion: `champion-${playerId}`,
    mainDeck: Array.from({ length: 40 }, (_, i) => ({
      cardId: `generic-card-${i}`,
      quantity: 1
    })),
    runeDeck: Array.from({ length: 12 }, (_, i) => ({
      cardId: `basic-rune-${i}`,
      quantity: 1
    })),
    battlefields: ['battlefield-1', 'battlefield-2', 'battlefield-3'],
    isValid: true,
    validationErrors: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  it('should create and setup a complete game', async () => {
    // Create mock players
    const player1 = createMockPlayer('player-1', 'Alice');
    const player2 = createMockPlayer('player-2', 'Bob');
    const players = [player1, player2];

    // Create mock decks
    const deck1 = createMockDeck('player-1');
    const deck2 = createMockDeck('player-2');
    const decks = [deck1, deck2];

    // Create game
    const game = await gameManager.createGame(players, decks);

    expect(game).toBeDefined();
    expect(game.players).toHaveLength(2);
    expect(game.status).toBe(GameStatus.SETUP);

    // Start game
    await gameManager.startGame(game.id);

    const updatedGame = gameManager.getGame(game.id);
    expect(updatedGame?.status).toBe(GameStatus.IN_PROGRESS);
    expect(updatedGame?.phase).toBe(GamePhase.AWAKEN);

    // Verify initial setup
    expect(updatedGame?.players[0]?.zones.hand).toHaveLength(4); // Initial hand
    expect(updatedGame?.players[1]?.zones.hand).toHaveLength(4);
    expect(updatedGame?.battlefields.length).toBeGreaterThan(0);

    console.log('✅ Game creation and setup successful');
    console.log(`Game ID: ${game.id}`);
    console.log(`Current Player: ${updatedGame?.players[updatedGame.currentPlayerIndex]?.name}`);
    console.log(`Current Phase: ${updatedGame?.phase}`);
  }, 10000);

  it('should validate deck requirements', async () => {
    const player1 = createMockPlayer('player-1', 'Alice');
    const player2 = createMockPlayer('player-2', 'Bob');

    // Create invalid deck (too small)
    const invalidDeck: Deck = {
      id: 'invalid-deck',
      name: 'Invalid Deck',
      playerId: 'player-1',
      championLegend: 'legend-player-1',
      chosenChampion: 'champion-player-1',
      mainDeck: [{ cardId: 'card-1', quantity: 1 }], // Only 1 card (need 40)
      runeDeck: [{ cardId: 'rune-1', quantity: 1 }], // Only 1 rune (need 12)
      battlefields: ['battlefield-1'], // Only 1 battlefield (need 3)
      isValid: false,
      validationErrors: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const validDeck = createMockDeck('player-2');

    // Should throw error for invalid deck
    await expect(
      gameManager.createGame([player1, player2], [invalidDeck, validDeck])
    ).rejects.toThrow();

    console.log('✅ Deck validation working correctly');
  });

  it('should track game statistics', () => {
    const stats = gameManager.getStatistics();

    expect(stats).toHaveProperty('totalGames');
    expect(stats).toHaveProperty('activeGames');
    expect(stats).toHaveProperty('finishedGames');
    expect(stats).toHaveProperty('abandonedGames');

    expect(typeof stats.totalGames).toBe('number');
    expect(typeof stats.activeGames).toBe('number');

    console.log('✅ Game statistics tracking working');
    console.log('Current stats:', stats);
  });

  afterEach(async () => {
    // Clean up any created games
    const activeGames = gameManager.getActiveGames();
    for (const game of activeGames) {
      await gameManager.endGame(game.id, 'Test cleanup');
    }
  });
});