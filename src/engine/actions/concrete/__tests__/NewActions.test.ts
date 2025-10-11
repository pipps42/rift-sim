/**
 * Tests for new V3 actions (Phase A additions)
 *
 * Tests:
 * - ChannelRuneAction
 * - StunUnitAction
 * - BanishCardAction
 * - RevealCardAction
 * - CounterSpellAction
 * - HealDamageAction
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ChannelRuneAction,
  StunUnitAction,
  BanishCardAction,
  RevealCardAction,
  CounterSpellAction,
  HealDamageAction,
} from '../index';
import type { Game, Player, GameCard } from '../../../../types/game';

// ============================================================================
// MOCK SETUP
// ============================================================================

function createMockGame(players?: Player[]): Game {
  const game = {
    id: 'test-game',
    history: [],
    players: players || [],
    battlefields: [
      { id: 'bf-1', units: [], card: {} as any, contested: false, facedownCards: [], scoredThisTurn: false },
      { id: 'bf-2', units: [], card: {} as any, contested: false, facedownCards: [], scoredThisTurn: false },
    ],
    chain: [],
    activePlayer: null,
    turnState: 'neutral_open',
    phase: 'action',
  } as any;

  return game;
}

function createMockPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    score: 0,
    zones: {
      hand: [],
      mainDeck: [],
      runeDeck: [],
      base: [],
      trash: [],
      banishment: [],
      championZone: [],
      runes: [],
    },
    runePool: { energy: 0, power: [] },
  } as any;
}

function createMockCard(instanceId: string, cardId: string, ownerId: string): GameCard {
  return {
    instanceId,
    cardId,
    ownerId,
    controllerId: ownerId,
    type: 'unit',
    ready: true,
    zone: 'hand',
  } as any;
}

describe('New V3 Actions - Phase A', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    // Create mock game with 2 players
    player1 = createMockPlayer('p1', 'Player 1');
    player2 = createMockPlayer('p2', 'Player 2');
    game = createMockGame([player1, player2]);

    // Setup some runes in player1's rune deck
    for (let i = 0; i < 12; i++) {
      const rune = createMockCard(`rune-${i}`, 'basic-rune', 'p1');
      (rune as any).type = 'rune';
      rune.ready = false;
      player1.zones.runeDeck.push(rune);
    }
  });

  // =========================================================================
  // CHANNEL RUNE ACTION
  // =========================================================================

  describe('ChannelRuneAction', () => {
    it('should channel 2 runes from deck to base', () => {
      const action = new ChannelRuneAction(player1, { amount: 2 });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);

      // Check runes moved
      expect(player1.zones.runeDeck.length).toBe(10); // 12 - 2
      expect(player1.zones.base.length).toBe(2);

      // Check runes are ready
      expect(player1.zones.base[0].ready).toBe(true);
      expect(player1.zones.base[1].ready).toBe(true);
    });

    it('should fail if not enough runes in deck', () => {
      const action = new ChannelRuneAction(player1, { amount: 20 });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Not enough runes');
    });

    it('should fail if amount is zero or negative', () => {
      const action = new ChannelRuneAction(player1, { amount: 0 });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Cannot channel 0 or negative');
    });

    it('should support first-turn bonus (3 runes)', () => {
      const action = new ChannelRuneAction(player1, { amount: 3 });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);
      expect(player1.zones.base.length).toBe(3);
    });
  });

  // =========================================================================
  // STUN UNIT ACTION
  // =========================================================================

  describe('StunUnitAction', () => {
    let enemyUnit: GameCard;

    beforeEach(() => {
      enemyUnit = createMockCard('enemy-1', 'basic-unit', 'p2');
      (enemyUnit as any).type = 'unit';
      game.battlefields[0].units.push(enemyUnit);
    });

    it('should stun an enemy unit', () => {
      const action = new StunUnitAction(player1, {
        target: enemyUnit,
        duration: 1,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);

      // Check unit is stunned
      const enemyAny = enemyUnit as any;
      expect(enemyAny.stunned).toBe(true);
      expect(enemyAny.statusEffects).toBeDefined();
      expect(enemyAny.statusEffects.length).toBeGreaterThan(0);
      expect(enemyAny.statusEffects[0].type).toBe('stun');
    });

    it('should fail on non-unit targets', () => {
      const spell = createMockCard('spell-1', 'fireball', 'p2');
      (spell as any).type = 'spell';

      const action = new StunUnitAction(player1, {
        target: spell,
        duration: 1,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Can only stun units');
    });

    it('should fail if duration is zero or negative', () => {
      const action = new StunUnitAction(player1, {
        target: enemyUnit,
        duration: 0,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('duration must be positive');
    });
  });

  // =========================================================================
  // BANISH CARD ACTION
  // =========================================================================

  describe('BanishCardAction', () => {
    let cardInHand: GameCard;

    beforeEach(() => {
      cardInHand = createMockCard('card-1', 'test-card', 'p1');
      player1.zones.hand.push(cardInHand);
    });

    it('should banish card from hand', () => {
      const action = new BanishCardAction(player1, {
        card: cardInHand,
        fromZone: 'hand',
        permanent: false,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);

      // Check card removed from hand
      expect(player1.zones.hand.length).toBe(0);

      // Check card in banishment
      expect(player1.zones.banishment).toBeDefined();
      expect(player1.zones.banishment!.length).toBe(1);
      expect(player1.zones.banishment![0].instanceId).toBe(cardInHand.instanceId);
    });

    it('should mark as permanent when specified', () => {
      const action = new BanishCardAction(player1, {
        card: cardInHand,
        fromZone: 'hand',
        permanent: true,
      });

      action.execute(game);

      const banishedCard = player1.zones.banishment![0] as any;
      expect(banishedCard.permanentlyBanished).toBe(true);
    });

    it('should clear temporary effects when banishing from board', () => {
      const boardUnit = createMockCard('unit-1', 'test-unit', 'p1');
      (boardUnit as any).damage = 5;
      (boardUnit as any).temporaryBuffs = [{ might: 2 }];
      player1.zones.base.push(boardUnit);

      const action = new BanishCardAction(player1, {
        card: boardUnit,
        fromZone: 'base',
        permanent: false,
      });

      action.execute(game);

      const banishedUnit = player1.zones.banishment![0] as any;
      expect(banishedUnit.damage).toBe(0);
      expect(banishedUnit.temporaryBuffs).toEqual([]);
    });

    it('should fail if card not in specified zone', () => {
      const action = new BanishCardAction(player1, {
        card: cardInHand,
        fromZone: 'trash', // Card is in hand, not trash
        permanent: false,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('not found in specified zone');
    });
  });

  // =========================================================================
  // REVEAL CARD ACTION
  // =========================================================================

  describe('RevealCardAction', () => {
    let cardInHand: GameCard;

    beforeEach(() => {
      cardInHand = createMockCard('secret-1', 'secret-card', 'p1');
      player1.zones.hand.push(cardInHand);
    });

    it('should reveal card from hand', () => {
      const action = new RevealCardAction(player1, {
        card: cardInHand,
        fromZone: 'hand',
        duration: 'instant',
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);

      const cardAny = cardInHand as any;
      expect(cardAny.revealMetadata).toBeDefined();
      expect(cardAny.revealMetadata.isRevealed).toBe(true);
    });

    it('should support different durations', () => {
      const action = new RevealCardAction(player1, {
        card: cardInHand,
        fromZone: 'hand',
        duration: 'until_played',
      });

      action.execute(game);

      const cardAny = cardInHand as any;
      expect(cardAny.revealMetadata.duration).toBe('until_played');
    });

    it('should fail if card not in private zone', () => {
      const boardCard = createMockCard('board-1', 'test', 'p1');
      player1.zones.base.push(boardCard);

      const action = new RevealCardAction(player1, {
        card: boardCard,
        fromZone: 'base', // Not a private zone
        duration: 'instant',
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Can only reveal from private zones');
    });
  });

  // =========================================================================
  // COUNTER SPELL ACTION
  // =========================================================================

  describe('CounterSpellAction', () => {
    beforeEach(() => {
      // Add a spell to the chain
      game.chain = [
        {
          id: 'spell-1',
          type: 'spell',
          controllerId: 'p2',
          sourceCardId: 'fireball-1',
          targets: [],
          effects: [],
          timestamp: new Date(),
          resolved: false,
        } as any,
      ];
    });

    it('should counter a spell on the chain', () => {
      const action = new CounterSpellAction(player1, {
        targetChainItemId: 'spell-1',
        canCounterAbilities: false,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);

      // Check spell removed from chain
      expect(game.chain.length).toBe(0);
    });

    it('should fail if chain is empty', () => {
      game.chain = [];

      const action = new CounterSpellAction(player1, {
        targetChainItemId: 'spell-1',
        canCounterAbilities: false,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('No active Chain');
    });

    it('should fail if target not on chain', () => {
      const action = new CounterSpellAction(player1, {
        targetChainItemId: 'nonexistent-spell',
        canCounterAbilities: false,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Target not found on Chain');
    });

    it('should fail to counter abilities without flag', () => {
      game.chain[0].type = 'activated_ability';

      const action = new CounterSpellAction(player1, {
        targetChainItemId: 'spell-1',
        canCounterAbilities: false,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Can only counter spells');
    });

    it('should counter abilities when flag is set', () => {
      game.chain[0].type = 'activated_ability';

      const action = new CounterSpellAction(player1, {
        targetChainItemId: 'spell-1',
        canCounterAbilities: true,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);
    });
  });

  // =========================================================================
  // HEAL DAMAGE ACTION
  // =========================================================================

  describe('HealDamageAction', () => {
    let damagedUnit: GameCard;

    beforeEach(() => {
      damagedUnit = createMockCard('wounded-1', 'warrior', 'p1');
      (damagedUnit as any).type = 'unit';
      (damagedUnit as any).damage = 5;
      player1.zones.base.push(damagedUnit);
    });

    it('should remove damage from unit', () => {
      const action = new HealDamageAction(player1, {
        target: damagedUnit,
        amount: 3,
        source: undefined,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true);

      const result = action.execute(game);
      expect(result.success).toBe(true);

      const unitAny = damagedUnit as any;
      expect(unitAny.damage).toBe(2); // 5 - 3 = 2
    });

    it('should not heal below 0 damage', () => {
      const action = new HealDamageAction(player1, {
        target: damagedUnit,
        amount: 10, // More than current damage
        source: undefined,
      });

      action.execute(game);

      const unitAny = damagedUnit as any;
      expect(unitAny.damage).toBe(0); // Can't go negative
    });

    it('should succeed even if unit has no damage', () => {
      const healthyUnit = createMockCard('healthy-1', 'warrior', 'p1');
      (healthyUnit as any).type = 'unit';
      (healthyUnit as any).damage = 0;
      player1.zones.base.push(healthyUnit);

      const action = new HealDamageAction(player1, {
        target: healthyUnit,
        amount: 3,
        source: undefined,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(true); // Valid, just does nothing
    });

    it('should fail on non-unit targets', () => {
      const spell = createMockCard('spell-1', 'fireball', 'p1');
      (spell as any).type = 'spell';

      const action = new HealDamageAction(player1, {
        target: spell,
        amount: 3,
        source: undefined,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('Can only heal units');
    });

    it('should fail if amount is zero or negative', () => {
      const action = new HealDamageAction(player1, {
        target: damagedUnit,
        amount: 0,
        source: undefined,
      });

      const validation = action.validate(game);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toContain('must be positive');
    });
  });
});
