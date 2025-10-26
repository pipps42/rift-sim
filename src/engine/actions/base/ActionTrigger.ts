/**
 * Base ActionTrigger Class
 *
 * Abstract base class for all action triggers in the V3 system.
 * Triggers react to actions AFTER they execute and can:
 * - Create new actions as consequences
 * - Track game state changes
 * - Implement card abilities like "When X happens, do Y"
 *
 * @module engine/actions/base
 */

import type { Game, GameCard } from '../../../types/game';
import type { GameAction, ActionTrigger as IActionTrigger, TriggerPriority } from '../../../types/actions';

/**
 * Generate unique ID for triggers.
 */
let triggerIdCounter = 0;
export function generateTriggerId(): string {
  return `trigger-${Date.now()}-${triggerIdCounter++}`;
}

/**
 * Abstract base class for action triggers.
 *
 * Design principles:
 * 1. Triggers are REACTIVE - fire after actions execute
 * 2. Triggers create NEW actions (never mutate original)
 * 3. Triggers can be one-shot or persistent
 * 4. Triggers have priority for ordering
 *
 * Examples:
 * - Yasuo: "When you stun a unit, deal 2 damage to it"
 * - Deathrattle: "When this dies, summon a 1/1"
 * - Attack trigger: "When this attacks, draw a card"
 */
export abstract class ActionTrigger implements IActionTrigger {
  /** Unique ID for this trigger */
  public readonly id: string;

  /** Type identifier for this trigger */
  public abstract readonly type: string;

  /** Priority for trigger resolution order (lower = earlier) */
  public abstract readonly priority: TriggerPriority;

  /** Card that created this trigger (if any) */
  public readonly sourceCard?: GameCard;

  /** Whether this trigger consumes itself after one use */
  public readonly isOneShot: boolean;

  /** When this trigger expires (if time-based) */
  public expiresAt?: Date;

  /** When this trigger was created */
  public readonly createdAt: Date;

  /** Number of times this trigger has fired */
  private fireCount: number = 0;

  /**
   * Create a new action trigger.
   *
   * @param sourceCard - Card that created this trigger (optional)
   * @param isOneShot - Whether trigger expires after one use (default: false)
   */
  constructor(sourceCard?: GameCard, isOneShot: boolean = false) {
    this.id = generateTriggerId();
    if (sourceCard !== undefined) {
      (this as any).sourceCard = sourceCard;
    }
    this.isOneShot = isOneShot;
    this.createdAt = new Date();
  }

  // ============================================================================
  // ABSTRACT METHODS (must be implemented by subclasses)
  // ============================================================================

  /**
   * React to an action and optionally create new actions.
   *
   * Called AFTER the action has successfully executed.
   * Should check if this trigger cares about the action, and if so,
   * create consequence actions.
   *
   * @param action - The action that just executed
   * @param game - Current game state
   * @returns Array of actions to execute as consequences (empty if none)
   */
  abstract onAction(action: GameAction, game: Game): Promise<GameAction[]>;

  /**
   * Check if this trigger is currently active.
   *
   * Inactive triggers do not fire.
   * Common reasons for inactivity:
   * - Source card no longer in play
   * - Condition not met (e.g., "while you control 3+ units")
   * - Explicitly disabled (e.g., Silenced)
   *
   * @param game - Current game state
   * @returns True if trigger should fire
   */
  abstract isActive(game: Game): boolean;

  // ============================================================================
  // EXPIRATION LOGIC
  // ============================================================================

  /**
   * Check if this trigger has expired.
   *
   * Expired triggers are removed from the registry.
   */
  public isExpired(): boolean {
    // Time-based expiration
    if (this.expiresAt && Date.now() > this.expiresAt.getTime()) {
      return true;
    }

    // One-shot triggers expire after firing once
    if (this.isOneShot && this.fireCount > 0) {
      return true;
    }

    return false;
  }

  /**
   * Set this trigger to expire after a duration.
   *
   * @param milliseconds - Duration in milliseconds
   */
  public expireAfter(milliseconds: number): this {
    this.expiresAt = new Date(Date.now() + milliseconds);
    return this;
  }

  /**
   * Mark this trigger as having fired.
   * Internal method called by the trigger system.
   */
  public markFired(): void {
    this.fireCount++;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get a human-readable description of this trigger.
   */
  public abstract getDescription(): string;

  /**
   * Check if this trigger is from a specific card.
   */
  public isFromCard(card: GameCard): boolean {
    return this.sourceCard?.instanceId === card.instanceId;
  }

  /**
   * Get number of times this trigger has fired.
   */
  public getFireCount(): number {
    return this.fireCount;
  }

  /**
   * Get remaining time (if time-based expiration).
   */
  public getRemainingTime(): number | undefined {
    if (!this.expiresAt) {
      return undefined;
    }
    return Math.max(0, this.expiresAt.getTime() - Date.now());
  }

  /**
   * Serialize trigger for debugging.
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      priority: this.priority,
      sourceCardId: this.sourceCard?.instanceId,
      isOneShot: this.isOneShot,
      fireCount: this.fireCount,
      expiresAt: this.expiresAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }

  public toString(): string {
    const sourceStr = this.sourceCard ? ` [${this.sourceCard.cardId}]` : '';
    const oneShotStr = this.isOneShot ? ' (one-shot)' : '';
    return `${this.type}${sourceStr}${oneShotStr}`;
  }
}
