import { GameEvent, EventType } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

/**
 * Factory functions for creating specific Riftbound game events
 */
export class GameEventFactory {

  /**
   * Create a game start event
   */
  static createGameStartEvent(gameId: string, playerIds: string[]): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.GAME_START,
      timestamp: new Date(),
      data: { playerIds }
    };
  }

  /**
   * Create a turn start event
   */
  static createTurnStartEvent(gameId: string, playerId: string, turnNumber: number): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.TURN_START,
      playerId,
      timestamp: new Date(),
      data: { turnNumber }
    };
  }

  /**
   * Create a turn end event
   */
  static createTurnEndEvent(gameId: string, playerId: string, turnNumber: number): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.TURN_END,
      playerId,
      timestamp: new Date(),
      data: { turnNumber }
    };
  }

  /**
   * Create a phase change event
   */
  static createPhaseChangeEvent(gameId: string, playerId: string, fromPhase: string, toPhase: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.PHASE_CHANGE,
      playerId,
      timestamp: new Date(),
      data: { fromPhase, toPhase }
    };
  }

  /**
   * Create a card played event
   */
  static createCardPlayedEvent(gameId: string, playerId: string, cardId: string, targetIds?: string[]): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.CARD_PLAYED,
      playerId,
      cardId,
      timestamp: new Date(),
      data: { targetIds }
    };
  }

  /**
   * Create a card drawn event
   */
  static createCardDrawnEvent(gameId: string, playerId: string, cardId: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.CARD_DRAWN,
      playerId,
      cardId,
      timestamp: new Date(),
      data: {}
    };
  }

  /**
   * Create a unit moved event
   */
  static createUnitMovedEvent(gameId: string, playerId: string, unitId: string, fromLocation: string, toLocation: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.UNIT_MOVED,
      playerId,
      cardId: unitId,
      timestamp: new Date(),
      data: { fromLocation, toLocation }
    };
  }

  /**
   * Create a combat start event
   */
  static createCombatStartEvent(gameId: string, battlefieldId: string, attackingPlayer: string, defendingPlayer: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.COMBAT_START,
      battlefieldId,
      timestamp: new Date(),
      data: { attackingPlayer, defendingPlayer }
    };
  }

  /**
   * Create a combat damage event
   */
  static createCombatDamageEvent(gameId: string, battlefieldId: string, damage: number, targetId: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.COMBAT_DAMAGE,
      battlefieldId,
      cardId: targetId,
      timestamp: new Date(),
      data: { damage }
    };
  }

  /**
   * Create a combat end event
   */
  static createCombatEndEvent(gameId: string, battlefieldId: string, winnerId?: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.COMBAT_END,
      battlefieldId,
      timestamp: new Date(),
      data: { winnerId }
    };
  }

  /**
   * Create a showdown start event
   */
  static createShowdownStartEvent(gameId: string, battlefieldId: string, focusPlayer: string, relevantPlayers: string[]): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.SHOWDOWN_START,
      battlefieldId,
      timestamp: new Date(),
      data: { focusPlayer, relevantPlayers }
    };
  }

  /**
   * Create a showdown end event
   */
  static createShowdownEndEvent(gameId: string, battlefieldId: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.SHOWDOWN_END,
      battlefieldId,
      timestamp: new Date(),
      data: {}
    };
  }

  /**
   * Create a battlefield scored event
   */
  static createBattlefieldScoredEvent(gameId: string, playerId: string, battlefieldId: string, points: number, method: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.BATTLEFIELD_SCORED,
      playerId,
      battlefieldId,
      timestamp: new Date(),
      data: { points, method }
    };
  }

  /**
   * Create a game end event
   */
  static createGameEndEvent(gameId: string, winnerId: string, reason: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.GAME_END,
      playerId: winnerId,
      timestamp: new Date(),
      data: { reason }
    };
  }

  /**
   * Create an ability activated event
   */
  static createAbilityActivatedEvent(gameId: string, playerId: string, abilityId: string, sourceCardId: string, targetIds?: string[]): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.ABILITY_ACTIVATED,
      playerId,
      cardId: sourceCardId,
      timestamp: new Date(),
      data: { abilityId, targetIds }
    };
  }

  /**
   * Create a spell cast event
   */
  static createSpellCastEvent(gameId: string, playerId: string, spellId: string, targetIds?: string[]): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.SPELL_CAST,
      playerId,
      cardId: spellId,
      timestamp: new Date(),
      data: { targetIds }
    };
  }

  /**
   * Create a unit died event
   */
  static createUnitDiedEvent(gameId: string, unitId: string, ownerId: string, cause: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.UNIT_DIED,
      playerId: ownerId,
      cardId: unitId,
      timestamp: new Date(),
      data: { cause }
    };
  }

  /**
   * Create a rune channeled event
   */
  static createRuneChanneledEvent(gameId: string, playerId: string, runeId: string): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.RUNE_CHANNELED,
      playerId,
      cardId: runeId,
      timestamp: new Date(),
      data: {}
    };
  }

  /**
   * Create a burn out event
   */
  static createBurnOutEvent(gameId: string, playerId: string, opponentId: string, pointsAwarded: number): GameEvent {
    return {
      id: uuidv4(),
      gameId,
      type: EventType.BURN_OUT,
      playerId,
      timestamp: new Date(),
      data: { opponentId, pointsAwarded }
    };
  }
}