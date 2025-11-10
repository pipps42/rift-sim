/**
 * History Query API
 *
 * Provides helper methods for common history queries.
 * Avoids repetitive filter/map/reduce logic in card scripts.
 *
 * Inspired by LoR's history system that exposes API for direct queries
 * like "getSpellsCastThisTurn(player)".
 *
 * Example usage in card script:
 * ```typescript
 * const spells = ctx.game.historyQuery.getSpellsCastThisTurn(ctx.owner.id);
 * await ctx.game.effects.dealDamage(target, spells);
 * ```
 */

import type { Game, GameEvent, EventType } from '../../types/game';

/**
 * Predicate function for filtering events.
 */
export type EventPredicate = (event: GameEvent) => boolean;

/**
 * History Query API.
 * Provides optimized queries for common game history patterns.
 */
export class HistoryQueryAPI {
  constructor(private game: Game) {}

  /**
   * Get current game history.
   * Useful for custom queries.
   */
  getHistory(): readonly GameEvent[] {
    return this.game.history || [];
  }

  /**
   * Get current turn number.
   */
  getCurrentTurn(): number {
    return this.game.round;
  }

  // =========================================================================
  // SPELL QUERIES
  // =========================================================================

  /**
   * Get number of spells cast this turn by a player.
   *
   * @param playerId - Player ID
   * @returns Count of spells cast
   */
  getSpellsCastThisTurn(playerId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('SPELL_CAST' as EventType) &&
        e.playerId === playerId &&
        this.isCurrentTurn(e)
    ).length;
  }

  /**
   * Get number of spells cast this game by a player.
   */
  getSpellsCastThisGame(playerId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('SPELL_CAST' as EventType) &&
        e.playerId === playerId
    ).length;
  }

  /**
   * Get all spell cast events this turn.
   */
  getSpellsCastThisTurnEvents(playerId?: string): GameEvent[] {
    return this.getHistory().filter(
      (e) =>
        e.type === ('SPELL_CAST' as EventType) &&
        this.isCurrentTurn(e) &&
        (!playerId || e.playerId === playerId)
    );
  }

  // =========================================================================
  // UNIT QUERIES
  // =========================================================================

  /**
   * Get number of units played this turn by a player.
   */
  getUnitsPlayedThisTurn(playerId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('UNIT_PLAYED' as EventType) &&
        e.playerId === playerId &&
        this.isCurrentTurn(e)
    ).length;
  }

  /**
   * Get number of units played this game by a player.
   */
  getUnitsPlayedThisGame(playerId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('UNIT_PLAYED' as EventType) &&
        e.playerId === playerId
    ).length;
  }

  /**
   * Get number of units that died this turn.
   */
  getUnitsDeathsThisTurn(playerId?: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('UNIT_DEATH' as EventType) &&
        this.isCurrentTurn(e) &&
        (!playerId || e.playerId === playerId)
    ).length;
  }

  // =========================================================================
  // DAMAGE QUERIES
  // =========================================================================

  /**
   * Get total damage dealt this turn by a specific card.
   */
  getDamageDealtByCard(cardInstanceId: string): number {
    return this.getHistory()
      .filter(
        (e) =>
          e.type === ('DAMAGE' as EventType) &&
          e.data?.sourceId === cardInstanceId &&
          this.isCurrentTurn(e)
      )
      .reduce((sum, e) => sum + (e.data?.amount || 0), 0);
  }

  /**
   * Get total damage taken this turn by a specific card.
   */
  getDamageTakenByCard(cardInstanceId: string): number {
    return this.getHistory()
      .filter(
        (e) =>
          e.type === ('DAMAGE' as EventType) &&
          e.data?.targetId === cardInstanceId &&
          this.isCurrentTurn(e)
      )
      .reduce((sum, e) => sum + (e.data?.amount || 0), 0);
  }

  /**
   * Get total damage dealt this turn by a player.
   */
  getTotalDamageDealtThisTurn(playerId: string): number {
    return this.getHistory()
      .filter(
        (e) =>
          e.type === ('DAMAGE' as EventType) &&
          e.playerId === playerId &&
          this.isCurrentTurn(e)
      )
      .reduce((sum, e) => sum + (e.data?.amount || 0), 0);
  }

  // =========================================================================
  // CARD DRAW QUERIES
  // =========================================================================

  /**
   * Get number of cards drawn this turn by a player.
   */
  getCardsDrawnThisTurn(playerId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('CARD_DRAW' as EventType) &&
        e.playerId === playerId &&
        this.isCurrentTurn(e)
    ).length;
  }

  /**
   * Get number of cards drawn this game by a player.
   */
  getCardsDrawnThisGame(playerId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('CARD_DRAW' as EventType) &&
        e.playerId === playerId
    ).length;
  }

  // =========================================================================
  // ATTACK QUERIES
  // =========================================================================

  /**
   * Get number of attacks this turn.
   */
  getAttacksThisTurn(playerId?: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('ATTACK' as EventType) &&
        this.isCurrentTurn(e) &&
        (!playerId || e.playerId === playerId)
    ).length;
  }

  /**
   * Get number of times a specific card attacked this game.
   */
  getCardAttackCount(cardInstanceId: string): number {
    return this.getHistory().filter(
      (e) =>
        e.type === ('ATTACK' as EventType) &&
        e.cardId === cardInstanceId
    ).length;
  }

  // =========================================================================
  // GENERAL QUERIES
  // =========================================================================

  /**
   * Get last N events of a specific type.
   */
  getLastEvents(type: EventType | string, count: number): GameEvent[] {
    return this.getHistory()
      .filter((e) => e.type === type)
      .slice(-count);
  }

  /**
   * Get last event of a specific type.
   */
  getLastEvent(type: EventType | string): GameEvent | undefined {
    const events = this.getHistory().filter((e) => e.type === type);
    return events.length > 0 ? events[events.length - 1] : undefined;
  }

  /**
   * Check if an event occurred this turn.
   */
  didEventOccurThisTurn(predicate: EventPredicate): boolean {
    return this.getHistory().some(
      (e) => this.isCurrentTurn(e) && predicate(e)
    );
  }

  /**
   * Check if an event occurred this game.
   */
  didEventOccurThisGame(predicate: EventPredicate): boolean {
    return this.getHistory().some(predicate);
  }

  /**
   * Count events matching predicate this turn.
   */
  countEventsThisTurn(predicate: EventPredicate): number {
    return this.getHistory().filter(
      (e) => this.isCurrentTurn(e) && predicate(e)
    ).length;
  }

  /**
   * Count events matching predicate this game.
   */
  countEventsThisGame(predicate: EventPredicate): number {
    return this.getHistory().filter(predicate).length;
  }

  /**
   * Get all events this turn.
   */
  getEventsThisTurn(): GameEvent[] {
    return this.getHistory().filter((e) => this.isCurrentTurn(e));
  }

  /**
   * Get all events of a specific type this turn.
   */
  getEventsByTypeThisTurn(type: EventType | string): GameEvent[] {
    return this.getHistory().filter(
      (e) => e.type === type && this.isCurrentTurn(e)
    );
  }

  /**
   * Get all events by a specific player this turn.
   */
  getEventsByPlayerThisTurn(playerId: string): GameEvent[] {
    return this.getHistory().filter(
      (e) => e.playerId === playerId && this.isCurrentTurn(e)
    );
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  /**
   * Check if event occurred during current turn.
   */
  private isCurrentTurn(event: GameEvent): boolean {
    // Events don't have turn number, so we need a different approach
    // For now, we'll check if it's in the "recent" history
    // In production, events should have a turn/round field

    // Fallback: check if event has a turn field in data
    if (event.data?.turn !== undefined) {
      return event.data.turn === this.getCurrentTurn();
    }

    // Alternative: check timestamp (events in last X minutes)
    // This is a temporary solution - ideally events should have turn number
    return true; // TODO: Implement proper turn tracking in GameEvent
  }
}
