/**
 * GameManager Targeting Integration Tests
 *
 * Tests for the integration between GameManager and TargetingSystem
 * Verifies that:
 * - Cards with target requirements can be played with valid targets
 * - Invalid targets are rejected
 * - Resolved targets are passed correctly to card scripts
 */

import { GameManager } from '../GameManager';
import type { Player, Deck, GameCard, Target } from '../../../types/game';
import { TargetType, TargetProperty, ComparisonOperator, CardType, Domain } from '../../../types/game';
import type { CardScript } from '../../scripting/types/CardScriptTypes';

describe('GameManager - Targeting Integration', () => {
  let gameManager: GameManager;
  let gameId: string;
  let player1: Player;
  let player2: Player;

  // Mock card script with target requirements
  const damageSpellScript: CardScript = {
    metadata: {
      targetRequirements: [
        {
          targetType: TargetType.UNIT,
          count: 1,
          optional: false,
          restrictions: [],
        },
      ],
    },
    onPlay: async (ctx) => {
      // Deal 3 damage to target
      if (ctx.targets && ctx.targets.length > 0) {
        const target = ctx.targets[0] as GameCard;
        await ctx.actions.dealDamage(target, 3, 'effect');
      }
    },
  };

  // Mock card script with restrictions
  const restrictedDamageScript: CardScript = {
    metadata: {
      targetRequirements: [
        {
          targetType: TargetType.UNIT,
          count: 1,
          optional: false,
          restrictions: [
            {
              property: TargetProperty.DOMAIN,
              operator: ComparisonOperator.CONTAINS,
              value: 'Fury',
            },
          ],
        },
      ],
    },
    onPlay: async (ctx) => {
      if (ctx.targets && ctx.targets.length > 0) {
        const target = ctx.targets[0] as GameCard;
        await ctx.actions.dealDamage(target, 5, 'effect');
      }
    },
  };

  // Mock card script with multiple targets
  const multiTargetScript: CardScript = {
    metadata: {
      targetRequirements: [
        {
          targetType: TargetType.UNIT,
          count: 2,
          optional: false,
          restrictions: [],
        },
      ],
    },
    onPlay: async (ctx) => {
      if (ctx.targets) {
        for (const target of ctx.targets) {
          await ctx.actions.dealDamage(target as GameCard, 2, 'effect');
        }
      }
    },
  };

  // Mock card script with optional target
  const optionalTargetScript: CardScript = {
    metadata: {
      targetRequirements: [
        {
          targetType: TargetType.UNIT,
          count: 1,
          optional: true,
          restrictions: [],
        },
      ],
    },
    onPlay: async (ctx) => {
      if (ctx.targets && ctx.targets.length > 0) {
        const target = ctx.targets[0] as GameCard;
        await ctx.actions.dealDamage(target, 2, 'effect');
      }
      // Always draw a card
      await ctx.actions.draw(1);
    },
  };

  beforeEach(async () => {
    gameManager = new GameManager();
    await gameManager.initialize();

    // Create mock players
    player1 = createMockPlayer('player1', 'Player 1');
    player2 = createMockPlayer('player2', 'Player 2');

    // Create mock decks
    const deck1 = createMockDeck(player1.id);
    const deck2 = createMockDeck(player2.id);

    // Create game
    const result = await gameManager.createGame([player1, player2], [deck1, deck2]);
    gameId = result.id;

    // Start the game
    await gameManager.startGame(gameId);
  });

  describe('Valid Targets', () => {
    it('should play damage spell with valid unit target', async () => {
      // Arrange: Add a damage spell to player1's hand
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const damageSpell = createMockCard('damage-spell', 'Damage Spell', CardType.SPELL, player1.id);
      damageSpell.scriptPath = 'damage-spell.ts';
      player1.zones.hand.push(damageSpell);

      // Add a unit to battlefield as target
      const targetUnit = createMockCard('target-unit', 'Target Unit', CardType.UNIT, player2.id);
      targetUnit.might = 5;
      const battlefield = game.battlefields[0];
      if (!battlefield) throw new Error('No battlefield');
      battlefield.units.push(targetUnit);

      // Mock the script loader to return our damage spell script
      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(damageSpellScript);

      // Prepare target
      const targets: Target[] = [
        {
          type: TargetType.UNIT,
          cardId: targetUnit.instanceId,
          restrictions: [],
        },
      ];

      // Act
      const result = await gameManager.playCard(gameId, player1.id, damageSpell.instanceId, targets);

      // Assert
      expect(result.success).toBe(true);
      // Unit should have 3 damage
      expect(targetUnit.damage).toBe(3);
    });

    it('should reject damage spell without required target', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const damageSpell = createMockCard('damage-spell', 'Damage Spell', CardType.SPELL, player1.id);
      damageSpell.scriptPath = 'damage-spell.ts';
      player1.zones.hand.push(damageSpell);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(damageSpellScript);

      // Act: Try to play without targets
      const result = await gameManager.playCard(gameId, player1.id, damageSpell.instanceId, []);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing required target');
    });

    it('should reject damage spell with invalid target type', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const damageSpell = createMockCard('damage-spell', 'Damage Spell', CardType.SPELL, player1.id);
      damageSpell.scriptPath = 'damage-spell.ts';
      player1.zones.hand.push(damageSpell);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(damageSpellScript);

      // Prepare invalid target (player instead of unit)
      const targets: Target[] = [
        {
          type: TargetType.PLAYER,
          playerId: player2.id,
          restrictions: [],
        },
      ];

      // Act
      const result = await gameManager.playCard(gameId, player1.id, damageSpell.instanceId, targets);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid target type');
    });

    it('should reject damage spell with target that fails restrictions', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const restrictedSpell = createMockCard('restricted-spell', 'Restricted Spell', CardType.SPELL, player1.id);
      restrictedSpell.scriptPath = 'restricted-spell.ts';
      player1.zones.hand.push(restrictedSpell);

      // Add a Calm unit (should be rejected - script requires Fury)
      const calmUnit = createMockCard('calm-unit', 'Calm Unit', CardType.UNIT, player2.id);
      calmUnit.domains = ['Calm' as Domain];
      const battlefield = game.battlefields[0];
      if (!battlefield) throw new Error('No battlefield');
      battlefield.units.push(calmUnit);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(restrictedDamageScript);

      const targets: Target[] = [
        {
          type: TargetType.UNIT,
          cardId: calmUnit.instanceId,
          restrictions: [],
        },
      ];

      // Act
      const result = await gameManager.playCard(gameId, player1.id, restrictedSpell.instanceId, targets);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('restriction');
    });
  });

  describe('Multiple Targets', () => {
    it('should play spell with multiple valid targets', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const multiSpell = createMockCard('multi-spell', 'Multi Spell', CardType.SPELL, player1.id);
      multiSpell.scriptPath = 'multi-spell.ts';
      player1.zones.hand.push(multiSpell);

      const unit1 = createMockCard('unit1', 'Unit 1', CardType.UNIT, player2.id);
      unit1.might = 5;
      const unit2 = createMockCard('unit2', 'Unit 2', CardType.UNIT, player2.id);
      unit2.might = 5;

      const battlefield = game.battlefields[0];
      if (!battlefield) throw new Error('No battlefield');
      battlefield.units.push(unit1, unit2);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(multiTargetScript);

      const targets: Target[] = [
        {
          type: TargetType.UNIT,
          cardId: unit1.instanceId,
          restrictions: [],
        },
        {
          type: TargetType.UNIT,
          cardId: unit2.instanceId,
          restrictions: [],
        },
      ];

      // Act
      const result = await gameManager.playCard(gameId, player1.id, multiSpell.instanceId, targets);

      // Assert
      expect(result.success).toBe(true);
      expect(unit1.damage).toBe(2);
      expect(unit2.damage).toBe(2);
    });

    it('should reject spell with too many targets', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const damageSpell = createMockCard('damage-spell', 'Damage Spell', CardType.SPELL, player1.id);
      damageSpell.scriptPath = 'damage-spell.ts';
      player1.zones.hand.push(damageSpell);

      const unit1 = createMockCard('unit1', 'Unit 1', CardType.UNIT, player2.id);
      const unit2 = createMockCard('unit2', 'Unit 2', CardType.UNIT, player2.id);

      const battlefield = game.battlefields[0];
      if (!battlefield) throw new Error('No battlefield');
      battlefield.units.push(unit1, unit2);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(damageSpellScript);

      const targets: Target[] = [
        { type: TargetType.UNIT, cardId: unit1.instanceId, restrictions: [] },
        { type: TargetType.UNIT, cardId: unit2.instanceId, restrictions: [] },
      ];

      // Act
      const result = await gameManager.playCard(gameId, player1.id, damageSpell.instanceId, targets);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many targets');
    });
  });

  describe('Optional Targets', () => {
    it('should play spell with optional target provided', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const optionalSpell = createMockCard('optional-spell', 'Optional Spell', CardType.SPELL, player1.id);
      optionalSpell.scriptPath = 'optional-spell.ts';
      player1.zones.hand.push(optionalSpell);

      const targetUnit = createMockCard('target-unit', 'Target Unit', CardType.UNIT, player2.id);
      targetUnit.might = 5;

      const battlefield = game.battlefields[0];
      if (!battlefield) throw new Error('No battlefield');
      battlefield.units.push(targetUnit);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(optionalTargetScript);

      const targets: Target[] = [
        {
          type: TargetType.UNIT,
          cardId: targetUnit.instanceId,
          restrictions: [],
        },
      ];

      // Act
      const result = await gameManager.playCard(gameId, player1.id, optionalSpell.instanceId, targets);

      // Assert
      expect(result.success).toBe(true);
      expect(targetUnit.damage).toBe(2); // Target took damage
    });

    it('should play spell with optional target omitted', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      const optionalSpell = createMockCard('optional-spell', 'Optional Spell', CardType.SPELL, player1.id);
      optionalSpell.scriptPath = 'optional-spell.ts';
      player1.zones.hand.push(optionalSpell);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(optionalTargetScript);

      // Act: Play without targets
      const result = await gameManager.playCard(gameId, player1.id, optionalSpell.instanceId, []);

      // Assert
      expect(result.success).toBe(true);
      // Card should still work (draws a card)
      expect(player1.zones.hand.length).toBeGreaterThan(0);
    });
  });

  describe('Target Resolution', () => {
    it('should pass resolved targets to card script context', async () => {
      // Arrange
      const game = gameManager['games'].get(gameId);
      if (!game) throw new Error('Game not found');

      let receivedTarget: any = null;

      const verifyScript: CardScript = {
        metadata: {
          targetRequirements: [
            {
              targetType: TargetType.UNIT,
              count: 1,
              optional: false,
              restrictions: [],
            },
          ],
        },
        onPlay: async (ctx) => {
          receivedTarget = ctx.targets?.[0];
        },
      };

      const spell = createMockCard('verify-spell', 'Verify Spell', CardType.SPELL, player1.id);
      spell.scriptPath = 'verify-spell.ts';
      player1.zones.hand.push(spell);

      const targetUnit = createMockCard('target-unit', 'Target Unit', CardType.UNIT, player2.id);
      const battlefield = game.battlefields[0];
      if (!battlefield) throw new Error('No battlefield');
      battlefield.units.push(targetUnit);

      jest.spyOn(gameManager['cardScriptRuntime'].getLoader(), 'loadScript')
        .mockResolvedValueOnce(verifyScript);

      const targets: Target[] = [
        {
          type: TargetType.UNIT,
          cardId: targetUnit.instanceId,
          restrictions: [],
        },
      ];

      // Act
      await gameManager.playCard(gameId, player1.id, spell.instanceId, targets);

      // Assert
      expect(receivedTarget).toBeDefined();
      expect(receivedTarget).toBe(targetUnit); // Should be the actual unit object
      expect(receivedTarget.instanceId).toBe(targetUnit.instanceId);
    });
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createMockPlayer(id: string, name: string): Player {
  const mockLegend: any = {
    id: `legend-${id}`,
    name: `Legend for ${name}`,
    cardType: CardType.LEGEND,
    description: 'Mock legend card',
    rarity: 'mythic',
    energyCost: 0,
    powerCost: [],
    domains: [],
    keywords: [],
    tags: [],
    domainIdentity: [],
    championTag: 'test-champion',
    legendaryAbility: {
      id: 'test-ability',
      name: 'Test Ability',
      description: 'Test',
      effects: [],
    },
  };

  return {
    id,
    name,
    score: 0,
    championLegend: mockLegend,
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
      energy: 10,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };
}

function createMockDeck(playerId: string): Deck {
  return {
    id: `deck-${playerId}`,
    name: 'Test Deck',
    playerId,
    championLegend: 'test-champion',
    chosenChampion: 'test-champion',
    mainDeck: Array(40).fill({ cardId: 'test-card', quantity: 1 }),
    runeDeck: Array(12).fill({ cardId: 'test-rune', quantity: 1 }),
    battlefields: ['test-battlefield-1', 'test-battlefield-2', 'test-battlefield-3'],
    isValid: true,
    validationErrors: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createMockCard(
  instanceId: string,
  name: string,
  cardType: CardType,
  ownerId: string
): GameCard {
  return {
    instanceId,
    cardId: `card-${instanceId}`,
    id: `card-${instanceId}`,
    name,
    description: `Description for ${name}`,
    cardType,
    rarity: 'common' as any,
    energyCost: 1,
    powerCost: [],
    ownerId,
    controllerId: ownerId,
    zone: 'hand',
    ready: true,
    domains: [],
    keywords: [],
    tags: [],
    damage: 0,
    temporaryModifiers: [],
    counters: [],
  };
}
