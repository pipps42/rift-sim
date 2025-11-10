/**
 * Base GameAction Class
 *
 * Abstract base class for all game actions in the V3 system.
 * Actions are declarative objects that describe WHAT should happen,
 * not HOW it should happen.
 *
 * @module engine/actions/base
 */

import type {
  Game,
  GameCard,
  Player,
  GameEvent,
} from '../../../types/game';
import type {
  GameActionType,
  ActionValidationResult,
  ActionExecutionResult,
  ActionMetadata,
} from '../../../types/actions';

/**
 * Generate unique ID for actions.
 */
let actionIdCounter = 0;
export function generateActionId(): string {
  return `action-${Date.now()}-${actionIdCounter++}`;
}

/**
 * Abstract base class for all game actions.
 *
 * Design principles:
 * 1. Actions are DECLARATIVE - describe intent, not implementation
 * 2. Actions are IMMUTABLE during modification (clone if needed)
 * 3. Actions are SERIALIZABLE (for replay/network)
 * 4. Actions are VALIDATABLE (before execution)
 *
 * @template TData - Type of action-specific data
 */
export abstract class GameAction<TData = any> {
  /** Unique ID for this action instance */
  public readonly id: string;

  /** Type of action (for modifier/trigger matching) */
  public abstract readonly type: GameActionType;

  /** Player who initiated this action */
  public readonly controller: Player;

  /** Card that is the source of this action (if any) */
  public readonly source?: GameCard;

  /** When this action was created */
  public readonly timestamp: Date;

  /** Action-specific data (can be modified by pipeline) */
  public data: TData;

  /** Metadata for debugging/replay */
  public metadata: ActionMetadata;

  /**
   * Create a new game action.
   *
   * @param controller - Player who initiated this action
   * @param data - Action-specific data
   * @param source - Card that is the source of this action (optional)
   */
  constructor(controller: Player, data: TData, source?: GameCard) {
    this.id = generateActionId();
    this.controller = controller;
    if (source !== undefined) {
      (this as any).source = source;
    }
    this.timestamp = new Date();
    this.data = data;
    this.metadata = {
      stackDepth: 0,
      isTriggered: false,
      isModifierGenerated: false,
    };
  }

  // ============================================================================
  // ABSTRACT METHODS (must be implemented by subclasses)
  // ============================================================================

  /**
   * Validate if this action can be executed.
   *
   * Called BEFORE modifiers are applied.
   * Should check:
   * - Are targets valid?
   * - Are costs payable?
   * - Are timing restrictions met?
   *
   * @param game - Current game state
   * @returns Validation result with success/failure and reason
   */
  abstract validate(game: Game): ActionValidationResult;

  /**
   * Execute the action, mutating game state.
   *
   * Called AFTER modifiers have been applied.
   * This is the ONLY place where game state should be mutated.
   *
   * Implementation should:
   * 1. Apply the action's effects to game state
   * 2. Return success/failure status
   * 3. Optionally return side effect actions
   *
   * @param game - Current game state
   * @returns Execution result with success/failure and optional side effects
   */
  abstract execute(game: Game): ActionExecutionResult;

  /**
   * Convert action to history entry for logging.
   *
   * Called automatically after successful execution.
   * Should include all relevant information for:
   * - Replay
   * - Debugging
   * - UI display
   *
   * @returns Game event representing this action
   */
  abstract toHistoryEntry(): GameEvent;

  /**
   * Create a deep clone of this action.
   *
   * Used by modifiers to create modified versions without
   * mutating the original action.
   *
   * Implementation must:
   * - Create new instance with cloned data
   * - Preserve id, timestamp, source, controller
   * - Deep clone the data object
   *
   * @returns Cloned action
   */
  abstract clone(): GameAction<TData>;

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get a human-readable description of this action.
   * Useful for debugging and UI display.
   */
  abstract getDescription(): string;

  /**
   * Check if this action is from a specific player.
   */
  public isFrom(player: Player): boolean {
    return this.controller.id === player.id;
  }

  /**
   * Check if this action has a source card.
   */
  public hasSource(): boolean {
    return this.source !== undefined;
  }

  /**
   * Check if this action is from a specific card.
   */
  public isFromCard(card: GameCard): boolean {
    return this.source?.instanceId === card.instanceId;
  }

  /**
   * Check if this action was triggered by another action.
   */
  public isTriggered(): boolean {
    return this.metadata.isTriggered;
  }

  /**
   * Check if this action was generated by a modifier.
   */
  public isModifierGenerated(): boolean {
    return this.metadata.isModifierGenerated;
  }

  /**
   * Get the stack depth of this action.
   */
  public getStackDepth(): number {
    return this.metadata.stackDepth;
  }

  /**
   * Create a validation success result.
   */
  protected validationSuccess(): ActionValidationResult {
    return { valid: true };
  }

  /**
   * Create a validation failure result.
   */
  protected validationFailure(reason: string, context?: Record<string, any>): ActionValidationResult {
    const result: ActionValidationResult = { valid: false, reason };
    if (context !== undefined) {
      result.context = context;
    }
    return result;
  }

  /**
   * Create an execution success result.
   */
  protected executionSuccess(sideEffects?: GameAction[], data?: Record<string, any>): ActionExecutionResult {
    const result: ActionExecutionResult = { success: true };
    if (sideEffects !== undefined) {
      result.sideEffects = sideEffects;
    }
    if (data !== undefined) {
      result.data = data;
    }
    return result;
  }

  /**
   * Create an execution failure result.
   */
  protected executionFailure(error: Error): ActionExecutionResult {
    return { success: false, error };
  }

  // ============================================================================
  // SERIALIZATION
  // ============================================================================

  /**
   * Serialize action to JSON for replay/network.
   */
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      controllerId: this.controller.id,
      sourceInstanceId: this.source?.instanceId,
      timestamp: this.timestamp.toISOString(),
      data: this.data,
      metadata: this.metadata,
    };
  }

  /**
   * Get a short string representation for logging.
   */
  public toString(): string {
    const sourceStr = this.source ? ` [${this.source.cardId}]` : '';
    return `${this.type}${sourceStr} by ${this.controller.name}`;
  }
}

/**
 * Null Action - does nothing.
 * Used by replacement effects to completely prevent an action.
 */
export class NullAction extends GameAction<{}> {
  public readonly type = 'null_action' as any; // GameActionType.NULL_ACTION

  constructor() {
    // Null action has no controller or data
    super(null as any, {});
  }

  validate(game: Game): ActionValidationResult {
    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    // Do nothing
    return this.executionSuccess();
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'null_action' as any,
      timestamp: this.timestamp,
      data: {},
    };
  }

  clone(): NullAction {
    return new NullAction();
  }

  getDescription(): string {
    return 'Null Action (prevented)';
  }
}
