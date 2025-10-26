/**
 * Migrated Cards Test
 *
 * Tests that cards migrated from V1 (isolated-vm) to V2 (direct execution)
 * work correctly with the new runtime.
 */

import { CardScriptRuntime } from '../CardScriptRuntime';
import { CardStorage } from '../../storage/CardStorage';
import { HistoryQueryAPI } from '../../history/HistoryQueryAPI';
import type { Game, Player, Card, GameCard, CardType, Rarity } from '../../../types/game';
import { EventType } from '../../../types/game';

describe('Migrated Cards - V1 to V2', () => {
  let runtime: CardScriptRuntime;
  let storage: CardStorage;
  let mockGame: Game;
  let mockPlayer: Player;

  beforeEach(async () => {
    runtime = new CardScriptRuntime({
      scriptsDir: 'scripts/cards',
      hotReload: false,
      debug: false,
    });

    storage = new CardStorage();

    mockPlayer = {
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
        energy: 3,
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
      storage,
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

  describe('Basic Rune', () => {
    let runeCard: Card;
    let runeInstance: GameCard;

    beforeEach(() => {
      runeCard = {
        id: 'BASIC_RUNE_FURY',
        name: 'Fury Rune',
        energyCost: 0,
        powerCost: [],
        description: '[T]: Add [1] energy. Recycle this: Add [Fury] power.',
        cardType: 'rune' as CardType,
        rarity: 'common' as Rarity,
        domains: ['fury'],
        keywords: [],
        tags: ['rune', 'basic'],
        scriptPath: 'cards/basic-rune.ts',
      } as any;

      runeInstance = {
        instanceId: 'rune-1',
        cardId: 'BASIC_RUNE_FURY',
        controllerId: 'player1',
        ownerId: 'player1',
        zone: 'runes',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      // Add rune to player's rune zone
      mockGame.players[0].zones.runes.push(runeInstance);
    });

    it('should load basic-rune script', async () => {
      const loader = runtime.getLoader();
      const script = await loader.loadScript('basic-rune');

      expect(script).toBeDefined();
      expect(script.onTap).toBeDefined();
      expect(script.onRecycle).toBeDefined();
    });

    it('should tap rune to add 1 energy', async () => {
      const initialEnergy = mockPlayer.runePool.energy;

      await runtime.executeHook('onTap', runeCard, mockGame);

      expect(mockPlayer.runePool.energy).toBe(initialEnergy + 1);
      expect(runeInstance.ready).toBe(false); // Should be exhausted
    });

    it('should throw error if tapping exhausted rune', async () => {
      runeInstance.ready = false;

      await expect(
        runtime.executeHook('onTap', runeCard, mockGame)
      ).rejects.toThrow('already exhausted');
    });

    it('should recycle rune to add domain power', async () => {
      await runtime.executeHook('onRecycle', runeCard, mockGame, {
        eventData: { domain: 'fury' },
      });

      // Rune should be moved from runes zone to runeDeck
      expect(mockPlayer.zones.runes).toHaveLength(0);
      expect(mockPlayer.zones.runeDeck).toHaveLength(1);
      expect(mockPlayer.zones.runeDeck[0]!.instanceId).toBe('rune-1');

      // Power pool should have 1 fury
      const furyPower = mockPlayer.runePool.power.find(p => p.domain === 'fury');
      expect(furyPower).toBeDefined();
      expect(furyPower!.amount).toBe(1);
    });

    it('should add recycle event to history', async () => {
      await runtime.executeHook('onRecycle', runeCard, mockGame, {
        eventData: { domain: 'fury' },
      });

      const recycleEvents = mockGame.history.filter(e => e.type === EventType.RUNE_RECYCLE);
      expect(recycleEvents).toHaveLength(1);
      expect(recycleEvents[0]!.data.domain).toBe('fury');
    });
  });

  describe('Playful Phantom', () => {
    let phantomCard: Card;
    let phantomInstance: GameCard;

    beforeEach(() => {
      phantomCard = {
        id: 'PLAYFUL_PHANTOM',
        name: 'Playful Phantom',
        energyCost: 5,
        powerCost: [],
        description: 'A simple vanilla unit.',
        cardType: 'unit' as CardType,
        rarity: 'common' as Rarity,
        domains: ['calm'],
        keywords: [],
        tags: ['spirit', 'calm'],
        scriptPath: 'cards/playful-phantom.ts',
      } as any;

      phantomInstance = {
        instanceId: 'phantom-1',
        cardId: 'PLAYFUL_PHANTOM',
        controllerId: 'player1',
        ownerId: 'player1',
        zone: 'battlefield',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      mockGame.players[0].zones.base.push(phantomInstance);
    });

    it('should load playful-phantom script', async () => {
      const loader = runtime.getLoader();
      const script = await loader.loadScript('playful-phantom');

      expect(script).toBeDefined();
      expect(script.onEntersPlay).toBeDefined();
      expect(script.onLeavesPlay).toBeDefined();
      expect(script.onDeath).toBeDefined();
      expect(script.onAttack).toBeDefined();
    });

    it('should add UNIT_PLAYED event when entering play', async () => {
      await runtime.executeHook('onEntersPlay', phantomCard, mockGame);

      const playEvents = mockGame.history.filter(e => e.type === EventType.UNIT_PLAYED);
      expect(playEvents).toHaveLength(1);
      expect(playEvents[0]!.cardId).toBe('phantom-1');
    });

    it('should track attacks in storage', async () => {
      await runtime.executeHook('onAttack', phantomCard, mockGame);
      await runtime.executeHook('onAttack', phantomCard, mockGame);
      await runtime.executeHook('onAttack', phantomCard, mockGame);

      const attackCount = storage.getCardStorage('phantom-1').get('attacksThisGame');
      expect(attackCount).toBe(3);
    });

    it('should add ATTACK events to history', async () => {
      await runtime.executeHook('onAttack', phantomCard, mockGame);

      const attackEvents = mockGame.history.filter(e => e.type === EventType.ATTACK);
      expect(attackEvents).toHaveLength(1);
      expect(attackEvents[0]!.cardId).toBe('phantom-1');
    });

    it('should add UNIT_DEATH event when dying', async () => {
      phantomInstance.damage = 5; // Lethal damage

      await runtime.executeHook('onDeath', phantomCard, mockGame);

      const deathEvents = mockGame.history.filter(e => e.type === EventType.UNIT_DEATH);
      expect(deathEvents).toHaveLength(1);
      expect(deathEvents[0]!.data.damage).toBe(5);
    });

    it('should cleanup storage when leaving play', async () => {
      // First create some storage
      storage.getCardStorage('phantom-1').set('testData', 'value');
      expect(storage.hasCardStorage('phantom-1')).toBe(true);

      await runtime.executeHook('onLeavesPlay', phantomCard, mockGame);

      expect(storage.hasCardStorage('phantom-1')).toBe(false);
    });
  });

  describe('Cross-Script Integration', () => {
    it('should work with multiple runes in sequence', async () => {
      // Create 3 different basic runes
      const runes = ['FURY', 'CALM', 'MIND'].map((domain, i) => ({
        card: {
          id: `BASIC_RUNE_${domain}`,
          name: `${domain} Rune`,
          domains: [domain.toLowerCase()],
          scriptPath: 'cards/basic-rune.ts',
        } as any,
        instance: {
          instanceId: `rune-${i}`,
          cardId: `BASIC_RUNE_${domain}`,
          controllerId: 'player1',
          ownerId: 'player1',
          zone: 'runes',
          ready: true,
          damage: 0,
          temporaryModifiers: [],
          counters: [],
        },
      }));

      // Add all runes to player
      runes.forEach(r => mockPlayer.zones.runes.push(r.instance));

      // Recycle all runes
      for (const rune of runes) {
        await runtime.executeHook('onRecycle', rune.card, mockGame, {
          eventData: { domain: rune.card.domains[0] },
        });
      }

      // Should have 3 different power types
      expect(mockPlayer.runePool.power).toHaveLength(3);
      expect(mockPlayer.runePool.power.find(p => p.domain === 'fury')?.amount).toBe(1);
      expect(mockPlayer.runePool.power.find(p => p.domain === 'calm')?.amount).toBe(1);
      expect(mockPlayer.runePool.power.find(p => p.domain === 'mind')?.amount).toBe(1);

      // All runes should be in runeDeck
      expect(mockPlayer.zones.runeDeck).toHaveLength(3);
      expect(mockPlayer.zones.runes).toHaveLength(0);
    });
  });
});
