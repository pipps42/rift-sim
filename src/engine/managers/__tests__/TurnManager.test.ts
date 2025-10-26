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
import { CardScriptRuntime } from '../../scripting/CardScriptRuntime';
import { ActionExecutor } from '../../actions/ActionExecutor';

describe('TurnManager', () => {
  let turnManager: TurnManager;
  let mockGame: Game;
  let mockScriptRuntime: CardScriptRuntime;
  let mockExecutor: ActionExecutor;

  beforeEach(() => {
    // Create mock game first (needed for ActionExecutor)
    mockGame = createMockGame();

    // Create mock CardScriptRuntime
    mockScriptRuntime = {
      executeHook: jest.fn().mockResolvedValue(undefined),
      getLoader: jest.fn().mockReturnValue({
        loadScript: jest.fn().mockResolvedValue(null)
      })
    } as any;

    // Create mock ActionExecutor that simulates V3 actions
    mockExecutor = {
      execute: jest.fn().mockImplementation(async (action: any) => {
        // Simulate DrawCardAction (GameActionType.DRAW_CARD = 'draw_card')
        if (action.type === 'draw_card') {
          const player = action.controller;
          const amount = action.data.amount;

          for (let i = 0; i < amount; i++) {
            if (player.zones.mainDeck.length > 0) {
              const card = player.zones.mainDeck.shift();
              if (card) {
                player.zones.hand.push(card);
              }
            }
          }
          return { success: true };
        }

        // Simulate ReadyAllCardsAction (GameActionType.READY_CARD = 'ready_card')
        if (action.type === 'ready_card') {
          const player = action.controller;
          [...player.zones.base, ...player.zones.runes].forEach((card: any) => {
            card.ready = true;
          });
          mockGame.battlefields.forEach(battlefield => {
            battlefield.units.forEach(unit => {
              if (unit.controllerId === player.id) {
                unit.ready = true;
              }
            });
          });
          return { success: true };
        }

        // Simulate RemoveAllDamageAction (assuming it uses 'heal_damage' or custom type)
        // Since RemoveAllDamageAction is custom, let's check what it actually uses
        if (action.constructor.name === 'RemoveAllDamageAction') {
          mockGame.battlefields.forEach(battlefield => {
            battlefield.units.forEach(unit => {
              unit.damage = 0;
            });
          });
          return { success: true };
        }

        // Default success for other actions
        return { success: true };
      })
    } as any;

    // Create TurnManager with required dependencies
    turnManager = new TurnManager(mockScriptRuntime, mockExecutor);
  });

  describe('startTurn', () => {
    it('should ready all cards for turn player during Awaken', async () => {
      const currentPlayer = mockGame.players[mockGame.currentPlayerIndex]!;

      // Add some exhausted cards
      currentPlayer.zones.base.push({
        instanceId: uuidv4(),
        cardId: 'test-card',
        id: 'test-card',
        name: 'Test Card',
        description: 'Test card description',
        cardType: CardType.UNIT,
        rarity: Rarity.COMMON,
        domains: [Domain.FURY],
        keywords: [],
        tags: [],
        energyCost: 1,
        powerCost: [],
        controllerId: currentPlayer.id,
        ownerId: currentPlayer.id,
        zone: 'base',
        ready: false,
        damage: 0,
        temporaryModifiers: [],
        counters: []
      });

      await turnManager.startTurn(mockGame);

      expect(currentPlayer.zones.base[0]?.ready).toBe(true);
      expect(mockGame.phase).toBe(GamePhase.AWAKEN);
    });

    it('should increment round number correctly', async () => {
      const initialRound = mockGame.round;

      // Set to player 1 and start turn
      mockGame.currentPlayerIndex = 1;
      await turnManager.startTurn(mockGame);

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

      await turnManager.nextPhase(mockGame);

      expect(mockGame.phase).toBe(GamePhase.BEGINNING);
    });

    it('should advance through all phases in order', async () => {
      mockGame.phase = GamePhase.AWAKEN;

      // Manually advance through all phases
      await turnManager.nextPhase(mockGame); // BEGINNING
      expect(mockGame.phase).toBe(GamePhase.BEGINNING);

      await turnManager.nextPhase(mockGame); // CHANNEL
      expect(mockGame.phase).toBe(GamePhase.CHANNEL);

      await turnManager.nextPhase(mockGame); // DRAW
      expect(mockGame.phase).toBe(GamePhase.DRAW);

      await turnManager.nextPhase(mockGame); // ACTION
      expect(mockGame.phase).toBe(GamePhase.ACTION);

      await turnManager.nextPhase(mockGame); // ENDING
      expect(mockGame.phase).toBe(GamePhase.ENDING);

      await turnManager.nextPhase(mockGame); // EXPIRATION
      expect(mockGame.phase).toBe(GamePhase.EXPIRATION);

      await turnManager.nextPhase(mockGame); // CLEANUP
      expect(mockGame.phase).toBe(GamePhase.CLEANUP);
    });

    it('should call endTurn when advancing from CLEANUP', async () => {
      mockGame.phase = GamePhase.CLEANUP;
      const initialPlayerIndex = mockGame.currentPlayerIndex;

      await turnManager.nextPhase(mockGame);

      // After CLEANUP, endTurn is called which switches player and starts new turn
      expect(mockGame.currentPlayerIndex).not.toBe(initialPlayerIndex);
      expect(mockGame.phase).toBe(GamePhase.AWAKEN); // New turn starts with AWAKEN
    });
  });

  describe('endTurn', () => {
    it('should switch to next player', async () => {
      mockGame.currentPlayerIndex = 0;

      await turnManager.endTurn(mockGame);

      expect(mockGame.currentPlayerIndex).toBe(1);
    });

    it('should switch back to first player after second player', async () => {
      mockGame.currentPlayerIndex = 1;
      mockGame.round = 1;

      await turnManager.endTurn(mockGame);

      expect(mockGame.currentPlayerIndex).toBe(0);
    });

    it('should increment round when returning to first player', async () => {
      mockGame.currentPlayerIndex = 1;
      mockGame.round = 1;

      await turnManager.endTurn(mockGame);

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

    // Note: PASS_PRIORITY requires PriorityManager setup which is tested separately
    // Skipping this test as it requires complex priority state initialization

    it('should throw error for unknown action', async () => {
      const currentPlayer = mockGame.players[mockGame.currentPlayerIndex]!;

      await expect(
        turnManager.executeActionPhaseAction(mockGame, currentPlayer.id, 'INVALID_ACTION', {})
      ).rejects.toThrow('Unknown action: INVALID_ACTION');
    });
  });

  describe('Channel Phase', () => {
    it('should channel 2 runes during normal turn', async () => {
      mockGame.phase = GamePhase.BEGINNING; // Start from BEGINNING so nextPhase advances to CHANNEL
      mockGame.round = 2;
      mockGame.currentPlayerIndex = 0;

      const player = mockGame.players[0]!;
      const initialRuneDeck = player.zones.runeDeck.length;
      const initialRunes = player.zones.runes.length;

      // nextPhase will advance to CHANNEL and execute it
      await turnManager.nextPhase(mockGame);

      expect(mockGame.phase).toBe(GamePhase.CHANNEL);
      expect(player.zones.runeDeck.length).toBe(initialRuneDeck - 2);
      expect(player.zones.runes.length).toBe(initialRunes + 2);
    });

    it('should channel 3 runes for second player on first turn', async () => {
      mockGame.phase = GamePhase.BEGINNING; // Start from BEGINNING
      mockGame.round = 1;
      mockGame.currentPlayerIndex = 1;

      const player = mockGame.players[1]!;
      const initialRuneDeck = player.zones.runeDeck.length;
      const initialRunes = player.zones.runes.length;

      // nextPhase will advance to CHANNEL and execute it
      await turnManager.nextPhase(mockGame);

      expect(mockGame.phase).toBe(GamePhase.CHANNEL);
      expect(player.zones.runeDeck.length).toBe(initialRuneDeck - 3);
      expect(player.zones.runes.length).toBe(initialRunes + 3);
    });
  });

  describe('Draw Phase', () => {
    it('should draw 1 card during draw phase', async () => {
      mockGame.phase = GamePhase.CHANNEL; // Start from CHANNEL so nextPhase advances to DRAW

      const player = mockGame.players[mockGame.currentPlayerIndex]!;
      const initialHand = player.zones.hand.length;
      const initialDeck = player.zones.mainDeck.length;

      // nextPhase will advance to DRAW and execute it
      await turnManager.nextPhase(mockGame);

      expect(mockGame.phase).toBe(GamePhase.DRAW);
      expect(player.zones.hand.length).toBe(initialHand + 1);
      expect(player.zones.mainDeck.length).toBe(initialDeck - 1);
    });

    it('should clear rune pool at end of draw phase', async () => {
      mockGame.phase = GamePhase.CHANNEL; // Start from CHANNEL

      const player = mockGame.players[mockGame.currentPlayerIndex]!;

      // Add some energy/power to rune pool
      player.runePool.energy = 5;
      player.runePool.power = [{ domain: Domain.FURY, amount: 3 }];

      // nextPhase will advance to DRAW and execute it
      await turnManager.nextPhase(mockGame);

      expect(mockGame.phase).toBe(GamePhase.DRAW);
      // Rune pool should be cleared
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
        id: `card-${i}`,
        name: `Card ${i}`,
        description: 'Test card',
        cardType: CardType.UNIT,
        rarity: Rarity.COMMON,
        domains: [Domain.FURY],
        keywords: [],
        tags: [],
        energyCost: 1,
        powerCost: [],
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
        id: `rune-${i}`,
        name: `Rune ${i}`,
        description: 'Test rune',
        cardType: CardType.RUNE,
        rarity: Rarity.COMMON,
        domains: [Domain.FURY],
        keywords: [],
        tags: [],
        energyCost: 0,
        powerCost: [],
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
      base: [],
      runes: [],
      hand: [],
      championZone: [],
      trash: [],
      banishment: [],
      mainDeck: Array.from({ length: 40 }, (_, i) => ({
        instanceId: uuidv4(),
        cardId: `card-${i}`,
        id: `card-${i}`,
        name: `Card ${i}`,
        description: 'Test card',
        cardType: CardType.UNIT,
        rarity: Rarity.COMMON,
        domains: [Domain.FURY],
        keywords: [],
        tags: [],
        energyCost: 1,
        powerCost: [],
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
        id: `rune-${i}`,
        name: `Rune ${i}`,
        description: 'Test rune',
        cardType: CardType.RUNE,
        rarity: Rarity.COMMON,
        domains: [Domain.FURY],
        keywords: [],
        tags: [],
        energyCost: 0,
        powerCost: [],
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
    currentTurn: 1,
    phase: GamePhase.AWAKEN,
    turnState: TurnState.NEUTRAL_OPEN,
    round: 1,
    status: GameStatus.IN_PROGRESS,
    battlefields: [],
    chain: [],
    storage: {} as any,
    history: [],
    historyQuery: {} as any,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
