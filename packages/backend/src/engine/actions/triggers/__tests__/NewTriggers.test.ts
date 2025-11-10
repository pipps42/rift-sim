/**
 * Tests for new V3 triggers (Phase A additions)
 *
 * Tests:
 * - OnCombatStartTrigger
 * - OnMoveCompleteTrigger
 * - OnStunnedTrigger
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  OnCombatStartTrigger,
  OnMoveCompleteTrigger,
  OnStunnedTrigger,
} from '../index';
import { MoveUnitAction } from '../../concrete/MoveUnitAction';
import { StunUnitAction } from '../../concrete/StunUnitAction';
import { DealDamageAction } from '../../concrete/DealDamageAction';
import type { Game, Player, GameCard } from '../../../../types/game';
import { GameActionType } from '../../../../types/actions';

// ============================================================================
// MOCK SETUP
// ============================================================================

function createMockGame(players?: Player[]): Game {
  return {
    id: 'test-game',
    history: [],
    players: players || [],
    battlefields: [
      { id: 'bf-1', units: [], card: {} as any, contested: false, facedownCards: [], scoredThisTurn: false },
    ],
    chain: [],
    phase: 'action',
  } as any;
}

function createMockPlayer(id: string): Player {
  return {
    id,
    name: `Player ${id}`,
    score: 0,
    zones: {
      base: [],
      hand: [],
      trash: [],
      mainDeck: [],
      runeDeck: [],
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
    ready: true,
  } as any;
}

describe('New V3 Triggers - Phase A', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    player1 = createMockPlayer('p1');
    player2 = createMockPlayer('p2');
    game = createMockGame([player1, player2]);
  });

  // =========================================================================
  // ON COMBAT START TRIGGER
  // =========================================================================

  describe('OnCombatStartTrigger', () => {
    it('should trigger when unit attacks', async () => {
      const attacker = createMockCard('unit-1', 'warrior', 'p1');
      const defender = createMockCard('unit-2', 'guard', 'p2');

      let triggered = false;

      const trigger = new OnCombatStartTrigger({
        sourceCard: attacker,
        filter: (combatData) => {
          return combatData.participant.instanceId === attacker.instanceId &&
                 combatData.isAttacker === true;
        },
        onTrigger: async (combatData) => {
          triggered = true;
          expect(combatData.isAttacker).toBe(true);
          expect(combatData.participant.instanceId).toBe(attacker.instanceId);
          return [];
        },
      });

      // Simulate combat start action
      const combatStartAction = {
        type: GameActionType.START_COMBAT,
        data: {
          participant: attacker,
          isAttacker: true,
          battlefieldId: 'bf-1',
          attackers: [attacker],
          defenders: [defender],
          opposingPlayerId: 'p2',
        },
      } as any;

      const generatedActions = await trigger.onAction(combatStartAction, game);

      expect(triggered).toBe(true);
      expect(generatedActions).toEqual([]);
    });

    it('should trigger when unit defends', async () => {
      const attacker = createMockCard('unit-1', 'warrior', 'p1');
      const defender = createMockCard('unit-2', 'guard', 'p2');

      let defendTriggered = false;

      const trigger = new OnCombatStartTrigger({
        sourceCard: defender,
        filter: (combatData) => {
          return combatData.participant.instanceId === defender.instanceId &&
                 combatData.isAttacker === false;
        },
        onTrigger: async (combatData) => {
          defendTriggered = true;
          expect(combatData.isAttacker).toBe(false);
          return [];
        },
      });

      const combatStartAction = {
        type: GameActionType.START_COMBAT,
        data: {
          participant: defender,
          isAttacker: false,
          battlefieldId: 'bf-1',
          attackers: [attacker],
          defenders: [defender],
          opposingPlayerId: 'p1',
        },
      } as any;

      await trigger.onAction(combatStartAction, game);

      expect(defendTriggered).toBe(true);
    });

    it('should respect max triggers limit', async () => {
      const attacker = createMockCard('unit-1', 'warrior', 'p1');

      let triggerCount = 0;

      const trigger = new OnCombatStartTrigger({
        sourceCard: attacker,
        maxTriggers: 2,
        filter: (combatData) => combatData.participant.instanceId === attacker.instanceId,
        onTrigger: async () => {
          triggerCount++;
          return [];
        },
      });

      const combatAction = {
        type: GameActionType.START_COMBAT,
        data: {
          participant: attacker,
          isAttacker: true,
          battlefieldId: 'bf-1',
          attackers: [attacker],
          defenders: [],
          opposingPlayerId: 'p2',
        },
      } as any;

      // Trigger 3 times
      await trigger.onAction(combatAction, game);
      await trigger.onAction(combatAction, game);
      await trigger.onAction(combatAction, game);

      expect(triggerCount).toBe(2); // Should only fire twice
    });

    it('should work with oneShot', async () => {
      const attacker = createMockCard('unit-1', 'warrior', 'p1');
      let triggerCount = 0;

      const trigger = new OnCombatStartTrigger({
        sourceCard: attacker,
        oneShot: true,
        onTrigger: async () => {
          triggerCount++;
          return [];
        },
      });

      const combatAction = {
        type: GameActionType.START_COMBAT,
        data: {
          participant: attacker,
          isAttacker: true,
          battlefieldId: 'bf-1',
          attackers: [attacker],
          defenders: [],
          opposingPlayerId: 'p2',
        },
      } as any;

      await trigger.onAction(combatAction, game);
      await trigger.onAction(combatAction, game);

      expect(triggerCount).toBe(1); // oneShot = maxTriggers: 1
    });
  });

  // =========================================================================
  // ON MOVE COMPLETE TRIGGER
  // =========================================================================

  describe('OnMoveCompleteTrigger', () => {
    it('should trigger when unit moves', async () => {
      const unit = createMockCard('unit-1', 'scout', 'p1');
      game.battlefields[0].units.push(unit);

      let triggered = false;
      let moveData: any = null;

      const trigger = new OnMoveCompleteTrigger({
        sourceCard: unit,
        filter: (data) => data.movedCard.instanceId === unit.instanceId,
        onTrigger: async (data) => {
          triggered = true;
          moveData = data;
          return [];
        },
      });

      const moveAction = new MoveUnitAction(player1, {
        unit,
        destination: { type: 'base' },
      });

      await trigger.onAction(moveAction, game);

      expect(triggered).toBe(true);
      expect(moveData.movedCard.instanceId).toBe(unit.instanceId);
    });

    it('should generate actions on move', async () => {
      const unit = createMockCard('unit-1', 'bombard', 'p1');
      const enemy = createMockCard('unit-2', 'target', 'p2');
      game.battlefields[0].units.push(enemy);

      const trigger = new OnMoveCompleteTrigger({
        sourceCard: unit,
        onTrigger: async (data, game) => {
          // Deal 1 damage when arriving
          return [
            new DealDamageAction(player1, {
              target: enemy,
              amount: 1,
              damageType: 'effect',
            }),
          ];
        },
      });

      const moveAction = new MoveUnitAction(player1, {
        unit,
        destination: { type: 'battlefield', battlefieldId: 'bf-1' },
      });

      const generatedActions = await trigger.onAction(moveAction, game);

      expect(generatedActions.length).toBe(1);
      expect(generatedActions[0]).toBeInstanceOf(DealDamageAction);
    });
  });

  // =========================================================================
  // ON STUNNED TRIGGER
  // =========================================================================

  describe('OnStunnedTrigger', () => {
    it('should trigger when unit is stunned', async () => {
      const target = createMockCard('unit-1', 'enemy', 'p2');
      const stunner = createMockCard('yasuo', 'yasuo', 'p1');
      game.battlefields[0].units.push(target);

      let triggered = false;
      let stunData: any = null;

      const trigger = new OnStunnedTrigger({
        sourceCard: stunner,
        onTrigger: async (data) => {
          triggered = true;
          stunData = data;
          return [];
        },
      });

      const stunAction = new StunUnitAction(player1, {
        target,
        duration: 1,
      }, stunner);

      await trigger.onAction(stunAction, game);

      expect(triggered).toBe(true);
      expect(stunData.target.instanceId).toBe(target.instanceId);
      expect(stunData.stunner?.instanceId).toBe(stunner.instanceId);
      expect(stunData.duration).toBe(1);
    });

    it('should filter by stunner', async () => {
      const target = createMockCard('unit-1', 'enemy', 'p2');
      const yasuo = createMockCard('yasuo', 'yasuo', 'p1');
      const otherCard = createMockCard('other', 'other', 'p1');
      game.battlefields[0].units.push(target);

      let triggerCount = 0;

      const trigger = new OnStunnedTrigger({
        sourceCard: yasuo,
        filter: (data) => data.stunner?.instanceId === yasuo.instanceId,
        onTrigger: async () => {
          triggerCount++;
          return [];
        },
      });

      // Stun by Yasuo - should trigger
      const stunByYasuo = new StunUnitAction(player1, { target, duration: 1 }, yasuo);
      await trigger.onAction(stunByYasuo, game);

      // Stun by other card - should NOT trigger
      const stunByOther = new StunUnitAction(player1, { target, duration: 1 }, otherCard);
      await trigger.onAction(stunByOther, game);

      expect(triggerCount).toBe(1);
    });

    it('should generate damage on stun (Yasuo synergy)', async () => {
      const target = createMockCard('unit-1', 'enemy', 'p2');
      const yasuo = createMockCard('yasuo', 'yasuo', 'p1');
      game.battlefields[0].units.push(target);

      const trigger = new OnStunnedTrigger({
        sourceCard: yasuo,
        onTrigger: async (data) => {
          // Deal 2 damage to stunned unit
          return [
            new DealDamageAction(player1, {
              target: data.target,
              amount: 2,
              damageType: 'effect',
            }),
          ];
        },
      });

      const stunAction = new StunUnitAction(player1, { target, duration: 1 }, yasuo);
      const generatedActions = await trigger.onAction(stunAction, game);

      expect(generatedActions.length).toBe(1);
      expect(generatedActions[0]).toBeInstanceOf(DealDamageAction);
      const damageAction = generatedActions[0] as DealDamageAction;
      expect((damageAction.data as any).amount).toBe(2);
    });
  });
});
