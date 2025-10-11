/**
 * Tests for Additional Action Triggers (Phase C)
 *
 * Covers:
 * - OnUnitEnteredPlayTrigger
 * - OnScoringTrigger
 * - OnPhaseChangeTrigger
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { OnUnitEnteredPlayTrigger } from '../OnUnitEnteredPlayTrigger';
import { OnScoringTrigger, type ScoringData } from '../OnScoringTrigger';
import { OnPhaseChangeTrigger, type PhaseChangeData } from '../OnPhaseChangeTrigger';
import { PlayCardAction } from '../../concrete/PlayCardAction';
import { DrawCardAction } from '../../concrete/DrawCardAction';
import { DealDamageAction } from '../../concrete/DealDamageAction';
import type { Game, Player, GameCard, GamePhase } from '../../../../types/game';
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
    currentPlayerIndex: 0,
    round: 1,
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

function createMockCard(id: string, cardType: CardType = CardType.UNIT, ownerId: string = 'p1'): GameCard {
  return {
    instanceId: id,
    cardId: id.toUpperCase(),
    cardType,
    ownerId,
    controllerId: ownerId,
    ready: true,
    damage: 0,
    zone: 'hand',
    might: 3,
    domains: ['fury'],
  } as any;
}

// ============================================================================
// ON UNIT ENTERED PLAY TRIGGER TESTS
// ============================================================================

describe('OnUnitEnteredPlayTrigger', () => {
  let game: Game;
  let player: Player;
  let sourceCard: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    sourceCard = createMockCard('source-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should trigger when unit is played', async () => {
    const unit = createMockCard('unit-1', CardType.UNIT, 'p1');
    const action = new PlayCardAction(player, { card: unit });

    let triggered = false;
    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard,
      onTrigger: async (playedCard, game) => {
        triggered = true;
        expect(playedCard.instanceId).toBe('unit-1');
        return [];
      },
    });

    await trigger.onAction(action, game);
    expect(triggered).toBe(true);
    expect(trigger.getFireCount()).toBe(1);
  });

  it('should not trigger when spell is played', async () => {
    const spell = createMockCard('spell-1', CardType.SPELL, 'p1');
    const action = new PlayCardAction(player, { card: spell });

    let triggered = false;
    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard,
      onTrigger: async (playedCard, game) => {
        triggered = true;
        return [];
      },
    });

    await trigger.onAction(action, game);
    expect(triggered).toBe(false);
    expect(trigger.getFireCount()).toBe(0);
  });

  it('should not trigger when gear is played', async () => {
    const gear = createMockCard('gear-1', CardType.GEAR, 'p1');
    const action = new PlayCardAction(player, { card: gear });

    let triggered = false;
    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard,
      onTrigger: async (playedCard, game) => {
        triggered = true;
        return [];
      },
    });

    await trigger.onAction(action, game);
    expect(triggered).toBe(false);
  });

  it('should respect filter function', async () => {
    const furyUnit = createMockCard('fury-1', CardType.UNIT, 'p1');
    furyUnit.domains = ['fury'];

    const mystUnit = createMockCard('myst-1', CardType.UNIT, 'p1');
    mystUnit.domains = ['mystic'];

    const action1 = new PlayCardAction(player, { card: furyUnit });
    const action2 = new PlayCardAction(player, { card: mystUnit });

    let triggeredCount = 0;
    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard,
      filter: (playedCard, game) => {
        // Only trigger for Fury units
        return playedCard.domains?.includes('fury') ?? false;
      },
      onTrigger: async (playedCard, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.onAction(action1, game);
    expect(triggeredCount).toBe(1);

    await trigger.onAction(action2, game);
    expect(triggeredCount).toBe(1); // Should not increase
  });

  it('should respect maxTriggers', async () => {
    const unit1 = createMockCard('unit-1', CardType.UNIT);
    const unit2 = createMockCard('unit-2', CardType.UNIT);

    const action1 = new PlayCardAction(player, { card: unit1 });
    const action2 = new PlayCardAction(player, { card: unit2 });

    let triggeredCount = 0;
    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard,
      maxTriggers: 1,
      onTrigger: async (playedCard, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.onAction(action1, game);
    expect(triggeredCount).toBe(1);

    await trigger.onAction(action2, game);
    expect(triggeredCount).toBe(1); // Should not increase
    expect(trigger.isActive(game)).toBe(false);
  });

  it('should generate actions', async () => {
    const unit = createMockCard('unit-1', CardType.UNIT);
    const action = new PlayCardAction(player, { card: unit });

    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard,
      onTrigger: async (playedCard, game) => {
        // Draw a card when unit enters
        return [
          new DrawCardAction(player, {
            count: 1,
            fromZone: 'mainDeck',
            toZone: 'hand',
          }),
        ];
      },
    });

    const result = await trigger.onAction(action, game);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(DrawCardAction);
  });

  it('should generate correct description', () => {
    const trigger = new OnUnitEnteredPlayTrigger({
      maxTriggers: 3,
      onTrigger: async () => [],
    });

    const desc = trigger.getDescription();
    expect(desc).toContain('When a unit enters play');
    expect(desc).toContain('0/3');
  });
});

// ============================================================================
// ON SCORING TRIGGER TESTS
// ============================================================================

describe('OnScoringTrigger', () => {
  let game: Game;
  let player: Player;
  let sourceCard: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    sourceCard = createMockCard('source-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should trigger on scoring event', async () => {
    const scoringData: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'hold',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    let triggered = false;
    const trigger = new OnScoringTrigger({
      sourceCard,
      onTrigger: async (data, game) => {
        triggered = true;
        expect(data.playerId).toBe('p1');
        expect(data.method).toBe('hold');
        return [];
      },
    });

    await trigger.triggerScoring(scoringData, game);
    expect(triggered).toBe(true);
    expect(trigger.getFireCount()).toBe(1);
  });

  it('should filter by player', async () => {
    const p1Scoring: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'hold',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    const p2Scoring: ScoringData = {
      playerId: 'p2',
      battlefield: game.battlefields[0],
      method: 'conquer',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    let triggeredCount = 0;
    const trigger = new OnScoringTrigger({
      sourceCard,
      filter: (data, game) => data.playerId === 'p1',
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerScoring(p1Scoring, game);
    expect(triggeredCount).toBe(1);

    await trigger.triggerScoring(p2Scoring, game);
    expect(triggeredCount).toBe(1); // Should not increase
  });

  it('should filter by scoring method', async () => {
    const holdScoring: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'hold',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    const conquerScoring: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'conquer',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    let triggeredCount = 0;
    const trigger = new OnScoringTrigger({
      sourceCard,
      filter: (data, game) => data.method === 'conquer',
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerScoring(holdScoring, game);
    expect(triggeredCount).toBe(0);

    await trigger.triggerScoring(conquerScoring, game);
    expect(triggeredCount).toBe(1);
  });

  it('should detect Final Point', async () => {
    const finalPointScoring: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'hold',
      pointsAwarded: 1,
      isFinalPoint: true,
    };

    let isFinal = false;
    const trigger = new OnScoringTrigger({
      sourceCard,
      onTrigger: async (data, game) => {
        isFinal = data.isFinalPoint;
        return [];
      },
    });

    await trigger.triggerScoring(finalPointScoring, game);
    expect(isFinal).toBe(true);
  });

  it('should respect maxTriggers', async () => {
    const scoringData: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'hold',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    let triggeredCount = 0;
    const trigger = new OnScoringTrigger({
      sourceCard,
      maxTriggers: 2,
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerScoring(scoringData, game);
    await trigger.triggerScoring(scoringData, game);
    await trigger.triggerScoring(scoringData, game);

    expect(triggeredCount).toBe(2); // Only 2 triggers
    expect(trigger.isActive(game)).toBe(false);
  });

  it('should generate actions', async () => {
    const scoringData: ScoringData = {
      playerId: 'p1',
      battlefield: game.battlefields[0],
      method: 'hold',
      pointsAwarded: 1,
      isFinalPoint: false,
    };

    const trigger = new OnScoringTrigger({
      sourceCard,
      onTrigger: async (data, game) => {
        // Draw 2 cards when you score
        return [
          new DrawCardAction(player, {
            count: 2,
            fromZone: 'mainDeck',
            toZone: 'hand',
          }),
        ];
      },
    });

    const result = await trigger.triggerScoring(scoringData, game);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(DrawCardAction);
    expect((result[0] as DrawCardAction).data.count).toBe(2);
  });
});

// ============================================================================
// ON PHASE CHANGE TRIGGER TESTS
// ============================================================================

describe('OnPhaseChangeTrigger', () => {
  let game: Game;
  let player: Player;
  let sourceCard: GameCard;

  beforeEach(() => {
    game = createMockGame();
    player = createMockPlayer('p1', 'Player 1');
    sourceCard = createMockCard('source-1');
    game.players = [player, createMockPlayer('p2', 'Player 2')] as any;
  });

  it('should trigger on phase change', async () => {
    const phaseData: PhaseChangeData = {
      phase: 'AWAKEN' as GamePhase,
      previousPhase: 'CLEANUP' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    let triggered = false;
    const trigger = new OnPhaseChangeTrigger({
      sourceCard,
      onTrigger: async (data, game) => {
        triggered = true;
        expect(data.phase).toBe('AWAKEN');
        return [];
      },
    });

    await trigger.triggerPhaseChange(phaseData, game);
    expect(triggered).toBe(true);
    expect(trigger.getFireCount()).toBe(1);
  });

  it('should filter by target phase', async () => {
    const awakenData: PhaseChangeData = {
      phase: 'AWAKEN' as GamePhase,
      previousPhase: 'CLEANUP' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    const drawData: PhaseChangeData = {
      phase: 'DRAW' as GamePhase,
      previousPhase: 'CHANNEL' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    let triggeredCount = 0;
    const trigger = new OnPhaseChangeTrigger({
      sourceCard,
      targetPhase: 'AWAKEN' as GamePhase,
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerPhaseChange(awakenData, game);
    expect(triggeredCount).toBe(1);

    await trigger.triggerPhaseChange(drawData, game);
    expect(triggeredCount).toBe(1); // Should not increase
  });

  it('should filter by timing (start vs end)', async () => {
    const startData: PhaseChangeData = {
      phase: 'ACTION' as GamePhase,
      previousPhase: 'DRAW' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    const endData: PhaseChangeData = {
      phase: 'ACTION' as GamePhase,
      previousPhase: 'DRAW' as GamePhase,
      timing: 'end',
      currentPlayerId: 'p1',
      turn: 1,
    };

    let triggeredCount = 0;
    const trigger = new OnPhaseChangeTrigger({
      sourceCard,
      targetPhase: 'ACTION' as GamePhase,
      timing: 'end',
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerPhaseChange(startData, game);
    expect(triggeredCount).toBe(0); // Wrong timing

    await trigger.triggerPhaseChange(endData, game);
    expect(triggeredCount).toBe(1); // Correct timing
  });

  it('should filter by current player', async () => {
    const p1Turn: PhaseChangeData = {
      phase: 'AWAKEN' as GamePhase,
      previousPhase: 'CLEANUP' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    const p2Turn: PhaseChangeData = {
      phase: 'AWAKEN' as GamePhase,
      previousPhase: 'CLEANUP' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p2',
      turn: 2,
    };

    let triggeredCount = 0;
    const trigger = new OnPhaseChangeTrigger({
      sourceCard,
      targetPhase: 'AWAKEN' as GamePhase,
      filter: (data, game) => data.currentPlayerId === 'p1',
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerPhaseChange(p1Turn, game);
    expect(triggeredCount).toBe(1);

    await trigger.triggerPhaseChange(p2Turn, game);
    expect(triggeredCount).toBe(1); // Should not increase
  });

  it('should respect maxTriggers', async () => {
    const phaseData: PhaseChangeData = {
      phase: 'AWAKEN' as GamePhase,
      previousPhase: 'CLEANUP' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    let triggeredCount = 0;
    const trigger = new OnPhaseChangeTrigger({
      sourceCard,
      maxTriggers: 1,
      onTrigger: async (data, game) => {
        triggeredCount++;
        return [];
      },
    });

    await trigger.triggerPhaseChange(phaseData, game);
    await trigger.triggerPhaseChange(phaseData, game);

    expect(triggeredCount).toBe(1); // Only 1 trigger
    expect(trigger.isActive(game)).toBe(false);
  });

  it('should generate actions', async () => {
    const phaseData: PhaseChangeData = {
      phase: 'AWAKEN' as GamePhase,
      previousPhase: 'CLEANUP' as GamePhase,
      timing: 'start',
      currentPlayerId: 'p1',
      turn: 1,
    };

    const target = createMockCard('target-1');

    const trigger = new OnPhaseChangeTrigger({
      sourceCard,
      targetPhase: 'AWAKEN' as GamePhase,
      onTrigger: async (data, game) => {
        // Deal 1 damage at start of turn
        return [
          new DealDamageAction(player, {
            target,
            amount: 1,
            damageType: 'effect',
          }),
        ];
      },
    });

    const result = await trigger.triggerPhaseChange(phaseData, game);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(DealDamageAction);
  });

  it('should generate correct description', () => {
    const trigger = new OnPhaseChangeTrigger({
      targetPhase: 'AWAKEN' as GamePhase,
      timing: 'start',
      maxTriggers: 3,
      onTrigger: async () => [],
    });

    const desc = trigger.getDescription();
    expect(desc).toContain('At the start of');
    expect(desc).toContain('AWAKEN');
    expect(desc).toContain('0/3');
  });

  it('should get target phase and timing', () => {
    const trigger = new OnPhaseChangeTrigger({
      targetPhase: 'ENDING' as GamePhase,
      timing: 'end',
      onTrigger: async () => [],
    });

    expect(trigger.getTargetPhase()).toBe('ENDING');
    expect(trigger.getTiming()).toBe('end');
  });
});
