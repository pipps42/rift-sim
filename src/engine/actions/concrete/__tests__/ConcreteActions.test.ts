/**
 * Tests for Concrete Actions
 *
 * Covers:
 * - DealDamageAction
 * - DrawCardAction
 * - AddEnergyAction
 * - AddPowerAction
 * - MoveUnitAction
 * - PlayCardAction
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DealDamageAction } from '../DealDamageAction';
import { DrawCardAction } from '../DrawCardAction';
import { AddEnergyAction } from '../AddEnergyAction';
import { AddPowerAction } from '../AddPowerAction';
import { MoveUnitAction } from '../MoveUnitAction';
import { PlayCardAction } from '../PlayCardAction';
import type { Game, Player, GameCard } from '../../../../types/game';

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
    activePlayer: null,
    turnState: 'neutral_open',
  } as any;

  return game;
}

function createMockPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    health: 20,
    hand: [],
    mainDeck: [],
    trash: [],
    base: { units: [] },
    runePool: { energy: 0, power: {} },
  } as any;
}

function createMockUnit(id: string, might: number = 3): GameCard {
  return {
    instanceId: id,
    cardId: 'TEST_UNIT',
    type: 'unit',
    might,
    damage: 0,
    ready: true,
    keywords: [],
  } as any;
}

function createMockCard(id: string, cardId: string = 'TEST_CARD'): GameCard {
  return {
    instanceId: id,
    cardId,
    type: 'spell',
    cost: { energy: 1, power: {} },
    keywords: [],
  } as any;
}

// ============================================================================
// TESTS
// ============================================================================

describe('DealDamageAction', () => {
  let game: Game;
  let player: Player;
  let target: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    target = createMockUnit('unit-1', 5);

    game.players = [player];
    game.battlefields[0].units = [target];
  });

  it('should deal damage to a unit', async () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect((target as any).damage).toBe(3);
  });

  it('should fail validation for negative damage', () => {
    const action = new DealDamageAction(player, {
      target,
      amount: -5,
      damageType: 'spell',
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('negative');
  });

  it('should track damage history on unit', () => {
    const action = new DealDamageAction(player, {
      target,
      amount: 2,
      damageType: 'effect',
    });

    action.execute(game);

    expect((target as any).damageHistory).toBeDefined();
    expect((target as any).damageHistory).toHaveLength(1);
    expect((target as any).damageHistory[0].amount).toBe(2);
  });
});

describe('DrawCardAction', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');

    // Add cards to deck
    (player as any).mainDeck = [
      createMockCard('card-1'),
      createMockCard('card-2'),
      createMockCard('card-3'),
    ];

    game.players = [player];
  });

  it('should draw cards from deck to hand', () => {
    const action = new DrawCardAction(player, { amount: 2 });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect((player as any).hand).toHaveLength(2);
    expect((player as any).mainDeck).toHaveLength(1);
  });

  it('should handle burn out when deck is empty', () => {
    // Empty deck, populate trash
    (player as any).mainDeck = [];
    (player as any).trash = [
      createMockCard('card-trash-1'),
      createMockCard('card-trash-2'),
    ];

    const action = new DrawCardAction(player, { amount: 1 });

    const result = action.execute(game);
    expect(result.success).toBe(true);

    // Trash should be shuffled into deck
    expect((player as any).mainDeck.length).toBeGreaterThan(0);
    expect((player as any).hand).toHaveLength(1);
  });

  it('should fail validation for non-positive amount', () => {
    const action = new DrawCardAction(player, { amount: 0 });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
  });
});

describe('AddEnergyAction', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    game.players = [player];
  });

  it('should add energy to rune pool', () => {
    const action = new AddEnergyAction(player, {
      player,
      amount: 3,
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect((player as any).runePool.energy).toBe(3);
  });

  it('should accumulate energy', () => {
    const action1 = new AddEnergyAction(player, { player, amount: 2 });
    const action2 = new AddEnergyAction(player, { player, amount: 3 });

    action1.execute(game);
    action2.execute(game);

    expect((player as any).runePool.energy).toBe(5);
  });

  it('should fail validation for non-positive amount', () => {
    const action = new AddEnergyAction(player, { player, amount: 0 });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
  });
});

describe('AddPowerAction', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    game.players = [player];
  });

  it('should add power of specific domain', () => {
    const action = new AddPowerAction(player, {
      player,
      amount: 2,
      resourceType: 'fire',
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
    expect((player as any).runePool.power.fire).toBe(2);
  });

  it('should track multiple domains separately', () => {
    const action1 = new AddPowerAction(player, {
      player,
      amount: 2,
      resourceType: 'fire',
    });
    const action2 = new AddPowerAction(player, {
      player,
      amount: 3,
      resourceType: 'water',
    });

    action1.execute(game);
    action2.execute(game);

    expect((player as any).runePool.power.fire).toBe(2);
    expect((player as any).runePool.power.water).toBe(3);
  });

  it('should fail validation without domain specified', () => {
    const action = new AddPowerAction(player, {
      player,
      amount: 1,
    } as any);

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
  });
});

describe('MoveUnitAction', () => {
  let game: Game;
  let player: Player;
  let unit: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    unit = createMockUnit('unit-1');

    // Unit starts at base
    (player as any).base.units = [unit];
    (player as any).units = [unit];

    game.players = [player];
  });

  it('should move unit from base to battlefield', () => {
    const action = new MoveUnitAction(player, {
      unit,
      destination: { type: 'battlefield', battlefieldId: 'bf-1' },
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);

    // Unit should be removed from base
    expect((player as any).base.units).toHaveLength(0);

    // Unit should be on battlefield
    const battlefield = (game as any).battlefields.find((bf: any) => bf.id === 'bf-1');
    expect(battlefield.units).toHaveLength(1);
    expect(battlefield.units[0].instanceId).toBe('unit-1');
  });

  it('should move unit from battlefield to base', () => {
    // Put unit on battlefield first
    const battlefield = (game as any).battlefields[0];
    battlefield.units.push(unit);
    (player as any).base.units = [];

    const action = new MoveUnitAction(player, {
      unit,
      destination: { type: 'base' },
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);

    expect((player as any).base.units).toHaveLength(1);
    expect(battlefield.units).toHaveLength(0);
  });

  it('should allow battlefield-to-battlefield move with Ganking', () => {
    // Add Ganking keyword
    (unit as any).keywords = ['Ganking'];

    // Put unit on battlefield 1
    const bf1 = (game as any).battlefields[0];
    bf1.units.push(unit);
    (player as any).base.units = [];

    const action = new MoveUnitAction(player, {
      unit,
      destination: { type: 'battlefield', battlefieldId: 'bf-2' },
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);
  });

  it('should fail battlefield-to-battlefield move without Ganking', () => {
    // Put unit on battlefield 1
    const bf1 = (game as any).battlefields[0];
    bf1.units.push(unit);
    (player as any).base.units = [];

    const action = new MoveUnitAction(player, {
      unit,
      destination: { type: 'battlefield', battlefieldId: 'bf-2' },
    });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Ganking');
  });

  it('should exhaust unit after standard move', () => {
    const action = new MoveUnitAction(player, {
      unit,
      destination: { type: 'battlefield', battlefieldId: 'bf-1' },
    });

    action.execute(game);

    expect((unit as any).ready).toBe(false);
  });
});

describe('PlayCardAction', () => {
  let game: Game;
  let player: Player;
  let card: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    card = createMockCard('card-1', 'TEST_SPELL');

    // Put card in hand
    (player as any).hand = [card];

    // Give player resources
    (player as any).runePool = { energy: 5, power: {} };

    // Set as active player
    (game as any).activePlayer = player;

    game.players = [player];
  });

  it('should play card from hand', () => {
    const action = new PlayCardAction(player, { card });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);

    const result = action.execute(game);
    expect(result.success).toBe(true);

    // Card removed from hand
    expect((player as any).hand).toHaveLength(0);

    // Cost paid
    expect((player as any).runePool.energy).toBe(4); // 5 - 1
  });

  it('should fail if card not in hand', () => {
    const notInHand = createMockCard('card-2');

    const action = new PlayCardAction(player, { card: notInHand });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('not in hand');
  });

  it('should fail if insufficient energy', () => {
    (player as any).runePool.energy = 0;

    const action = new PlayCardAction(player, { card });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Insufficient Energy');
  });

  it('should fail if wrong timing', () => {
    // Change turn state to Closed
    (game as any).turnState = 'neutral_closed';

    const action = new PlayCardAction(player, { card });

    const validation = action.validate(game);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Action Phase');
  });

  it('should allow Reaction cards in closed state', () => {
    (card as any).keywords = ['Reaction'];
    (game as any).turnState = 'neutral_closed';

    const action = new PlayCardAction(player, { card });

    const validation = action.validate(game);
    expect(validation.valid).toBe(true);
  });

  it('should put unit permanents at base', () => {
    const unitCard = createMockUnit('unit-card');
    (unitCard as any).cost = { energy: 2, power: {} };
    (player as any).hand = [unitCard];

    const action = new PlayCardAction(player, { card: unitCard });

    action.execute(game);

    expect((player as any).base.units).toHaveLength(1);
    expect((player as any).base.units[0].instanceId).toBe('unit-card');
  });
});
