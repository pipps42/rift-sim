/**
 * Base ActionModifier Class
 *
 * Abstract base class for all action modifiers in the V3 system.
 * Modifiers intercept actions before they execute and can:
 * - Modify action data (damage +1, cost reduction, etc)
 * - Completely prevent actions (Barrier, Silence, etc)
 * - Replace actions with different actions
 *
 * @module engine/actions/base
 */

import type { Game, GameCard } from '../../../types/game';
import type { GameAction, ActionModifier as IActionModifier, TimingLayer } from '../../../types/actions';

/**
 * Generate unique ID for modifiers.
 */
let modifierIdCounter = 0;
export function generateModifierId(): string {
  return `modifier-${Date.now()}-${modifierIdCounter++}`;
}

/**
 * Abstract base class for action modifiers.
 *
 * Design principles:
 * 1. Modifiers are PURE - no side effects during modify()
 * 2. Modifiers return NEW action instance or null (never mutate)
 * 3. Modifiers can expire (time-based or use-based)
 * 4. Modifiers have priority for ordering
 */
export abstract class ActionModifier implements IActionModifier {
  /** Unique ID for this modifier */
  public readonly id: string;

  /** Type identifier for this modifier */
  public abstract readonly type: string;

  /** Priority within timing layer (lower = earlier) */
  public abstract readonly priority: number;

  /** Timing layer for this modifier */
  public abstract readonly timingLayer: TimingLayer;

  /** Card that created this modifier (if any) */
  public readonly sourceCard?: GameCard;

  /** When this modifier expires (if time-based) */
  public expiresAt?: Date;

  /** Number of uses before expiring (if use-based) */
  public expiresAfterUses?: number;

  /** Current use count */
  public currentUses: number = 0;

  /** When this modifier was created */
  public readonly createdAt: Date;

  /**
   * Create a new action modifier.
   *
   * @param sourceCard - Card that created this modifier (optional)
   */
  constructor(sourceCard?: GameCard) {
    this.id = generateModifierId();
    if (sourceCard !== undefined) {
      (this as any).sourceCard = sourceCard;
    }
    this.createdAt = new Date();
  }

  // ============================================================================
  // ABSTRACT METHODS (must be implemented by subclasses)
  // ============================================================================

  /**
   * Modify an action before it executes.
   *
   * Must NOT mutate the original action - create a new instance if modified.
   *
   * @param action - The action to modify
   * @param game - Current game state (read-only during modification)
   * @returns Modified action, or null to completely prevent the action
   */
  abstract modify(action: GameAction, game: Game): Promise<GameAction | null>;

  /**
   * Check if this modifier is currently active.
   *
   * Inactive modifiers are not applied to actions.
   * Common reasons for inactivity:
   * - Source card no longer in play
   * - Condition not met (e.g., "while you have 3+ units")
   * - Explicitly disabled
   *
   * @param game - Current game state
   * @returns True if modifier should be applied
   */
  abstract isActive(game: Game): boolean;

  // ============================================================================
  // EXPIRATION LOGIC
  // ============================================================================

  /**
   * Check if this modifier has expired.
   *
   * Expired modifiers are removed from the registry.
   */
  public isExpired(): boolean {
    // Time-based expiration
    if (this.expiresAt && Date.now() > this.expiresAt.getTime()) {
      return true;
    }

    // Use-based expiration
    if (this.expiresAfterUses !== undefined && this.currentUses >= this.expiresAfterUses) {
      return true;
    }

    return false;
  }

  /**
   * Set this modifier to expire after a duration.
   *
   * @param milliseconds - Duration in milliseconds
   */
  public expireAfter(milliseconds: number): this {
    this.expiresAt = new Date(Date.now() + milliseconds);
    return this;
  }

  /**
   * Set this modifier to expire after a number of uses.
   *
   * @param uses - Number of uses before expiration
   */
  public expireAfterNUses(uses: number): this {
    this.expiresAfterUses = uses;
    return this;
  }

  /**
   * Mark this modifier as used (for use-based expiration).
   */
  public markUsed(): void {
    this.currentUses++;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get a human-readable description of this modifier.
   */
  public abstract getDescription(): string;

  /**
   * Check if this modifier is from a specific card.
   */
  public isFromCard(card: GameCard): boolean {
    return this.sourceCard?.instanceId === card.instanceId;
  }

  /**
   * Get remaining uses (if use-based expiration).
   */
  public getRemainingUses(): number | undefined {
    if (this.expiresAfterUses === undefined) {
      return undefined;
    }
    return Math.max(0, this.expiresAfterUses - this.currentUses);
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
   * Serialize modifier for debugging.
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      priority: this.priority,
      timingLayer: this.timingLayer,
      sourceCardId: this.sourceCard?.instanceId,
      currentUses: this.currentUses,
      expiresAfterUses: this.expiresAfterUses,
      expiresAt: this.expiresAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }

  public toString(): string {
    const sourceStr = this.sourceCard ? ` [${this.sourceCard.cardId}]` : '';
    return `${this.type}${sourceStr}`;
  }
}
