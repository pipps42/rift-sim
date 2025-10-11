/**
 * Tests for Concrete Action Modifiers
 *
 * Tests:
 * - DamageModifier (increase, reduce, multiply, filter)
 * - CostModifier (energy cost, power cost, filter)
 * - DrawModifier (increase, reduce, prevent, filter)
 * - Modifier expiration and max uses
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DamageModifier } from '../DamageModifier';
import { CostModifier } from '../CostModifier';
import { DrawModifier } from '../DrawModifier';
import { DealDamageAction } from '../../concrete/DealDamageAction';
import { PlayCardAction } from '../../concrete/PlayCardAction';
import { DrawCardAction } from '../../concrete/DrawCardAction';
import type { Game, Player, GameCard } from '../../../../types/game';
import { GamePhase, CardType } from '../../../../types/game';

// ============================================================================
// MOCK HELPERS
// ============================================================================

function createMockGame(): Game {
  return {
    id: 'test-game',
    players: [] as any,
    phase: GamePhase.ACTION,
    currentPlayerIndex: 0,
    battlefields: [
      { id: 'bf-1', units: [], card: {} as any, contested: false, facedownCards: [] },
    ],
    history: [],
  } as any;
}

function createMockPlayer(id: string): Player {
  return {
    id,
    name: `Player ${id}`,
  } as any;
}

function createMockCard(id: string, cardType: CardType = CardType.UNIT): GameCard {
  return {
    instanceId: id,
    cardId: id.toUpperCase(),
    cardType,
  } as any;
}

// ============================================================================
// DAMAGE MODIFIER TESTS
// ============================================================================

describe('DamageModifier', () => {
  let game: Game;
  let player: Player;
  let target: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1');
    target = createMockCard('unit-1');
    game.players = [player, createMockPlayer('p2')] as any;
    game.battlefields[0].units = [target];
  });

  it('should increase damage by a fixed amount', async () => {
    const modifier = new DamageModifier({
      damageModification: 2,
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DealDamageAction).data.amount).toBe(5); // 3 + 2
  });

  it('should reduce damage by a fixed amount', async () => {
    const modifier = new DamageModifier({
      damageModification: -1,
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DealDamageAction).data.amount).toBe(2); // 3 - 1
  });

  it('should not reduce damage below 0', async () => {
    const modifier = new DamageModifier({
      damageModification: -10,
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DealDamageAction).data.amount).toBe(0); // max(0, 3 - 10)
  });

  it('should multiply damage', async () => {
    const modifier = new DamageModifier({
      damageModification: 0,
      damageMultiplier: 2.0,
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DealDamageAction).data.amount).toBe(6); // 3 * 2
  });

  it('should apply both modification and multiplier', async () => {
    const modifier = new DamageModifier({
      damageModification: 1,
      damageMultiplier: 2.0,
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DealDamageAction).data.amount).toBe(8); // (3 + 1) * 2
  });

  it('should only apply to actions matching filter', async () => {
    const modifier = new DamageModifier({
      damageModification: 2,
      filter: (action) => action.data.damageType === 'spell',
    });

    const spellAction = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const combatAction = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modifiedSpell = await modifier.modify(spellAction, game);
    expect((modifiedSpell as DealDamageAction).data.amount).toBe(5);

    const modifiedCombat = await modifier.modify(combatAction, game);
    expect((modifiedCombat as DealDamageAction).data.amount).toBe(3); // unchanged
  });

  it('should respect max uses', async () => {
    const modifier = new DamageModifier({
      damageModification: 2,
      maxUses: 2,
    });

    const action1 = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });
    const action2 = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });
    const action3 = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const modified1 = await modifier.modify(action1, game);
    expect((modified1 as DealDamageAction).data.amount).toBe(5);

    const modified2 = await modifier.modify(action2, game);
    expect((modified2 as DealDamageAction).data.amount).toBe(5);

    const modified3 = await modifier.modify(action3, game);
    expect((modified3 as DealDamageAction).data.amount).toBe(3); // max uses reached
  });

  it('should become inactive after expiration', async () => {
    const modifier = new DamageModifier({
      damageModification: 2,
      expiresWhen: (game) => game.phase === GamePhase.ENDING,
    });

    expect(modifier.isActive(game)).toBe(true);

    game.phase = GamePhase.ENDING;
    expect(modifier.isActive(game)).toBe(false);
  });
});

// ============================================================================
// COST MODIFIER TESTS
// ============================================================================

describe('CostModifier', () => {
  let game: Game;
  let player: Player;
  let card: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1');
    card = createMockCard('spell-1', CardType.SPELL);
    game.players = [player, createMockPlayer('p2')] as any;
  });

  it('should reduce energy cost', async () => {
    const modifier = new CostModifier({
      energyCostModification: -1,
    });

    const action = new PlayCardAction(player, {
      card,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as PlayCardAction).data.energyCost).toBe(2); // 3 - 1
  });

  it('should increase energy cost', async () => {
    const modifier = new CostModifier({
      energyCostModification: 2,
    });

    const action = new PlayCardAction(player, {
      card,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as PlayCardAction).data.energyCost).toBe(5); // 3 + 2
  });

  it('should not reduce cost below 0', async () => {
    const modifier = new CostModifier({
      energyCostModification: -10,
    });

    const action = new PlayCardAction(player, {
      card,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as PlayCardAction).data.energyCost).toBe(0); // max(0, 3 - 10)
  });

  it('should modify power cost', async () => {
    const modifier = new CostModifier({
      powerCostModification: -1,
    });

    const action = new PlayCardAction(player, {
      card,
      powerCost: 2,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as PlayCardAction).data.powerCost).toBe(1); // 2 - 1
  });

  it('should modify both energy and power costs', async () => {
    const modifier = new CostModifier({
      energyCostModification: -1,
      powerCostModification: -1,
    });

    const action = new PlayCardAction(player, {
      card,
      energyCost: 3,
      powerCost: 2,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as PlayCardAction).data.energyCost).toBe(2);
    expect((modified as PlayCardAction).data.powerCost).toBe(1);
  });

  it('should only apply to cards matching filter', async () => {
    const modifier = new CostModifier({
      energyCostModification: -1,
      filter: (action) => {
        return action.data.card.cardType === CardType.SPELL;
      },
    });

    const spellCard = createMockCard('spell-1', CardType.SPELL);
    const unitCard = createMockCard('unit-1', CardType.UNIT);

    const spellAction = new PlayCardAction(player, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const unitAction = new PlayCardAction(player, {
      card: unitCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'battlefield',
    });

    const modifiedSpell = await modifier.modify(spellAction, game);
    expect((modifiedSpell as PlayCardAction).data.energyCost).toBe(2);

    const modifiedUnit = await modifier.modify(unitAction, game);
    expect((modifiedUnit as PlayCardAction).data.energyCost).toBe(3); // unchanged
  });

  it('should respect max uses', async () => {
    const modifier = new CostModifier({
      energyCostModification: -1,
      maxUses: 1,
    });

    const action1 = new PlayCardAction(player, {
      card,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const action2 = new PlayCardAction(player, {
      card,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const modified1 = await modifier.modify(action1, game);
    expect((modified1 as PlayCardAction).data.energyCost).toBe(2);

    const modified2 = await modifier.modify(action2, game);
    expect((modified2 as PlayCardAction).data.energyCost).toBe(3); // max uses reached
  });
});

// ============================================================================
// DRAW MODIFIER TESTS
// ============================================================================

describe('DrawModifier', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1');
    game.players = [player, createMockPlayer('p2')] as any;
  });

  it('should increase draw count', async () => {
    const modifier = new DrawModifier({
      countModification: 1,
    });

    const action = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DrawCardAction).data.count).toBe(2); // 1 + 1
  });

  it('should reduce draw count', async () => {
    const modifier = new DrawModifier({
      countModification: -1,
    });

    const action = new DrawCardAction(player, {
      count: 3,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DrawCardAction).data.count).toBe(2); // 3 - 1
  });

  it('should not reduce count below 1', async () => {
    const modifier = new DrawModifier({
      countModification: -10,
    });

    const action = new DrawCardAction(player, {
      count: 2,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DrawCardAction).data.count).toBe(1); // max(1, 2 - 10)
  });

  it('should multiply draw count', async () => {
    const modifier = new DrawModifier({
      countMultiplier: 2.0,
    });

    const action = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DrawCardAction).data.count).toBe(2); // 1 * 2
  });

  it('should prevent draw when multiplier is 0', async () => {
    const modifier = new DrawModifier({
      countMultiplier: 0,
    });

    const action = new DrawCardAction(player, {
      count: 2,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).toBeNull(); // Action prevented
  });

  it('should apply both modification and multiplier', async () => {
    const modifier = new DrawModifier({
      countModification: 1,
      countMultiplier: 2.0,
    });

    const action = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified = await modifier.modify(action, game);
    expect(modified).not.toBeNull();
    expect((modified as DrawCardAction).data.count).toBe(4); // (1 + 1) * 2
  });

  it('should only apply to actions matching filter', async () => {
    const modifier = new DrawModifier({
      countModification: 1,
      filter: (action, game) => {
        // Only on current player's turn
        return game.players[game.currentPlayerIndex].id === action.controller.id;
      },
    });

    const currentPlayerAction = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const otherPlayer = createMockPlayer('p2');
    const otherPlayerAction = new DrawCardAction(otherPlayer, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modifiedCurrent = await modifier.modify(currentPlayerAction, game);
    expect((modifiedCurrent as DrawCardAction).data.count).toBe(2);

    const modifiedOther = await modifier.modify(otherPlayerAction, game);
    expect((modifiedOther as DrawCardAction).data.count).toBe(1); // unchanged
  });

  it('should respect max uses', async () => {
    const modifier = new DrawModifier({
      countModification: 1,
      maxUses: 2,
    });

    const action1 = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });
    const action2 = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });
    const action3 = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modified1 = await modifier.modify(action1, game);
    expect((modified1 as DrawCardAction).data.count).toBe(2);

    const modified2 = await modifier.modify(action2, game);
    expect((modified2 as DrawCardAction).data.count).toBe(2);

    const modified3 = await modifier.modify(action3, game);
    expect((modified3 as DrawCardAction).data.count).toBe(1); // max uses reached
  });

  it('should become inactive after expiration', async () => {
    const modifier = new DrawModifier({
      countModification: 1,
      expiresWhen: (game) => game.phase === GamePhase.ENDING,
    });

    expect(modifier.isActive(game)).toBe(true);

    game.phase = GamePhase.ENDING;
    expect(modifier.isActive(game)).toBe(false);
  });
});
