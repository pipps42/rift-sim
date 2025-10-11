/**
 * Tests for Concrete Action Triggers
 *
 * Tests:
 * - OnDamageDealtTrigger (filter, max triggers, expiration)
 * - OnCardPlayedTrigger (filter, max triggers, expiration)
 * - OnUnitDeathTrigger (filter, max triggers, expiration)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { OnDamageDealtTrigger } from '../OnDamageDealtTrigger';
import { OnCardPlayedTrigger } from '../OnCardPlayedTrigger';
import { OnUnitDeathTrigger } from '../OnUnitDeathTrigger';
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
    controllerId: 'p1',
  } as any;
}

// ============================================================================
// ON DAMAGE DEALT TRIGGER TESTS
// ============================================================================

describe('OnDamageDealtTrigger', () => {
  let game: Game;
  let player: Player;
  let target: GameCard;
  let sourceCard: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1');
    target = createMockCard('unit-1');
    sourceCard = createMockCard('source-card');
    game.players = [player, createMockPlayer('p2')] as any;
    game.battlefields[0].units = [target, sourceCard];
  });

  it('should trigger when damage is dealt', async () => {
    let triggered = false;

    const trigger = new OnDamageDealtTrigger({
      onTrigger: async (action, game) => {
        triggered = true;
        return [];
      },
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const shouldTrigger = await trigger.shouldTrigger(action, game);
    expect(shouldTrigger).toBe(true);

    await trigger.trigger(action, game);
    expect(triggered).toBe(true);
  });

  it('should generate actions when triggered', async () => {
    const trigger = new OnDamageDealtTrigger({
      onTrigger: async (action, game) => {
        return [
          new DrawCardAction(player, {
            count: 1,
            fromZone: 'mainDeck',
            toZone: 'hand',
          }),
        ];
      },
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    const generatedActions = await trigger.trigger(action, game);
    expect(generatedActions).toHaveLength(1);
    expect(generatedActions[0]).toBeInstanceOf(DrawCardAction);
  });

  it('should respect filter condition', async () => {
    const trigger = new OnDamageDealtTrigger({
      filter: (action) => action.data.damageType === 'spell',
      onTrigger: async () => [],
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

    expect(await trigger.shouldTrigger(spellAction, game)).toBe(true);
    expect(await trigger.shouldTrigger(combatAction, game)).toBe(false);
  });

  it('should only trigger from specific source card', async () => {
    const trigger = new OnDamageDealtTrigger({
      filter: (action) => action.source?.instanceId === sourceCard.instanceId,
      onTrigger: async () => [],
    });

    const actionFromSource = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    }, sourceCard);

    const actionFromOther = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'combat',
    }, createMockCard('other-card'));

    expect(await trigger.shouldTrigger(actionFromSource, game)).toBe(true);
    expect(await trigger.shouldTrigger(actionFromOther, game)).toBe(false);
  });

  it('should respect max triggers', async () => {
    const trigger = new OnDamageDealtTrigger({
      maxTriggers: 2,
      onTrigger: async () => [],
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    expect(await trigger.shouldTrigger(action, game)).toBe(true);
    await trigger.trigger(action, game);

    expect(await trigger.shouldTrigger(action, game)).toBe(true);
    await trigger.trigger(action, game);

    expect(await trigger.shouldTrigger(action, game)).toBe(false); // Max reached
  });

  it('should support one-shot triggers', async () => {
    const trigger = new OnDamageDealtTrigger({
      oneShot: true,
      onTrigger: async () => [],
    });

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    expect(await trigger.shouldTrigger(action, game)).toBe(true);
    await trigger.trigger(action, game);

    expect(await trigger.shouldTrigger(action, game)).toBe(false); // Already fired
  });

  it('should become inactive after expiration', async () => {
    const trigger = new OnDamageDealtTrigger({
      expiresWhen: (game) => game.phase === GamePhase.ENDING,
      onTrigger: async () => [],
    });

    expect(trigger.isActive(game)).toBe(true);

    game.phase = GamePhase.ENDING;
    expect(trigger.isActive(game)).toBe(false);
  });

  it('should not trigger on non-damage actions', async () => {
    const trigger = new OnDamageDealtTrigger({
      onTrigger: async () => [],
    });

    const drawAction = new DrawCardAction(player, {
      count: 1,
      fromZone: 'mainDeck',
      toZone: 'hand',
    });

    expect(await trigger.shouldTrigger(drawAction, game)).toBe(false);
  });
});

// ============================================================================
// ON CARD PLAYED TRIGGER TESTS
// ============================================================================

describe('OnCardPlayedTrigger', () => {
  let game: Game;
  let player: Player;
  let spellCard: GameCard;
  let unitCard: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1');
    spellCard = createMockCard('spell-1', CardType.SPELL);
    unitCard = createMockCard('unit-1', CardType.UNIT);
    game.players = [player, createMockPlayer('p2')] as any;
  });

  it('should trigger when a card is played', async () => {
    let triggered = false;

    const trigger = new OnCardPlayedTrigger({
      onTrigger: async (action, game) => {
        triggered = true;
        return [];
      },
    });

    const action = new PlayCardAction(player, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const shouldTrigger = await trigger.shouldTrigger(action, game);
    expect(shouldTrigger).toBe(true);

    await trigger.trigger(action, game);
    expect(triggered).toBe(true);
  });

  it('should generate actions when triggered', async () => {
    const target = createMockCard('target-unit');
    game.battlefields[0].units = [target];

    const trigger = new OnCardPlayedTrigger({
      onTrigger: async (action, game) => {
        return [
          new DealDamageAction(player, {
            target,
            amount: 1,
            damageType: 'effect',
          }),
        ];
      },
    });

    const action = new PlayCardAction(player, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const generatedActions = await trigger.trigger(action, game);
    expect(generatedActions).toHaveLength(1);
    expect(generatedActions[0]).toBeInstanceOf(DealDamageAction);
  });

  it('should filter by card type', async () => {
    const trigger = new OnCardPlayedTrigger({
      filter: (action) => action.data.card.cardType === CardType.SPELL,
      onTrigger: async () => [],
    });

    const spellAction = new PlayCardAction(player, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const unitAction = new PlayCardAction(player, {
      card: unitCard,
      energyCost: 2,
      fromZone: 'hand',
      toZone: 'battlefield',
    });

    expect(await trigger.shouldTrigger(spellAction, game)).toBe(true);
    expect(await trigger.shouldTrigger(unitAction, game)).toBe(false);
  });

  it('should filter by controller', async () => {
    const opponent = createMockPlayer('p2');

    const trigger = new OnCardPlayedTrigger({
      filter: (action) => action.controller.id === player.id,
      onTrigger: async () => [],
    });

    const playerAction = new PlayCardAction(player, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    const opponentAction = new PlayCardAction(opponent, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    expect(await trigger.shouldTrigger(playerAction, game)).toBe(true);
    expect(await trigger.shouldTrigger(opponentAction, game)).toBe(false);
  });

  it('should respect max triggers', async () => {
    const trigger = new OnCardPlayedTrigger({
      maxTriggers: 1,
      onTrigger: async () => [],
    });

    const action = new PlayCardAction(player, {
      card: spellCard,
      energyCost: 3,
      fromZone: 'hand',
      toZone: 'trash',
    });

    expect(await trigger.shouldTrigger(action, game)).toBe(true);
    await trigger.trigger(action, game);

    expect(await trigger.shouldTrigger(action, game)).toBe(false);
  });

  it('should not trigger on non-play actions', async () => {
    const trigger = new OnCardPlayedTrigger({
      onTrigger: async () => [],
    });

    const target = createMockCard('target');
    game.battlefields[0].units = [target];

    const damageAction = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    expect(await trigger.shouldTrigger(damageAction, game)).toBe(false);
  });
});

// ============================================================================
// ON UNIT DEATH TRIGGER TESTS
// ============================================================================

describe('OnUnitDeathTrigger', () => {
  let game: Game;
  let player: Player;
  let deadUnit: GameCard;
  let otherUnit: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1');
    deadUnit = createMockCard('dead-unit');
    otherUnit = createMockCard('other-unit');
    game.players = [player, createMockPlayer('p2')] as any;
    game.battlefields[0].units = [deadUnit, otherUnit];
  });

  it('should trigger when a unit dies', async () => {
    let triggered = false;

    const trigger = new OnUnitDeathTrigger({
      onTrigger: async (unit, game) => {
        triggered = true;
        expect(unit.instanceId).toBe(deadUnit.instanceId);
        return [];
      },
    });

    const shouldTrigger = await trigger.shouldTriggerForDeath(deadUnit, game);
    expect(shouldTrigger).toBe(true);

    await trigger.triggerForDeath(deadUnit, game);
    expect(triggered).toBe(true);
  });

  it('should generate actions when triggered', async () => {
    const trigger = new OnUnitDeathTrigger({
      onTrigger: async (unit, game) => {
        return [
          new DrawCardAction(player, {
            count: 1,
            fromZone: 'mainDeck',
            toZone: 'hand',
          }),
        ];
      },
    });

    const generatedActions = await trigger.triggerForDeath(deadUnit, game);
    expect(generatedActions).toHaveLength(1);
    expect(generatedActions[0]).toBeInstanceOf(DrawCardAction);
  });

  it('should filter by specific unit', async () => {
    const trigger = new OnUnitDeathTrigger({
      filter: (unit) => unit.instanceId === deadUnit.instanceId,
      onTrigger: async () => [],
    });

    expect(await trigger.shouldTriggerForDeath(deadUnit, game)).toBe(true);
    expect(await trigger.shouldTriggerForDeath(otherUnit, game)).toBe(false);
  });

  it('should filter by controller', async () => {
    const friendlyUnit = createMockCard('friendly');
    friendlyUnit.controllerId = 'p1';

    const enemyUnit = createMockCard('enemy');
    enemyUnit.controllerId = 'p2';

    const trigger = new OnUnitDeathTrigger({
      filter: (unit) => unit.controllerId === 'p1',
      onTrigger: async () => [],
    });

    expect(await trigger.shouldTriggerForDeath(friendlyUnit, game)).toBe(true);
    expect(await trigger.shouldTriggerForDeath(enemyUnit, game)).toBe(false);
  });

  it('should generate damage actions for all enemy units', async () => {
    const enemy1 = createMockCard('enemy-1');
    enemy1.controllerId = 'p2';
    const enemy2 = createMockCard('enemy-2');
    enemy2.controllerId = 'p2';

    game.battlefields[0].units = [deadUnit, enemy1, enemy2];

    const trigger = new OnUnitDeathTrigger({
      filter: (unit) => unit.instanceId === deadUnit.instanceId,
      onTrigger: async (unit, game) => {
        const enemies = game.battlefields[0].units.filter(u => u.controllerId === 'p2');
        return enemies.map(target =>
          new DealDamageAction(player, {
            target,
            amount: 2,
            damageType: 'effect',
          })
        );
      },
    });

    const generatedActions = await trigger.triggerForDeath(deadUnit, game);
    expect(generatedActions).toHaveLength(2);
    expect(generatedActions[0]).toBeInstanceOf(DealDamageAction);
    expect(generatedActions[1]).toBeInstanceOf(DealDamageAction);
  });

  it('should respect max triggers', async () => {
    const trigger = new OnUnitDeathTrigger({
      maxTriggers: 1,
      onTrigger: async () => [],
    });

    expect(await trigger.shouldTriggerForDeath(deadUnit, game)).toBe(true);
    await trigger.triggerForDeath(deadUnit, game);

    expect(await trigger.shouldTriggerForDeath(deadUnit, game)).toBe(false);
  });

  it('should become inactive after expiration', async () => {
    const trigger = new OnUnitDeathTrigger({
      expiresWhen: (game) => game.phase === GamePhase.ENDING,
      onTrigger: async () => [],
    });

    expect(trigger.isActive(game)).toBe(true);

    game.phase = GamePhase.ENDING;
    expect(trigger.isActive(game)).toBe(false);
  });
});
