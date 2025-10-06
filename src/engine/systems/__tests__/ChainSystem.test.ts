import { ChainSystem } from '../ChainSystem';
import {
  Game,
  ChainItem,
  ChainItemType,
  SpellTiming,
  TurnState,
  GamePhase,
  GameStatus
} from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

describe('ChainSystem', () => {
  let chainSystem: ChainSystem;
  let mockGame: Game;

  beforeEach(() => {
    chainSystem = new ChainSystem();
    mockGame = createMockGame();
  });

  describe('push', () => {
    it('should add item to chain and change turn state to Closed', () => {
      const item = createMockChainItem(SpellTiming.NORMAL);
      mockGame.turnState = TurnState.NEUTRAL_OPEN;

      const result = chainSystem.push(mockGame, item);

      expect(result).toBe(true);
      expect(chainSystem.getDepth()).toBe(1);
      expect(mockGame.turnState).toBe(TurnState.NEUTRAL_CLOSED);
    });

    it('should reject Normal timing spell during Showdown', () => {
      const item = createMockChainItem(SpellTiming.NORMAL);
      mockGame.turnState = TurnState.SHOWDOWN_OPEN;

      const result = chainSystem.push(mockGame, item);

      expect(result).toBe(false);
      expect(chainSystem.getDepth()).toBe(0);
    });

    it('should accept Action timing spell during Showdown', () => {
      const item = createMockChainItem(SpellTiming.ACTION);
      mockGame.turnState = TurnState.SHOWDOWN_OPEN;

      const result = chainSystem.push(mockGame, item);

      expect(result).toBe(true);
      expect(chainSystem.getDepth()).toBe(1);
    });

    it('should accept Reaction timing spell anytime', () => {
      const item = createMockChainItem(SpellTiming.REACTION);
      mockGame.turnState = TurnState.NEUTRAL_CLOSED;

      const result = chainSystem.push(mockGame, item);

      expect(result).toBe(true);
      expect(chainSystem.getDepth()).toBe(1);
    });
  });

  describe('resolve', () => {
    it('should resolve all items in LIFO order', async () => {
      const item1 = createMockChainItem(SpellTiming.NORMAL, 'item1');
      const item2 = createMockChainItem(SpellTiming.REACTION, 'item2');

      mockGame.turnState = TurnState.NEUTRAL_OPEN;
      chainSystem.push(mockGame, item1);
      chainSystem.push(mockGame, item2);

      expect(chainSystem.getDepth()).toBe(2);

      await chainSystem.resolve(mockGame);

      expect(chainSystem.isEmpty()).toBe(true);
      expect(mockGame.turnState).toBe(TurnState.NEUTRAL_OPEN);
    });

    it('should return to Open state after resolution', async () => {
      const item = createMockChainItem(SpellTiming.NORMAL);
      mockGame.turnState = TurnState.NEUTRAL_OPEN;

      chainSystem.push(mockGame, item);
      expect(mockGame.turnState).toBe(TurnState.NEUTRAL_CLOSED);

      await chainSystem.resolve(mockGame);
      expect(mockGame.turnState).toBe(TurnState.NEUTRAL_OPEN);
    });
  });

  describe('isEmpty', () => {
    it('should return true when chain is empty', () => {
      expect(chainSystem.isEmpty()).toBe(true);
    });

    it('should return false when chain has items', () => {
      const item = createMockChainItem(SpellTiming.NORMAL);
      mockGame.turnState = TurnState.NEUTRAL_OPEN;
      chainSystem.push(mockGame, item);

      expect(chainSystem.isEmpty()).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      const item1 = createMockChainItem(SpellTiming.NORMAL, 'item1', 'player1');
      const item2 = createMockChainItem(SpellTiming.REACTION, 'item2', 'player2');

      mockGame.turnState = TurnState.NEUTRAL_OPEN;
      chainSystem.push(mockGame, item1);
      chainSystem.push(mockGame, item2);

      const stats = chainSystem.getStats();

      expect(stats.depth).toBe(2);
      expect(stats.itemsByType[ChainItemType.SPELL]).toBe(2);
      expect(stats.itemsByPlayer['player1']).toBe(1);
      expect(stats.itemsByPlayer['player2']).toBe(1);
    });
  });
});

// Helper functions
function createMockGame(): Game {
  return {
    id: uuidv4(),
    players: [
      {
        id: 'player1',
        name: 'Player 1',
        score: 0,
        championLegend: {} as any,
        zones: {} as any,
        runePool: { energy: 0, power: [] },
        hasPlayedCard: false,
        turnsPassed: 0
      },
      {
        id: 'player2',
        name: 'Player 2',
        score: 0,
        championLegend: {} as any,
        zones: {} as any,
        runePool: { energy: 0, power: [] },
        hasPlayedCard: false,
        turnsPassed: 0
      }
    ],
    currentPlayerIndex: 0,
    phase: GamePhase.ACTION,
    turnState: TurnState.NEUTRAL_OPEN,
    round: 1,
    status: GameStatus.IN_PROGRESS,
    battlefields: [],
    chain: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function createMockChainItem(
  timing: SpellTiming,
  id?: string,
  controllerId: string = 'player1'
): ChainItem {
  return {
    id: id || uuidv4(),
    type: ChainItemType.SPELL,
    sourceCardId: uuidv4(),
    controllerId,
    targets: [],
    effects: [],
    spellTiming: timing,
    timestamp: new Date(),
    resolved: false
  };
}
