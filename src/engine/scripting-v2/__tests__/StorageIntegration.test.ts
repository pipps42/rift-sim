/**
 * Storage Integration Test
 *
 * Tests integration of CardStorage with CardScriptRuntime.
 * Verifies the Yasuo/Nexus pattern works end-to-end.
 */

import { CardScriptRuntime } from '../CardScriptRuntime';
import { CardStorage } from '../../storage/CardStorage';
import { HistoryQueryAPI } from '../../history/HistoryQueryAPI';
import type { Game, Player, Card, GameCard, CardType, Rarity } from '../../../types/game';

describe('CardStorage Integration', () => {
  let runtime: CardScriptRuntime;
  let storage: CardStorage;
  let mockGame: Game;

  beforeEach(async () => {
    runtime = new CardScriptRuntime({
      scriptsDir: 'scripts/cards',
      hotReload: false,
      debug: false,
    });

    storage = new CardStorage();

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

    mockGame = {
      id: 'test-game',
      players: [mockPlayer, { ...mockPlayer, id: 'player2', name: 'Enemy' }] as [Player, Player],
      currentPlayerIndex: 0,
      phase: 'action' as any,
      turnState: 'neutral_open' as any,
      round: 1,
      status: 'in_progress' as any,
      battlefields: [],
      chain: [],
      storage, // ⭐ NEW: Add storage to game
      history: [],
      historyQuery: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGame.historyQuery = new HistoryQueryAPI(mockGame);

    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  describe('Nexus Spell Tracking', () => {
    it('should track spells cast this turn', async () => {
      const nexusCard: Card = {
        id: 'TEST_STORAGE_NEXUS',
        name: 'Nexus',
        energyCost: 0,
        powerCost: [],
        description: 'Tracks spells',
        cardType: 'unit' as CardType,
        rarity: 'common' as Rarity,
        domains: [],
        keywords: [],
        tags: [],
      } as any;

      // Create Nexus instance
      const nexusInstance: GameCard = {
        instanceId: 'nexus-p1',
        cardId: 'TEST_STORAGE_NEXUS',
        controllerId: 'player1',
        ownerId: 'player1',
        zone: 'base',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      // Add to game
      mockGame.players[0].zones.base.push(nexusInstance);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Cast 3 spells
      await runtime.executeHook('onSpellCast', nexusCard, mockGame);
      await runtime.executeHook('onSpellCast', nexusCard, mockGame);
      await runtime.executeHook('onSpellCast', nexusCard, mockGame);

      // Verify counter
      const spellCount = storage.getCardStorage('nexus-p1').get('spellsCastThisTurn');
      expect(spellCount).toBe(3);

      // End turn
      await runtime.executeHook('onTurnEnd', nexusCard, mockGame);

      // Counter should be reset
      const resetCount = storage.getCardStorage('nexus-p1').get('spellsCastThisTurn');
      expect(resetCount).toBe(0);

      consoleSpy.mockRestore();
    });
  });

  describe('Yasuo Reading from Nexus', () => {
    it('should read spell count from Nexus and deal damage', async () => {
      const yasuoCard: Card = {
        id: 'TEST_STORAGE_YASUO',
        name: 'Yasuo',
        energyCost: 4,
        powerCost: [],
        description: 'Deals damage based on spells cast',
        cardType: 'unit' as CardType,
        rarity: 'champion' as Rarity,
        domains: [],
        keywords: [],
        tags: [],
      } as any;

      // Setup Nexus with spell counter
      storage.getCardStorage('nexus-p1').set('spellsCastThisTurn', 3);

      // Add enemy unit
      const enemyUnit: GameCard = {
        instanceId: 'enemy-1',
        cardId: 'ENEMY',
        controllerId: 'player2',
        ownerId: 'player2',
        zone: 'battlefield',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      mockGame.battlefields = [{
        id: 'bf1',
        card: null as any,
        units: [enemyUnit],
        contested: false,
        facedownCards: [],
      }];

      // Add Yasuo to game
      const yasuoInstance: GameCard = {
        instanceId: 'yasuo-1',
        cardId: 'TEST_STORAGE_YASUO',
        controllerId: 'player1',
        ownerId: 'player1',
        zone: 'battlefield',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };
      mockGame.players[0].zones.base.push(yasuoInstance);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Yasuo attacks
      await runtime.executeHook('onAttack', yasuoCard, mockGame, {
        eventData: { nexusId: 'nexus-p1' }
      });

      // Enemy should have taken 3 damage
      expect(enemyUnit.damage).toBe(3);

      // Verify logs
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('3 spells cast this turn')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Unit Attack Counter', () => {
    it('should track unit attacks across multiple combats', async () => {
      const unitCard: Card = {
        id: 'TEST_STORAGE_UNIT',
        name: 'Storage Unit',
        energyCost: 2,
        powerCost: [],
        description: 'Tracks attacks',
        cardType: 'unit' as CardType,
        rarity: 'common' as Rarity,
        domains: [],
        keywords: [],
        tags: [],
      } as any;

      const unitInstance: GameCard = {
        instanceId: 'unit-1',
        cardId: 'TEST_STORAGE_UNIT',
        controllerId: 'player1',
        ownerId: 'player1',
        zone: 'battlefield',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      mockGame.players[0].zones.base.push(unitInstance);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Unit enters play
      await runtime.executeHook('onEntersPlay', unitCard, mockGame);

      // Attack 3 times
      await runtime.executeHook('onAttack', unitCard, mockGame);
      await runtime.executeHook('onAttack', unitCard, mockGame);
      await runtime.executeHook('onAttack', unitCard, mockGame);

      // Verify counter
      const attackCount = storage.getCardStorage('unit-1').get('attacksThisGame');
      expect(attackCount).toBe(3);

      // Unit leaves play
      await runtime.executeHook('onLeavesPlay', unitCard, mockGame);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('after 3 attacks')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Storage Performance', () => {
    it('should handle storage operations efficiently', () => {
      const start = Date.now();

      // Create 100 card instances with storage
      for (let i = 0; i < 100; i++) {
        const cardStorage = storage.getCardStorage(`card-${i}`);
        cardStorage.set('counter', 0);

        // Increment 10 times each
        for (let j = 0; j < 10; j++) {
          cardStorage.increment('counter');
        }
      }

      const duration = Date.now() - start;

      // Should complete in less than 50ms
      expect(duration).toBeLessThan(50);

      // Verify correctness
      expect(storage.getCardStorage('card-0').get('counter')).toBe(10);
      expect(storage.getCardStorage('card-99').get('counter')).toBe(10);
      expect(storage.getCardCount()).toBe(100);
    });
  });

  describe('Storage Cleanup', () => {
    it('should cleanup storage when cards leave game', () => {
      // Add storage for 5 cards
      storage.getCardStorage('card-1').set('data', 'value');
      storage.getCardStorage('card-2').set('data', 'value');
      storage.getCardStorage('card-3').set('data', 'value');

      expect(storage.getCardCount()).toBe(3);

      // Remove one card
      storage.clearCardStorage('card-2');

      expect(storage.getCardCount()).toBe(2);
      expect(storage.hasCardStorage('card-1')).toBe(true);
      expect(storage.hasCardStorage('card-2')).toBe(false);
      expect(storage.hasCardStorage('card-3')).toBe(true);
    });
  });
});
