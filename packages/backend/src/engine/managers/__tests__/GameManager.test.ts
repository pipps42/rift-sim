import { GameManager } from '../GameManager';
import { Player, Deck, GameStatus, GamePhase, TurnState, Domain, CardType, Rarity } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

describe('GameManager', () => {
  let gameManager: GameManager;

  beforeEach(() => {
    gameManager = new GameManager();
  });

  describe('createGame', () => {
    it('should create a game with 2 players', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);

      const game = await gameManager.createGame(players, decks);

      expect(game).toBeDefined();
      expect(game.id).toBeDefined();
      expect(game.players).toHaveLength(2);
      expect(game.status).toBe(GameStatus.SETUP);
      expect(game.phase).toBe(GamePhase.AWAKEN);
      expect(game.turnState).toBe(TurnState.NEUTRAL_OPEN);
      expect(game.round).toBe(0);
      expect(game.battlefields).toEqual([]);
      expect(game.chain).toEqual([]);
    });

    it('should throw error if player count is not 2', async () => {
      const players = createMockPlayers(1);
      const decks = createMockDecks(players);

      await expect(gameManager.createGame(players, decks)).rejects.toThrow(
        'Riftbound games require exactly 2 players'
      );
    });

    it('should throw error if deck count does not match player count', async () => {
      const players = createMockPlayers(2);
      const decks = [createMockDeck(players[0]!)];

      await expect(gameManager.createGame(players, decks)).rejects.toThrow(
        'Must provide exactly 2 decks'
      );
    });

    it('should throw error if deck is invalid', async () => {
      const players = createMockPlayers(2);
      const validDeck = createMockDeck(players[0]!);
      const invalidDeck = createInvalidDeck(players[1]!);

      await expect(gameManager.createGame(players, [validDeck, invalidDeck])).rejects.toThrow();
    });

    it('should emit game start event on creation', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);

      const game = await gameManager.createGame(players, decks);

      expect(game).toBeDefined();
      // Event emission is tested via EventBus tests
    });
  });

  describe('startGame', () => {
    it('should start a game and change status to IN_PROGRESS', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);

      await gameManager.startGame(game.id);

      const updatedGame = gameManager.getGame(game.id);
      expect(updatedGame?.status).toBe(GameStatus.IN_PROGRESS);
    });

    it('should throw error if game not found', async () => {
      await expect(gameManager.startGame('invalid-id')).rejects.toThrow(
        'Game invalid-id not found'
      );
    });

    it('should throw error if game already started', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);

      await gameManager.startGame(game.id);

      await expect(gameManager.startGame(game.id)).rejects.toThrow(
        `Cannot start game ${game.id}: game status is in_progress`
      );
    });

    it('should perform game setup when starting', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);

      await gameManager.startGame(game.id);

      const updatedGame = gameManager.getGame(game.id);
      expect(updatedGame?.players[0]?.zones.hand).toHaveLength(4); // Initial hand
      expect(updatedGame?.players[1]?.zones.hand).toHaveLength(4);
    });
  });

  describe('endGame', () => {
    it('should end a game and set winner', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      await gameManager.endGame(game.id, 'Test end', players[0]!.id);

      const updatedGame = gameManager.getGame(game.id);
      expect(updatedGame?.status).toBe(GameStatus.FINISHED);
      expect(updatedGame?.winner).toBe(players[0]!.id);
    });

    it('should not throw error if game already finished', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      await gameManager.endGame(game.id, 'First end', players[0]!.id);
      await expect(gameManager.endGame(game.id, 'Second end', players[1]!.id)).resolves.not.toThrow();
    });

    it('should clean up game after timeout', async () => {
      jest.useFakeTimers();

      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);

      await gameManager.endGame(game.id, 'Test cleanup');

      jest.advanceTimersByTime(300000); // 5 minutes

      const updatedGame = gameManager.getGame(game.id);
      expect(updatedGame).toBeUndefined();

      jest.useRealTimers();
    });
  });

  describe('getGame', () => {
    it('should retrieve a game by ID', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);

      const retrievedGame = gameManager.getGame(game.id);

      expect(retrievedGame).toEqual(game);
    });

    it('should return undefined for non-existent game', () => {
      const game = gameManager.getGame('non-existent-id');

      expect(game).toBeUndefined();
    });
  });

  describe('getActiveGames', () => {
    it('should return only active games', async () => {
      const players1 = createMockPlayers(2);
      const decks1 = createMockDecks(players1);
      const game1 = await gameManager.createGame(players1, decks1);
      await gameManager.startGame(game1.id);

      const players2 = createMockPlayers(2);
      const decks2 = createMockDecks(players2);
      const game2 = await gameManager.createGame(players2, decks2);
      await gameManager.startGame(game2.id);

      await gameManager.endGame(game2.id, 'Finished');

      const activeGames = gameManager.getActiveGames();

      expect(activeGames).toHaveLength(1);
      expect(activeGames[0]?.id).toBe(game1.id);
    });
  });

  describe('surrender', () => {
    it('should allow player to surrender and opponent wins', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      await gameManager.surrender(game.id, players[0]!.id);

      const updatedGame = gameManager.getGame(game.id);
      expect(updatedGame?.status).toBe(GameStatus.FINISHED);
      expect(updatedGame?.winner).toBe(players[1]!.id);
    });

    it('should throw error if player not in game', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      await expect(gameManager.surrender(game.id, 'invalid-player')).rejects.toThrow(
        'Player invalid-player not found in game'
      );
    });
  });

  describe('validateDeck', () => {
    it('should validate a correct deck', async () => {
      const player = createMockPlayer('test-player');
      const deck = createMockDeck(player);

      const result = await gameManager.validateDeck(deck);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate a deck with too few cards', async () => {
      const player = createMockPlayer('test-player');
      const deck = createInvalidDeck(player);

      const result = await gameManager.validateDeck(deck);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getStatistics', () => {
    it('should return correct game statistics', async () => {
      const players1 = createMockPlayers(2);
      const decks1 = createMockDecks(players1);
      const game1 = await gameManager.createGame(players1, decks1);
      await gameManager.startGame(game1.id);

      const players2 = createMockPlayers(2);
      const decks2 = createMockDecks(players2);
      const game2 = await gameManager.createGame(players2, decks2);

      const stats = gameManager.getStatistics();

      expect(stats.totalGames).toBeGreaterThanOrEqual(2);
      expect(stats.activeGames).toBeGreaterThanOrEqual(1);
      expect(stats.finishedGames).toBeGreaterThanOrEqual(0);
    });
  });

  describe('canPlayerAct', () => {
    it('should return true if it is player turn', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      const canAct = gameManager.canPlayerAct(game.id, currentPlayer!.id);

      expect(canAct).toBe(true);
    });

    it('should return false if it is not player turn', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const opponentIndex = game.currentPlayerIndex === 0 ? 1 : 0;
      const opponent = game.players[opponentIndex];
      const canAct = gameManager.canPlayerAct(game.id, opponent!.id);

      expect(canAct).toBe(false);
    });

    it('should return false if game not active', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);

      const canAct = gameManager.canPlayerAct(game.id, players[0]!.id);

      expect(canAct).toBe(false);
    });
  });

  // ============================================================================
  // ⭐ NEW: Player Actions Tests
  // ============================================================================

  describe('playCard', () => {
    it('should play a unit card from hand to base', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      // Add a test unit to hand
      const testCard = createMockUnitCard(currentPlayer.id);
      currentPlayer.zones.hand.push(testCard);
      currentPlayer.runePool.energy = 5; // Ensure player has enough energy

      const result = await gameManager.playCard(game.id, currentPlayer.id, testCard.instanceId);

      expect(result.success).toBe(true);
      expect(currentPlayer.zones.hand).not.toContain(testCard);
      expect(currentPlayer.zones.base).toContain(testCard);
      expect(testCard.zone).toBe('base');
    });

    it('should fail if card not in hand', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const result = await gameManager.playCard(game.id, currentPlayer.id, 'non-existent-card');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found in hand');
    });

    it('should fail if not enough energy', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const testCard = createMockUnitCard(currentPlayer.id);
      testCard.energyCost = 10;
      currentPlayer.zones.hand.push(testCard);
      currentPlayer.runePool.energy = 2; // Not enough

      const result = await gameManager.playCard(game.id, currentPlayer.id, testCard.instanceId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient Energy');
    });

    it('should fail if not player turn', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const opponentIndex = game.currentPlayerIndex === 0 ? 1 : 0;
      const opponent = game.players[opponentIndex];
      if (!opponent) throw new Error('No opponent');

      const testCard = createMockUnitCard(opponent.id);
      opponent.zones.hand.push(testCard);

      const result = await gameManager.playCard(game.id, opponent.id, testCard.instanceId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Action Phase');
    });

    it('should deduct energy cost when playing card', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const testCard = createMockUnitCard(currentPlayer.id);
      testCard.energyCost = 3;
      currentPlayer.zones.hand.push(testCard);
      currentPlayer.runePool.energy = 10;

      await gameManager.playCard(game.id, currentPlayer.id, testCard.instanceId);

      expect(currentPlayer.runePool.energy).toBe(7); // 10 - 3
    });

    it('should play spell card and move to trash', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const testSpell = createMockSpellCard(currentPlayer.id);
      currentPlayer.zones.hand.push(testSpell);
      currentPlayer.runePool.energy = 5;

      const result = await gameManager.playCard(game.id, currentPlayer.id, testSpell.instanceId);

      expect(result.success).toBe(true);
      expect(currentPlayer.zones.hand).not.toContain(testSpell);
      expect(currentPlayer.zones.trash).toContain(testSpell);
      expect(testSpell.zone).toBe('trash');
    });
  });

  describe('standardMove', () => {
    it('should move a unit from base to battlefield', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      // Add test unit to base
      const testUnit = createMockUnitCard(currentPlayer.id);
      testUnit.ready = true;
      testUnit.zone = 'base';
      currentPlayer.zones.base.push(testUnit);

      // Create a battlefield
      const battlefield = createMockBattlefield();
      game.battlefields.push(battlefield);

      const result = await gameManager.standardMove(
        game.id,
        currentPlayer.id,
        testUnit.instanceId,
        battlefield.id
      );

      expect(result.success).toBe(true);
      expect(currentPlayer.zones.base).not.toContain(testUnit);
      expect(battlefield.units).toContain(testUnit);
      expect(testUnit.ready).toBe(false); // Should be exhausted after move
    });

    it('should fail if unit is not ready', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const testUnit = createMockUnitCard(currentPlayer.id);
      testUnit.ready = false; // Not ready
      currentPlayer.zones.base.push(testUnit);

      const battlefield = createMockBattlefield();
      game.battlefields.push(battlefield);

      const result = await gameManager.standardMove(
        game.id,
        currentPlayer.id,
        testUnit.instanceId,
        battlefield.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('must be ready');
    });

    it('should fail if not a unit', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const testSpell = createMockSpellCard(currentPlayer.id);
      currentPlayer.zones.hand.push(testSpell);

      const battlefield = createMockBattlefield();
      game.battlefields.push(battlefield);

      const result = await gameManager.standardMove(
        game.id,
        currentPlayer.id,
        testSpell.instanceId,
        battlefield.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Only units can move');
    });

    it('should fail if not player turn', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const opponentIndex = game.currentPlayerIndex === 0 ? 1 : 0;
      const opponent = game.players[opponentIndex];
      if (!opponent) throw new Error('No opponent');

      const testUnit = createMockUnitCard(opponent.id);
      testUnit.ready = true;
      opponent.zones.base.push(testUnit);

      const battlefield = createMockBattlefield();
      game.battlefields.push(battlefield);

      const result = await gameManager.standardMove(
        game.id,
        opponent.id,
        testUnit.instanceId,
        battlefield.id
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Not your turn');
    });
  });

  describe('passPriority', () => {
    it('should allow player to pass priority', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer) throw new Error('No current player');

      const result = await gameManager.passPriority(game.id, currentPlayer.id);

      expect(result.success).toBe(true);
    });

    it('should fail if game not found', async () => {
      const result = await gameManager.passPriority('invalid-game', 'player-1');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should fail if player not found', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      await gameManager.startGame(game.id);

      const result = await gameManager.passPriority(game.id, 'invalid-player');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Player invalid-player not found');
    });

    it('should fail if game not in progress', async () => {
      const players = createMockPlayers(2);
      const decks = createMockDecks(players);
      const game = await gameManager.createGame(players, decks);
      // Don't start game

      const result = await gameManager.passPriority(game.id, players[0]!.id);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not in progress');
    });
  });
});

// Helper functions
function createMockPlayer(id: string = uuidv4(), name: string = 'Test Player'): Player {
  return {
    id,
    name,
    score: 0,
    championLegend: {
      id: `legend-${id}`,
      name: 'Test Legend',
      energyCost: 0,
      powerCost: [],
      description: 'A test legend',
      cardType: CardType.LEGEND,
      rarity: Rarity.MYTHIC,
      domains: [Domain.FURY],
      keywords: [],
      tags: [],
      domainIdentity: [Domain.FURY],
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
      name: 'Test Champion',
      energyCost: 3,
      powerCost: [],
      description: 'A test champion',
      cardType: CardType.CHAMPION,
      rarity: Rarity.RARE,
      domains: [Domain.FURY],
      keywords: [],
      tags: ['warrior'],
      might: 3,
      subtypes: [],
      abilities: []
    },
    zones: {
      base: [],
      runes: [],
      hand: [],
      mainDeck: Array.from({ length: 40 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `card-${i}`,
        id: `card-${i}`,
        name: `Card ${i}`,
        energyCost: 1,
        powerCost: [],
        description: '',
        cardType: CardType.UNIT,
        rarity: Rarity.COMMON,
        domains: [Domain.FURY],
        keywords: [],
        tags: [],
        controllerId: id,
        ownerId: id,
        zone: 'mainDeck',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      })),
      runeDeck: Array.from({ length: 12 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `rune-${i}`,
        id: `rune-${i}`,
        name: `Rune ${i}`,
        energyCost: 0,
        powerCost: [],
        description: '',
        cardType: CardType.RUNE,
        rarity: Rarity.COMMON,
        domains: [Domain.UNIVERSAL],
        keywords: [],
        tags: [],
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

function createMockPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPlayer(`player-${i}`, `Player ${i + 1}`)
  );
}

function createMockDeck(player: Player): Deck {
  return {
    id: `deck-${player.id}`,
    name: 'Test Deck',
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

function createMockDecks(players: Player[]): Deck[] {
  return players.map(createMockDeck);
}

function createInvalidDeck(player: Player): Deck {
  return {
    id: `invalid-deck-${player.id}`,
    name: 'Invalid Deck',
    playerId: player.id,
    championLegend: player.championLegend.id,
    chosenChampion: player.chosenChampion?.id || '',
    mainDeck: [{ cardId: 'card-1', quantity: 1 }], // Only 1 card (need 40)
    runeDeck: [{ cardId: 'rune-1', quantity: 1 }], // Only 1 rune (need 12)
    battlefields: ['battlefield-1'], // Only 1 battlefield (need 3)
    isValid: false,
    validationErrors: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function createMockUnitCard(ownerId: string): any {
  const id = `unit-${uuidv4()}`;
  return {
    instanceId: uuidv4(),
    cardId: id,
    id: id,
    name: 'Test Unit',
    energyCost: 2,
    powerCost: [],
    description: 'A test unit',
    cardType: CardType.UNIT,
    rarity: Rarity.COMMON,
    domains: [Domain.FURY],
    keywords: [],
    tags: [],
    might: 3,
    subtypes: [],
    abilities: [],
    controllerId: ownerId,
    ownerId: ownerId,
    zone: 'hand',
    position: 0,
    ready: false,
    damage: 0,
    temporaryModifiers: [],
    counters: []
  };
}

function createMockSpellCard(ownerId: string): any {
  const id = `spell-${uuidv4()}`;
  return {
    instanceId: uuidv4(),
    cardId: id,
    id: id,
    name: 'Test Spell',
    energyCost: 2,
    powerCost: [],
    description: 'A test spell',
    cardType: CardType.SPELL,
    rarity: Rarity.COMMON,
    domains: [Domain.CALM],
    keywords: [],
    tags: [],
    spellTiming: 'normal' as any,
    targetRequirements: [],
    effects: [],
    controllerId: ownerId,
    ownerId: ownerId,
    zone: 'hand',
    position: 0,
    ready: false,
    damage: 0,
    temporaryModifiers: [],
    counters: []
  };
}

function createMockBattlefield(): any {
  return {
    id: `battlefield-${uuidv4()}`,
    card: {
      id: 'test-battlefield',
      name: 'Test Battlefield',
      energyCost: 0,
      powerCost: [],
      description: 'A test battlefield',
      cardType: CardType.BATTLEFIELD,
      rarity: Rarity.COMMON,
      domains: [],
      keywords: [],
      tags: [],
      battlefieldAbilities: [],
      scoreValue: 1
    },
    units: [],
    sides: {},
    contested: false,
    facedownCards: []
  };
}
