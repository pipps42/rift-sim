/**
 * Tests for Additional Action Modifiers (Phase C)
 *
 * Covers:
 * - KeywordModifier
 * - MightModifier
 * - PreventionModifier
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { KeywordModifier } from '../KeywordModifier';
import { MightModifier } from '../MightModifier';
import { PreventionModifier } from '../PreventionModifier';
import { DealDamageAction } from '../../concrete/DealDamageAction';
import { PlayCardAction } from '../../concrete/PlayCardAction';
import { DrawCardAction } from '../../concrete/DrawCardAction';
import type { Game, Player, GameCard, Keyword } from '../../../../types/game';
import { CardType } from '../../../../types/game';

// ============================================================================
// MOCK SETUP
// ============================================================================

function createMockGame(): Game {
  const game = {
    id: 'test-game',
    history: [],
    players: [],
    battlefields: [
      { id: 'bf-1', units: [], card: {} as any, contested: false, facedownCards: [] },
    ],
    phase: 'ACTION' as any,
    turnPhase: 'ACTION',
  } as any;

  return game;
}

function createMockPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    ownerId: id,
    zones: {
      hand: [],
      mainDeck: [],
      runeDeck: [],
      trash: [],
      base: [],
      banishment: [],
      championZone: [],
      runes: [],
    },
    runePool: {
      energy: 0,
      power: [],
    },
  } as any;
}

function createMockCard(id: string, ownerId: string = 'p1'): GameCard {
  return {
    instanceId: id,
    cardId: id.toUpperCase(),
    cardType: CardType.UNIT,
    ownerId,
    controllerId: ownerId,
    ready: true,
    damage: 0,
    zone: 'hand',
    might: 3,
  } as any;
}

// ============================================================================
// KEYWORD MODIFIER TESTS
// ============================================================================

describe('KeywordModifier', () => {
  let game: Game;
  let player: Player;
  let sourceCard: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    sourceCard = createMockCard('source-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should create modifier with grant operation', () => {
    const modifier = new KeywordModifier({
      sourceCard,
      operation: 'grant',
      keyword: 'ASSAULT' as Keyword,
      keywordValue: 2,
    });

    expect(modifier.getKeyword()).toBe('ASSAULT');
    expect(modifier.getOperation()).toBe('grant');
    expect(modifier.getKeywordValue()).toBe(2);
  });

  it('should create modifier with remove operation', () => {
    const modifier = new KeywordModifier({
      sourceCard,
      operation: 'remove',
      keyword: 'SHIELD' as Keyword,
    });

    expect(modifier.getKeyword()).toBe('SHIELD');
    expect(modifier.getOperation()).toBe('remove');
    expect(modifier.getKeywordValue()).toBeUndefined();
  });

  it('should respect filter function', async () => {
    const targetCard = createMockCard('target-1', 'p1');
    const action = new PlayCardAction(player, { card: targetCard });

    const modifier = new KeywordModifier({
      sourceCard,
      operation: 'grant',
      keyword: 'GANKING' as Keyword,
      filter: (action, game) => {
        if (!(action instanceof PlayCardAction)) return false;
        return action.data.card.controllerId === 'p1';
      },
    });

    const shouldApply = await modifier.shouldApply(action, game);
    expect(shouldApply).toBe(true);
  });

  it('should not apply when filter returns false', async () => {
    const targetCard = createMockCard('target-1', 'p2');
    const action = new PlayCardAction(player, { card: targetCard });

    const modifier = new KeywordModifier({
      sourceCard,
      operation: 'grant',
      keyword: 'GANKING' as Keyword,
      filter: (action, game) => {
        if (!(action instanceof PlayCardAction)) return false;
        return action.data.card.controllerId === 'p1'; // Only p1 units
      },
    });

    const shouldApply = await modifier.shouldApply(action, game);
    expect(shouldApply).toBe(false);
  });

  it('should respect maxUses', async () => {
    const action = new PlayCardAction(player, { card: createMockCard('card-1') });

    const modifier = new KeywordModifier({
      sourceCard,
      operation: 'grant',
      keyword: 'ASSAULT' as Keyword,
      maxUses: 1,
    });

    // First application
    expect(await modifier.shouldApply(action, game)).toBe(true);
    await modifier.apply(action, game);

    // Second application should fail
    expect(await modifier.shouldApply(action, game)).toBe(false);
  });

  it('should generate correct description', () => {
    const modifier = new KeywordModifier({
      operation: 'grant',
      keyword: 'ASSAULT' as Keyword,
      keywordValue: 3,
      maxUses: 2,
    });

    const desc = modifier.getDescription();
    expect(desc).toContain('Grant');
    expect(desc).toContain('ASSAULT');
    expect(desc).toContain('3');
  });
});

// ============================================================================
// MIGHT MODIFIER TESTS
// ============================================================================

describe('MightModifier', () => {
  let game: Game;
  let player: Player;
  let sourceCard: GameCard;
  let target: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    sourceCard = createMockCard('source-1');
    target = createMockCard('target-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should increase damage amount', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modifier = new MightModifier({
      sourceCard,
      mightModification: 2, // +2 Might
    });

    const modifiedAction = await modifier.apply(action, game) as DealDamageAction;
    expect(modifiedAction.data.amount).toBe(5); // 3 + 2
  });

  it('should decrease damage amount', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 5,
      damageType: 'combat',
    });

    const modifier = new MightModifier({
      sourceCard,
      mightModification: -2, // -2 Might
    });

    const modifiedAction = await modifier.apply(action, game) as DealDamageAction;
    expect(modifiedAction.data.amount).toBe(3); // 5 - 2
  });

  it('should not allow negative damage', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 1,
      damageType: 'combat',
    });

    const modifier = new MightModifier({
      sourceCard,
      mightModification: -5, // Would be -4
    });

    const modifiedAction = await modifier.apply(action, game) as DealDamageAction;
    expect(modifiedAction.data.amount).toBe(0); // Clamped to 0
  });

  it('should multiply damage amount', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modifier = new MightModifier({
      sourceCard,
      mightModification: { multiply: 2 }, // ×2
    });

    const modifiedAction = await modifier.apply(action, game) as DealDamageAction;
    expect(modifiedAction.data.amount).toBe(6); // 3 × 2
  });

  it('should apply function-based modification', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 4,
      damageType: 'combat',
    });

    const modifier = new MightModifier({
      sourceCard,
      mightModification: (current, game) => current + game.players.length, // +2 (2 players)
    });

    const modifiedAction = await modifier.apply(action, game) as DealDamageAction;
    expect(modifiedAction.data.amount).toBe(6); // 4 + 2
  });

  it('should only apply to DealDamageAction', async () => {
    const drawAction = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modifier = new MightModifier({
      sourceCard,
      mightModification: 5,
    });

    const shouldApply = await modifier.shouldApply(drawAction, game);
    expect(shouldApply).toBe(false);
  });

  it('should respect filter for attacker', async () => {
    const attackerCard = createMockCard('attacker-1', 'p1');
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    }, attackerCard);

    const modifier = new MightModifier({
      sourceCard,
      mightModification: 2,
      filter: (action, game) => {
        return action.source?.controllerId === 'p1';
      },
    });

    const shouldApply = await modifier.shouldApply(action, game);
    expect(shouldApply).toBe(true);
  });

  it('should generate correct description for addition', () => {
    const modifier = new MightModifier({
      mightModification: 3,
    });

    const desc = modifier.getDescription();
    expect(desc).toContain('+3');
  });

  it('should generate correct description for multiplication', () => {
    const modifier = new MightModifier({
      mightModification: { multiply: 2 },
    });

    const desc = modifier.getDescription();
    expect(desc).toContain('×2');
  });
});

// ============================================================================
// PREVENTION MODIFIER TESTS
// ============================================================================

describe('PreventionModifier', () => {
  let game: Game;
  let player: Player;
  let sourceCard: GameCard;
  let target: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    sourceCard = createMockCard('source-1');
    target = createMockCard('target-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should prevent damage action', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 5,
      damageType: 'combat',
    });

    const modifier = new PreventionModifier({
      sourceCard,
    });

    const result = await modifier.apply(action, game);
    expect(result).toBeNull(); // Action prevented
  });

  it('should apply to specific action types', async () => {
    const damageAction = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const drawAction = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    const modifier = new PreventionModifier({
      sourceCard,
      targetActionTypes: ['deal_damage' as any],
    });

    expect(await modifier.shouldApply(damageAction, game)).toBe(true);
    expect(await modifier.shouldApply(drawAction, game)).toBe(false);
  });

  it('should respect filter function', async () => {
    const p1Target = createMockCard('p1-target', 'p1');
    const p2Target = createMockCard('p2-target', 'p2');

    const action1 = new DealDamageAction(player, {
      target: p1Target,
      amount: 3,
      damageType: 'combat',
    });

    const action2 = new DealDamageAction(player, {
      target: p2Target,
      amount: 3,
      damageType: 'combat',
    });

    const modifier = new PreventionModifier({
      sourceCard,
      filter: (action, game) => {
        if (!(action instanceof DealDamageAction)) return false;
        return action.data.target.controllerId === 'p1'; // Only prevent damage to p1
      },
    });

    expect(await modifier.shouldApply(action1, game)).toBe(true);
    expect(await modifier.shouldApply(action2, game)).toBe(false);
  });

  it('should respect maxPrevents', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modifier = new PreventionModifier({
      sourceCard,
      maxPrevents: 1,
    });

    // First prevention
    expect(await modifier.shouldApply(action, game)).toBe(true);
    await modifier.apply(action, game);

    // Second prevention should fail
    expect(await modifier.shouldApply(action, game)).toBe(false);
  });

  it('should respect oneShot', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modifier = new PreventionModifier({
      sourceCard,
      oneShot: true,
    });

    // First prevention
    expect(modifier.isActive(game)).toBe(true);
    await modifier.apply(action, game);

    // Should become inactive after one use
    expect(await modifier.shouldApply(action, game)).toBe(false);
  });

  it('should have custom prevention message', () => {
    const modifier = new PreventionModifier({
      preventionMessage: 'Protected by shield!',
    });

    expect(modifier.getPreventionMessage()).toBe('Protected by shield!');
  });

  it('should expire based on condition', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    });

    const modifier = new PreventionModifier({
      sourceCard,
      expiresWhen: (game) => game.turnPhase === 'END_OF_TURN',
    });

    // Should be active during ACTION phase
    expect(modifier.isActive(game)).toBe(true);

    // Change phase to END_OF_TURN
    game.turnPhase = 'END_OF_TURN';

    // Should be inactive now
    expect(modifier.isActive(game)).toBe(false);
  });

  it('should generate correct description', () => {
    const modifier = new PreventionModifier({
      targetActionTypes: ['deal_damage' as any, 'play_card' as any],
      maxPrevents: 3,
    });

    const desc = modifier.getDescription();
    expect(desc).toContain('Prevent actions');
  });
});
