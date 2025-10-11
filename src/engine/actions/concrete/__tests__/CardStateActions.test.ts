/**
 * Tests for Card State Actions
 *
 * Covers:
 * - ExhaustCardAction
 * - ReadyCardAction
 * - DiscardCardAction
 * - RecycleCardAction
 * - KillCardAction
 * - HideCardAction
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ExhaustCardAction } from '../ExhaustCardAction';
import { ReadyCardAction } from '../ReadyCardAction';
import { DiscardCardAction } from '../DiscardCardAction';
import { RecycleCardAction } from '../RecycleCardAction';
import { KillCardAction } from '../KillCardAction';
import { HideCardAction } from '../HideCardAction';
import type { Game, Player, GameCard, Battlefield } from '../../../../types/game';
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
      { id: 'bf-2', units: [], card: {} as any, contested: false, facedownCards: [] },
    ],
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

function createMockCard(id: string, ready: boolean = true): GameCard {
  return {
    instanceId: id,
    cardId: id.toUpperCase(),
    cardType: CardType.UNIT,
    ownerId: 'p1',
    controllerId: 'p1',
    ready,
    damage: 0,
    zone: 'hand',
  } as any;
}

function createMockRune(id: string): GameCard {
  return {
    instanceId: id,
    cardId: id.toUpperCase(),
    cardType: CardType.ARTIFACT,
    ownerId: 'p1',
    controllerId: 'p1',
    ready: true,
    damage: 0,
    zone: 'base',
    domains: ['fury'],
  } as any;
}

// ============================================================================
// EXHAUST CARD ACTION TESTS
// ============================================================================

describe('ExhaustCardAction', () => {
  let game: Game;
  let player: Player;
  let card: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    card = createMockCard('card-1', true); // ready
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should exhaust a ready card on base', () => {
    player.zones.base.push(card);

    const action = new ExhaustCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(card.ready).toBe(false);
  });

  it('should exhaust a ready unit on battlefield', () => {
    game.battlefields[0].units.push(card);

    const action = new ExhaustCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(card.ready).toBe(false);
  });

  it('should fail if card is already exhausted', () => {
    card.ready = false;
    player.zones.base.push(card);

    const action = new ExhaustCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('already exhausted');
  });

  it('should fail if card is not on board', () => {
    player.zones.hand.push(card);

    const action = new ExhaustCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not found on board');
  });
});

// ============================================================================
// READY CARD ACTION TESTS
// ============================================================================

describe('ReadyCardAction', () => {
  let game: Game;
  let player: Player;
  let card: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    card = createMockCard('card-1', false); // exhausted
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should ready an exhausted card on base', () => {
    player.zones.base.push(card);

    const action = new ReadyCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(card.ready).toBe(true);
  });

  it('should ready an exhausted unit on battlefield', () => {
    game.battlefields[0].units.push(card);

    const action = new ReadyCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(card.ready).toBe(true);
  });

  it('should fail if card is already ready', () => {
    card.ready = true;
    player.zones.base.push(card);

    const action = new ReadyCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('already ready');
  });

  it('should fail if card is not on board', () => {
    player.zones.hand.push(card);

    const action = new ReadyCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not found on board');
  });
});

// ============================================================================
// DISCARD CARD ACTION TESTS
// ============================================================================

describe('DiscardCardAction', () => {
  let game: Game;
  let player: Player;
  let card: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    card = createMockCard('card-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should discard a card from hand to trash', () => {
    player.zones.hand.push(card);

    const action = new DiscardCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(player.zones.hand.length).toBe(0);
    expect(player.zones.trash.length).toBe(1);
    expect(player.zones.trash[0]).toBe(card);
  });

  it('should fail if card is not in hand', () => {
    player.zones.base.push(card);

    const action = new DiscardCardAction(player, { card });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not in hand');
  });
});

// ============================================================================
// RECYCLE CARD ACTION TESTS
// ============================================================================

describe('RecycleCardAction', () => {
  let game: Game;
  let player: Player;
  let rune: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    rune = createMockRune('rune-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should recycle a rune from base to rune deck', () => {
    player.zones.base.push(rune);

    const action = new RecycleCardAction(player, {
      card: rune,
      fromZone: 'base',
      toDeck: 'runeDeck',
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(player.zones.base.length).toBe(0);
    expect(player.zones.runeDeck.length).toBe(1);
    expect(player.zones.runeDeck[0]).toBe(rune);
  });

  it('should recycle a card from hand to main deck', () => {
    const card = createMockCard('card-1');
    player.zones.hand.push(card);

    const action = new RecycleCardAction(player, {
      card,
      fromZone: 'hand',
      toDeck: 'mainDeck',
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(player.zones.hand.length).toBe(0);
    expect(player.zones.mainDeck.length).toBe(1);
    expect(player.zones.mainDeck[0]).toBe(card);
  });

  it('should fail if card is not in specified zone', () => {
    player.zones.hand.push(rune);

    const action = new RecycleCardAction(player, {
      card: rune,
      fromZone: 'base', // Wrong zone
      toDeck: 'runeDeck',
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not found in specified zone');
  });
});

// ============================================================================
// KILL CARD ACTION TESTS
// ============================================================================

describe('KillCardAction', () => {
  let game: Game;
  let player: Player;
  let unit: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    unit = createMockCard('unit-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should kill a unit from battlefield to trash', () => {
    game.battlefields[0].units.push(unit);

    const action = new KillCardAction(player, { card: unit });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(game.battlefields[0].units.length).toBe(0);
    expect(player.zones.trash.length).toBe(1);
    expect(player.zones.trash[0]).toBe(unit);
  });

  it('should kill a card from base to trash', () => {
    const rune = createMockRune('rune-1');
    player.zones.base.push(rune);

    const action = new KillCardAction(player, { card: rune });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(player.zones.base.length).toBe(0);
    expect(player.zones.trash.length).toBe(1);
    expect(player.zones.trash[0]).toBe(rune);
  });

  it('should fail if card is not on board', () => {
    player.zones.hand.push(unit);

    const action = new KillCardAction(player, { card: unit });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not found on board');
  });
});

// ============================================================================
// HIDE CARD ACTION TESTS
// ============================================================================

describe('HideCardAction', () => {
  let game: Game;
  let player: Player;
  let card: GameCard;
  let battlefield: Battlefield;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    card = createMockCard('card-1');
    battlefield = game.battlefields[0];
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should hide a card from hand to battlefield facedown zone', () => {
    player.zones.hand.push(card);

    const action = new HideCardAction(player, { card, battlefield });
    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect(player.zones.hand.length).toBe(0);
    expect(battlefield.facedownCards.length).toBe(1);
    expect(battlefield.facedownCards[0]).toBe(card);
  });

  it('should fail if card is not in hand', () => {
    player.zones.base.push(card);

    const action = new HideCardAction(player, { card, battlefield });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not in hand');
  });

  it('should fail if battlefield facedown zone is full', () => {
    const existingCard = createMockCard('existing-1');
    battlefield.facedownCards.push(existingCard);
    player.zones.hand.push(card);

    const action = new HideCardAction(player, { card, battlefield });
    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('already has a card');
  });
});
