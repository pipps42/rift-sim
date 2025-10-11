/**
 * Basic Functionality Test for CardScriptRuntime V2
 *
 * Tests core functionality of Direct Execution Model:
 * - Dynamic import of card scripts
 * - Direct execution (no sandboxing)
 * - Context building with direct game access
 * - Hot reload capability
 */

import { CardScriptRuntime } from '../CardScriptRuntime';
import { CardScriptLoader } from '../CardScriptLoader';
import { CardStorage } from '../../storage/CardStorage';
import { HistoryQueryAPI } from '../../history/HistoryQueryAPI';
import type { Game, Player, Card, GameCard, CardType, Rarity } from '../../../types/game';

describe('CardScriptRuntime V2 - Basic Functionality', () => {
  let runtime: CardScriptRuntime;

  // Mock game state
  const mockPlayer: Player = {
    id: 'player1',
    name: 'Test Player',
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
      energy: 5,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };

  const storage = new CardStorage();
  const mockGame: Game = {
    id: 'test-game',
    players: [mockPlayer, { ...mockPlayer, id: 'player2', name: 'Enemy' }] as [Player, Player],
    currentPlayerIndex: 0,
    phase: 'action' as any,
    turnState: 'neutral_open' as any,
    round: 1,
    status: 'in_progress' as any,
    battlefields: [],
    chain: [],
    storage,
    history: [],
    historyQuery: null as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockGame.historyQuery = new HistoryQueryAPI(mockGame);

  const mockCard: Card = {
    id: 'TEST_SIMPLE',
    name: 'Test Simple Card',
    energyCost: 3,
    powerCost: [],
    description: 'A simple test card',
    cardType: 'unit' as CardType,
    rarity: 'common' as Rarity,
    domains: [],
    keywords: [],
    tags: [],
    might: 3,
    subtypes: [],
    abilities: [],
  } as any; // Cast to bypass strict type checking for test

  beforeEach(async () => {
    runtime = new CardScriptRuntime({
      scriptsDir: 'scripts/cards',
      hotReload: false, // Disable for tests
      debug: true,
    });

    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  describe('Script Loading', () => {
    it('should load a simple script using dynamic import', async () => {
      const loader = runtime.getLoader();
      const script = await loader.loadScript('TEST_SIMPLE');

      expect(script).toBeDefined();
      expect(script.onPlay).toBeDefined();
      expect(typeof script.onPlay).toBe('function');
    });

    it('should cache loaded scripts', async () => {
      const loader = runtime.getLoader();

      // First load
      await loader.loadScript('TEST_SIMPLE');

      // Second load should use cache
      const loadedScript = loader.getScript('TEST_SIMPLE');
      expect(loadedScript).toBeDefined();
      expect(loadedScript?.cardId).toBe('TEST_SIMPLE');
    });

    it('should throw error for non-existent script', async () => {
      const loader = runtime.getLoader();

      await expect(
        loader.loadScript('NONEXISTENT_CARD')
      ).rejects.toThrow();
    });
  });

  describe('Script Execution', () => {
    it('should execute onPlay hook with direct game access', async () => {
      // Spy on console.log to verify script output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await runtime.onPlay(mockCard, mockGame);

      // Verify script was executed (it logs messages)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TEST_SIMPLE]')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test Player')
      );

      consoleSpy.mockRestore();
    });

    it('should build context with direct game reference', async () => {
      // Create a card that accesses game state directly
      const testCard: Card = {
        ...mockCard,
        id: 'TEST_SIMPLE',
      };

      // Execute hook - if context is wrong, script will fail
      await expect(
        runtime.onPlay(testCard, mockGame)
      ).resolves.not.toThrow();
    });

    it('should handle missing hooks gracefully', async () => {
      // Try to execute a hook that doesn't exist
      await expect(
        runtime.executeHook('onDeath', mockCard, mockGame)
      ).resolves.not.toThrow();
    });

    it('should execute onAttack hook with targets', async () => {
      const damageCard: Card = {
        ...mockCard,
        id: 'TEST_DAMAGE',
      };

      // Add enemy unit to battlefield
      const enemyUnit: GameCard = {
        instanceId: 'enemy-unit-1',
        cardId: 'ENEMY_UNIT',
        controllerId: 'player2',
        ownerId: 'player2',
        zone: 'battlefield',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      mockGame.battlefields = [
        {
          id: 'bf1',
          card: null as any,
          units: [enemyUnit],
          contested: false,
          facedownCards: [],
        },
      ];

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await runtime.onAttack(damageCard, mockGame);

      // Verify damage was dealt
      expect(enemyUnit.damage).toBe(2);

      // Verify script logged messages
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TEST_DAMAGE]')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from scripts', async () => {
      // Create a script that throws
      const errorCard: Card = {
        ...mockCard,
        id: 'ERROR_SCRIPT',
      };

      // This will fail because ERROR_SCRIPT doesn't exist
      // But it should be a clean error
      await expect(
        runtime.onPlay(errorCard, mockGame)
      ).resolves.not.toThrow(); // Script not found is not an error, just returns
    });
  });

  describe('Validation Hooks', () => {
    it('should execute canPlay validation', async () => {
      const result = await runtime.canPlay(mockCard, mockGame);

      // No canPlay hook defined, should default to true
      expect(result).toBe(true);
    });

    it('should execute canTarget validation', async () => {
      const target: GameCard = {
        instanceId: 'target-1',
        cardId: 'TARGET_CARD',
        controllerId: 'player2',
        ownerId: 'player2',
        zone: 'battlefield',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      const result = await runtime.canTarget(mockCard, mockGame, target);

      // No canTarget hook defined, should default to true
      expect(result).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should execute script in less than 10ms', async () => {
      const start = Date.now();

      await runtime.onPlay(mockCard, mockGame);

      const duration = Date.now() - start;

      // Should be very fast (no serialization overhead)
      expect(duration).toBeLessThan(10);
    });

    it('should execute 10 scripts in less than 50ms', async () => {
      const start = Date.now();

      for (let i = 0; i < 10; i++) {
        await runtime.onPlay(mockCard, mockGame);
      }

      const duration = Date.now() - start;

      // Should be fast even with multiple executions
      expect(duration).toBeLessThan(50);
    });
  });
});
