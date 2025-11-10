/**
 * Tests for Defy card implementation
 *
 * Basic tests to verify:
 * - Script loads correctly
 * - Metadata is properly defined
 * - Constraints logic works
 * - onPlay hook is callable
 */

import { CardScriptRuntime } from '../../../engine/scripting/CardScriptRuntime';
import { CardStorage } from '../../../engine/storage/CardStorage';
import { HistoryQueryAPI } from '../../../engine/history/HistoryQueryAPI';
import type { Game, Player, GameCard, ChainItemType } from '../../../types/game';
import { Defy } from '../Defy';

describe('Defy Card', () => {
  let runtime: CardScriptRuntime;

  // Mock minimal game state
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
    currentTurn: 1,
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

  beforeEach(async () => {
    runtime = new CardScriptRuntime({
      scriptsDir: 'scripts/cards',
      hotReload: false,
      debug: false,
    });
    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  describe('Script Loading', () => {
    it('should load Defy script from file', async () => {
      const loader = runtime.getLoader();
      const script = await loader.loadScript('defy');

      expect(script).toBeDefined();
      expect(script.onPlay).toBeDefined();
      expect(typeof script.onPlay).toBe('function');
    });

    it('should have metadata with targetRequirements and playConstraints', async () => {
      const loader = runtime.getLoader();
      const script = await loader.loadScript('defy');

      expect(script.metadata).toBeDefined();
      expect(script.metadata?.targetRequirements).toBeDefined();
      expect(script.metadata?.targetRequirements?.length).toBeGreaterThan(0);
      expect(script.metadata?.playConstraints).toBeDefined();
      expect(script.metadata?.playConstraints?.length).toBeGreaterThan(0);
    });
  });

  describe('Direct Script Tests', () => {
    it('should export Defy script with correct structure', () => {
      expect(Defy).toBeDefined();
      expect(Defy.onPlay).toBeDefined();
      expect(Defy.metadata).toBeDefined();
      expect(Defy.metadata?.targetRequirements).toBeDefined();
      expect(Defy.metadata?.playConstraints).toBeDefined();
    });

    it('should have targetRequirements for chain item targeting', () => {
      const targetReq = Defy.metadata?.targetRequirements?.[0];
      expect(targetReq).toBeDefined();
      expect(targetReq?.targetType).toBe('chain_item');
      expect(targetReq?.count).toBe(1);
      expect(targetReq?.optional).toBe(false);
      expect(targetReq?.restrictions).toBeDefined();
      expect(targetReq?.restrictions?.length).toBeGreaterThan(0);
    });

    it('should have constraint that checks power cost', () => {
      const constraint = Defy.metadata?.playConstraints?.[0];
      expect(constraint).toBeDefined();
      expect(constraint?.id).toBe('check_power_cost');
      expect(constraint?.check).toBeDefined();
    });

    it('should fail power cost constraint when target has >1 Power', () => {
      // Create a spell with 2 Power
      const powerfulSpell: GameCard = {
        instanceId: 'spell-1',
        cardId: 'powerful-spell',
        id: 'powerful-spell',
        name: 'Powerful Spell',
        description: 'A powerful spell',
        cardType: 'spell' as any,
        rarity: 'rare' as any,
        energyCost: 2,
        powerCost: [{ domain: 'Fury' as any, amount: 2 }],
        ownerId: 'player2',
        controllerId: 'player2',
        zone: 'base',
        ready: true,
        domains: ['Fury' as any],
        keywords: [],
        tags: [],
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      const chainItem = {
        id: 'chain-1',
        type: 'spell' as ChainItemType,
        sourceCardId: powerfulSpell.instanceId,
        sourceCard: powerfulSpell,
        controllerId: 'player2',
        resolved: false,
        targets: [],
        effects: [],
        timestamp: new Date(),
      };

      const mockCard: GameCard = {
        instanceId: 'defy-1',
        cardId: 'S-DEFY',
        id: 'S-DEFY',
        name: 'Defy',
        description: 'Counter a spell',
        cardType: 'spell' as any,
        rarity: 'common' as any,
        energyCost: 1,
        powerCost: [{ domain: 'Calm' as any, amount: 1 }],
        ownerId: 'player1',
        controllerId: 'player1',
        zone: 'hand',
        ready: true,
        domains: ['Calm' as any],
        keywords: ['REACTION' as any],
        tags: ['counter'],
        scriptPath: 'defy.card.ts',
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      const constraint = Defy.metadata?.playConstraints?.[0];
      if (!constraint) throw new Error('Constraint not found');

      // Create a context with targets populated
      const ctx = {
        self: mockCard,
        owner: mockPlayer,
        opponent: mockGame.players[1]!,
        game: mockGame,
        targets: [chainItem],
        actions: {} as any,
        modifiers: {} as any,
        triggers: {} as any,
      };

      const result = constraint.check(ctx as any);
      expect(result.satisfied).toBe(false);
      expect(result.reason).toContain('Power');
    });

    it('should pass power cost constraint when target has ≤1 Power', () => {
      // Create a valid spell (2 Energy, 1 Power)
      const validSpell: GameCard = {
        instanceId: 'spell-1',
        cardId: 'test-spell',
        id: 'test-spell',
        name: 'Test Spell',
        description: 'A test spell',
        cardType: 'spell' as any,
        rarity: 'common' as any,
        energyCost: 2,
        powerCost: [{ domain: 'Fury' as any, amount: 1 }],
        ownerId: 'player2',
        controllerId: 'player2',
        zone: 'base',
        ready: true,
        domains: ['Fury' as any],
        keywords: [],
        tags: [],
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      const chainItem = {
        id: 'chain-1',
        type: 'spell' as ChainItemType,
        sourceCardId: validSpell.instanceId,
        sourceCard: validSpell,
        controllerId: 'player2',
        resolved: false,
        targets: [],
        effects: [],
        timestamp: new Date(),
      };

      const mockCard: GameCard = {
        instanceId: 'defy-1',
        cardId: 'S-DEFY',
        id: 'S-DEFY',
        name: 'Defy',
        description: 'Counter a spell',
        cardType: 'spell' as any,
        rarity: 'common' as any,
        energyCost: 1,
        powerCost: [{ domain: 'Calm' as any, amount: 1 }],
        ownerId: 'player1',
        controllerId: 'player1',
        zone: 'hand',
        ready: true,
        domains: ['Calm' as any],
        keywords: ['REACTION' as any],
        tags: ['counter'],
        scriptPath: 'defy.card.ts',
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      const constraint = Defy.metadata?.playConstraints?.[0];
      if (!constraint) throw new Error('Constraint not found');

      const ctx = {
        self: mockCard,
        owner: mockPlayer,
        opponent: mockGame.players[1]!,
        game: mockGame,
        targets: [chainItem],
        actions: {} as any,
        modifiers: {} as any,
        triggers: {} as any,
      };

      const result = constraint.check(ctx as any);
      expect(result.satisfied).toBe(true);
    });

    it('should fail power cost constraint when no target provided', () => {
      const mockCard: GameCard = {
        instanceId: 'defy-1',
        cardId: 'S-DEFY',
        id: 'S-DEFY',
        name: 'Defy',
        description: 'Counter a spell',
        cardType: 'spell' as any,
        rarity: 'common' as any,
        energyCost: 1,
        powerCost: [{ domain: 'Calm' as any, amount: 1 }],
        ownerId: 'player1',
        controllerId: 'player1',
        zone: 'hand',
        ready: true,
        domains: ['Calm' as any],
        keywords: ['REACTION' as any],
        tags: ['counter'],
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      const constraint = Defy.metadata?.playConstraints?.[0];
      if (!constraint) throw new Error('Constraint not found');

      const ctx = {
        self: mockCard,
        owner: mockPlayer,
        opponent: mockGame.players[1]!,
        game: mockGame,
        targets: [], // No targets provided
        actions: {} as any,
        modifiers: {} as any,
        triggers: {} as any,
      };

      const result = constraint.check(ctx as any);
      expect(result.satisfied).toBe(false);
      expect(result.reason).toContain('No target');
    });
  });
});
