import { TurnManager } from '../TurnManager';
import {
  Game,
  Player,
  GamePhase,
  TurnState,
  GameStatus,
  Domain,
  CardType,
  Rarity
} from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

describe('TurnManager', () => {
  let turnManager: TurnManager;
  let mockGame: Game;

  beforeEach(() => {
    jest.useFakeTimers();
    turnManager = new TurnManager();
    mockGame = createMockGame();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('startTurn', () => {
    it('should start a turn and set phase to AWAKEN', async () => {
      await turnManager.startTurn(mockGame);

      expect(mockGame.phase).toBe(GamePhase.AWAKEN);
      expect(mockGame.turnState).toBe(TurnState.NEUTRAL_OPEN);
    });

    it('should ready all cards for turn player during Awaken', async () => {
      const currentPlayer = mockGame.players[mockGame.currentPlayerIndex]!;

      // Add some exhausted cards
      currentPlayer.zones.base.push({
        instanceId: uuidv4(),
        cardId: 'test-card',
        controllerId: currentPlayer.id,
        ownerId: currentPlayer.id,
        zone: 'base',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      });

      const promise = turnManager.startTurn(mockGame);

      // Advance only through Awaken phase
      await jest.advanceTimersByTimeAsync(100);

      await promise;

      expect(currentPlayer.zones.base[0]?.ready).toBe(true);
    });

    it('should increment round number correctly', async () => {
      const initialRound = mockGame.round;

      // Set to player 1 and start turn
      mockGame.currentPlayerIndex = 1;
      const promise = turnManager.startTurn(mockGame);
      jest.advanceTimersByTime(100);
      await promise;

      expect(mockGame.round).toBe(initialRound);

      // Round increments when returning to player 0
      mockGame.currentPlayerIndex = 0;
      mockGame.round = 2;

      expect(mockGame.round).toBe(2);
    });
  });

  describe('nextPhase', () => {
    it('should advance from AWAKEN to BEGINNING', async () => {
      mockGame.phase = GamePhase.AWAKEN;

      const promise = turnManager.nextPhase(mockGame);
      await jest.advanceTimersByTimeAsync(100);
      await promise;

      expect(mockGame.phase).toBe(GamePhase.BEGINNING);
    });

    it('should advance through all phases in order', async () => {
      mockGame.phase = GamePhase.AWAKEN;

      const promise = turnManager.nextPhase(mockGame);

      // Advance through all automatic phase transitions (7 phases × 100ms)
      await jest.advanceTimersByTimeAsync(700);

      await promise;

      // After all phases complete, should have cycled through and started new turn
      expect(mockGame.phase).toBe(GamePhase.AWAKEN);
    });

    it('should call endTurn when advancing from CLEANUP', async () => {
      mockGame.phase = GamePhase.CLEANUP;
      const initialPlayerIndex = mockGame.currentPlayerIndex;

      const promise = turnManager.nextPhase(mockGame);

      // Advance through cleanup and turn transition
      await jest.advanceTimersByTimeAsync(200);

      await promise;

      // Player index should have changed
      expect(mockGame.currentPlayerIndex).not.toBe(initialPlayerIndex);
    });
  });

  describe('endTurn', () => {
    it('should switch to next player', async () => {
      mockGame.currentPlayerIndex = 0;

      const promise = turnManager.endTurn(mockGame);
      await jest.advanceTimersByTimeAsync(100);
      await promise;

      expect(mockGame.currentPlayerIndex).toBe(1);
    });

    it('should switch back to first player after second player', async () => {
      mockGame.currentPlayerIndex = 1;
      mockGame.round = 1;

      const promise = turnManager.endTurn(mockGame);
      await jest.advanceTimersByTimeAsync(100);
      await promise;

      expect(mockGame.currentPlayerIndex).toBe(0);
    });

    it('should increment round when returning to first player', async () => {
      mockGame.currentPlayerIndex = 1;
      mockGame.round = 1;

      const promise = turnManager.endTurn(mockGame);
      await jest.advanceTimersByTimeAsync(100);
      await promise;

      expect(mockGame.round).toBe(2);
    });
  });

  describe('executeActionPhaseAction', () => {
    beforeEach(() => {
      mockGame.phase = GamePhase.ACTION;
      mockGame.turnState = TurnState.NEUTRAL_OPEN;
    });

    it('should throw error if not player turn', async () => {
      const opponentIndex = mockGame.currentPlayerIndex === 0 ? 1 : 0;
      const opponent = mockGame.players[opponentIndex]!;

      await expect(
        turnManager.executeActionPhaseAction(mockGame, opponent.id, 'PASS_PRIORITY', {})
      ).rejects.toThrow('Not player\'s turn');
    });

    it('should throw error if not in ACTION phase', async () => {
      mockGame.phase = GamePhase.DRAW;
      const currentPlayer = mockGame.players[mockGame.currentPlayerIndex]!;

      await expect(
        turnManager.executeActionPhaseAction(mockGame, currentPlayer.id, 'PASS_PRIORITY', {})
      ).rejects.toThrow('Not in Action Phase');
    });

    it('should handle PASS_PRIORITY action', async () => {
      const currentPlayer = mockGame.players[mockGame.currentPlayerIndex]!;

      await expect(
        turnManager.executeActionPhaseAction(mockGame, currentPlayer.id, 'PASS_PRIORITY', {})
      ).resolves.not.toThrow();
    });

    it('should throw error for unknown action', async () => {
      const currentPlayer = mockGame.players[mockGame.currentPlayerIndex]!;

      await expect(
        turnManager.executeActionPhaseAction(mockGame, currentPlayer.id, 'INVALID_ACTION', {})
      ).rejects.toThrow('Unknown action: INVALID_ACTION');
    });
  });

  describe('Channel Phase', () => {
    it('should channel 2 runes during normal turn', async () => {
      mockGame.phase = GamePhase.CHANNEL;
      mockGame.round = 2;
      mockGame.currentPlayerIndex = 0;

      const player = mockGame.players[0]!;
      const initialRuneDeck = player.zones.runeDeck.length;
      const initialRunes = player.zones.runes.length;

      // Call nextPhase and wait for async operations
      await turnManager.nextPhase(mockGame);

      expect(player.zones.runeDeck.length).toBe(initialRuneDeck - 2);
      expect(player.zones.runes.length).toBe(initialRunes + 2);
    });

    it('should channel 3 runes for second player on first turn', async () => {
      mockGame.phase = GamePhase.CHANNEL;
      mockGame.round = 1;
      mockGame.currentPlayerIndex = 1;

      const player = mockGame.players[1]!;
      const initialRuneDeck = player.zones.runeDeck.length;
      const initialRunes = player.zones.runes.length;

      // Call nextPhase and wait for async operations
      await turnManager.nextPhase(mockGame);

      expect(player.zones.runeDeck.length).toBe(initialRuneDeck - 3);
      expect(player.zones.runes.length).toBe(initialRunes + 3);
    });
  });

  describe('Draw Phase', () => {
    it('should draw 1 card during draw phase', async () => {
      mockGame.phase = GamePhase.DRAW;

      const player = mockGame.players[mockGame.currentPlayerIndex]!;
      const initialHand = player.zones.hand.length;
      const initialDeck = player.zones.mainDeck.length;

      // Call nextPhase and wait for async operations
      await turnManager.nextPhase(mockGame);

      expect(player.zones.hand.length).toBe(initialHand + 1);
      expect(player.zones.mainDeck.length).toBe(initialDeck - 1);
    });

    it('should clear rune pool at end of draw phase', async () => {
      mockGame.phase = GamePhase.DRAW;

      const player = mockGame.players[mockGame.currentPlayerIndex]!;
      player.runePool.energy = 5;
      player.runePool.power = [{ domain: Domain.FURY, amount: 3 }];

      // Call nextPhase and wait for async operations
      await turnManager.nextPhase(mockGame);

      expect(player.runePool.energy).toBe(0);
      expect(player.runePool.power).toEqual([]);
    });
  });
});

// Helper function
function createMockGame(): Game {
  const player1: Player = {
    id: 'player-1',
    name: 'Player 1',
    score: 0,
    championLegend: {
      id: 'legend-1',
      name: 'Test Legend 1',
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
        id: 'ability-1',
        name: 'Test Ability',
        description: 'Test',
        type: 'static' as any,
        timing: 'normal' as any,
        effects: []
      }
    },
    zones: {
      base: [],
      runes: [],
      hand: [],
      mainDeck: Array.from({ length: 40 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `card-${i}`,
        controllerId: 'player-1',
        ownerId: 'player-1',
        zone: 'mainDeck',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      })),
      runeDeck: Array.from({ length: 12 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `rune-${i}`,
        controllerId: 'player-1',
        ownerId: 'player-1',
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

  const player2: Player = {
    ...player1,
    id: 'player-2',
    name: 'Player 2',
    championLegend: { ...player1.championLegend, id: 'legend-2', name: 'Test Legend 2' },
    zones: {
      ...player1.zones,
      mainDeck: Array.from({ length: 40 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `card-${i}`,
        controllerId: 'player-2',
        ownerId: 'player-2',
        zone: 'mainDeck',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      })),
      runeDeck: Array.from({ length: 12 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `rune-${i}`,
        controllerId: 'player-2',
        ownerId: 'player-2',
        zone: 'runeDeck',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      }))
    }
  };

  return {
    id: uuidv4(),
    players: [player1, player2],
    currentPlayerIndex: 0,
    phase: GamePhase.AWAKEN,
    turnState: TurnState.NEUTRAL_OPEN,
    round: 1,
    status: GameStatus.IN_PROGRESS,
    battlefields: [],
    chain: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
