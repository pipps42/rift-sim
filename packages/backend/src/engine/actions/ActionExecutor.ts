/**
 * ActionExecutor - Core engine that executes actions through the full pipeline.
 *
 * This is the heart of the V3 GameAction system. It orchestrates:
 * - Validation
 * - Modifier application
 * - Execution
 * - History logging
 * - Trigger resolution
 *
 * @module engine/actions/ActionExecutor
 */

import type { Game } from '../../types/game';
import type {
  GameAction,
  ActionExecutionResult,
  GameActionType,
} from '../../types/actions';
import { ModifierRegistry } from './ModifierRegistry';
import { TriggerRegistry } from './TriggerRegistry';
import { NullAction } from './base/GameAction';

/**
 * Maximum recursion depth to prevent infinite loops.
 */
const MAX_STACK_DEPTH = 100;

/**
 * ActionExecutor orchestrates the execution of all game actions.
 *
 * Pipeline stages:
 * 1. Validation - Can this action be executed?
 * 2. Modifier Application - Apply all registered modifiers in priority order
 * 3. Execution - Execute the (potentially modified) action
 * 4. History Logging - Automatically log to game history
 * 5. Trigger Resolution - Fire all triggered abilities
 * 6. Side Effects - Execute any actions generated as side effects
 * 7. Post-Resolution Cleanup - Cleanup when stack returns to 0
 */
export class ActionExecutor {
  private game: Game;
  private modifierRegistry: ModifierRegistry;
  private triggerRegistry: TriggerRegistry;

  /**
   * Complete history of all actions executed.
   * Used for replay, debugging, and undo/redo.
   */
  private actionHistory: GameAction[] = [];

  /**
   * Current execution stack.
   * Used to track recursion depth and detect infinite loops.
   */
  private executionStack: GameAction[] = [];

  /**
   * Flag to prevent cleanup from running multiple times.
   */
  private cleanupInProgress: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.modifierRegistry = new ModifierRegistry();
    this.triggerRegistry = new TriggerRegistry();
  }

  /**
   * Main entry point: Execute an action through the full pipeline.
   *
   * @param action - The action to execute
   * @returns Result indicating success/failure and any side effects
   *
   * @throws Error if stack depth exceeds maximum (infinite recursion detected)
   */
  async execute(action: GameAction): Promise<ActionExecutionResult> {
    // ===== STACK DEPTH PROTECTION =====
    if (this.executionStack.length >= MAX_STACK_DEPTH) {
      throw new Error(
        `Action stack overflow - infinite recursion detected. ` +
        `Max depth: ${MAX_STACK_DEPTH}, ` +
        `Action: ${action.type}`
      );
    }

    // Push to execution stack
    this.executionStack.push(action);
    action.metadata.stackDepth = this.executionStack.length;

    try {
      // ===== PHASE 1: VALIDATION =====
      const validation = action.validate(this.game);

      if (!validation.valid) {
        return {
          success: false,
          error: new Error(
            `Action validation failed: ${validation.reason}` +
            (validation.context ? ` (${JSON.stringify(validation.context)})` : '')
          ),
        };
      }

      // ===== PHASE 2: MODIFIER PIPELINE =====
      let modifiedAction = await this.applyModifiers(action);

      // Check for replacement effects (modifier returned null or NullAction)
      if (
        modifiedAction === null ||
        modifiedAction.type === 'null_action' ||
        modifiedAction instanceof NullAction
      ) {
        // Action was completely prevented
        this.logPreventedAction(action, modifiedAction);

        return {
          success: true,
          data: { prevented: true, reason: 'replacement_effect' },
        };
      }

      // ===== PHASE 3: EXECUTION =====
      const result = await modifiedAction.execute(this.game);

      if (!result.success) {
        return result;
      }

      // ===== PHASE 4: HISTORY LOGGING =====
      this.actionHistory.push(modifiedAction);
      const historyEntry = modifiedAction.toHistoryEntry();
      this.game.history.push(historyEntry);

      // ===== PHASE 5: TRIGGER RESOLUTION =====
      const triggeredActions = await this.resolveTriggers(modifiedAction);

      // ===== PHASE 6: SIDE EFFECTS =====
      const sideEffects = [
        ...(result.sideEffects || []),
        ...triggeredActions,
      ];

      // Execute side effects recursively
      for (const sideEffect of sideEffects) {
        sideEffect.metadata.isTriggered = true;
        await this.execute(sideEffect); // Recursive call
      }

      const finalResult: ActionExecutionResult = { success: true };
      if (result.data !== undefined) {
        finalResult.data = result.data;
      }
      return finalResult;

    } finally {
      // Pop from execution stack
      this.executionStack.pop();

      // ===== PHASE 7: POST-RESOLUTION CLEANUP =====
      // Only run cleanup when we return to stack depth 0
      if (this.executionStack.length === 0 && !this.cleanupInProgress) {
        await this.performPostResolutionCleanup();
      }
    }
  }

  /**
   * Apply all registered modifiers to an action in priority order.
   *
   * Modifiers can:
   * - Modify the action data (e.g., increase damage)
   * - Replace the action with a different action
   * - Prevent the action entirely (return null)
   *
   * @param action - The action to modify
   * @returns The modified action, or null if prevented
   *
   * @private
   */
  private async applyModifiers(action: GameAction): Promise<GameAction | null> {
    const modifiers = this.modifierRegistry.getModifiersFor(action.type);

    if (modifiers.length === 0) {
      return action; // No modifiers, return original
    }

    // Modifiers are already sorted by priority in the registry
    let currentAction: GameAction | null = action;

    for (const modifier of modifiers) {
      // Skip inactive modifiers
      if (!modifier.isActive(this.game)) {
        continue;
      }

      // Apply modifier
      const modified = await modifier.modify(currentAction!, this.game);

      if (modified === null) {
        // Modifier prevented the action completely
        return null;
      }

      currentAction = modified;

      // If modifier is one-shot and was just used, mark it
      if (modifier.expiresAfterUses !== undefined) {
        modifier.markUsed();
      }
    }

    return currentAction;
  }

  /**
   * Resolve all triggers that react to an action.
   *
   * Triggers generate new actions as side effects.
   * These will be executed recursively after the original action completes.
   *
   * @param action - The action that may trigger abilities
   * @returns Array of actions generated by triggers
   *
   * @private
   */
  private async resolveTriggers(action: GameAction): Promise<GameAction[]> {
    const triggers = this.triggerRegistry.getTriggersFor(action.type);

    if (triggers.length === 0) {
      return []; // No triggers
    }

    // Triggers are already sorted by priority in the registry
    const triggeredActions: GameAction[] = [];

    for (const trigger of triggers) {
      // Skip inactive triggers
      if (!trigger.isActive(this.game)) {
        continue;
      }

      // Fire trigger
      const actions = await trigger.onAction(action, this.game);
      triggeredActions.push(...actions);

      // Mark trigger as fired
      trigger.markFired();

      // One-shot triggers are automatically unregistered
      if (trigger.isOneShot && !trigger.isExpired()) {
        this.triggerRegistry.unregister(trigger);
      }
    }

    return triggeredActions;
  }

  /**
   * Cleanup performed when execution stack returns to depth 0.
   *
   * This includes:
   * 1. State-based actions (death checks, etc.)
   * 2. Expired modifier cleanup
   * 3. Expired trigger cleanup
   * 4. Aura updates (if implemented)
   *
   * @private
   */
  private async performPostResolutionCleanup(): Promise<void> {
    // Prevent recursive cleanup
    if (this.cleanupInProgress) {
      return;
    }

    this.cleanupInProgress = true;

    try {
      // 1. Process deaths (state-based action)
      // Units with damage >= might are killed
      // TODO: Implement processDeaths in Game class
      await this.game.processDeaths?.();

      // 2. Cleanup expired modifiers
      this.modifierRegistry.cleanupExpired();

      // 3. Cleanup expired triggers
      this.triggerRegistry.cleanupExpired();

      // 4. Update auras (if aura system is implemented)
      // await this.game.auraSystem?.update();

    } finally {
      this.cleanupInProgress = false;
    }
  }

  /**
   * Log an action that was prevented by a modifier.
   *
   * @param originalAction - The original action before modifiers
   * @param preventedBy - The action/null returned by the preventing modifier
   *
   * @private
   */
  private logPreventedAction(
    originalAction: GameAction,
    preventedBy: GameAction | null
  ): void {
    const historyEntry = {
      id: originalAction.id,
      gameId: this.game.id,
      type: 'action_prevented' as any,
      timestamp: new Date(),
      data: {
        originalAction: originalAction.type,
        originalData: originalAction.data,
        preventedBy: preventedBy?.type || 'replacement_effect',
      },
    };

    this.game.history.push(historyEntry);
  }

  /**
   * Get the complete action history.
   * Used for replay, debugging, and game state reconstruction.
   *
   * @returns Read-only array of all executed actions
   */
  getActionHistory(): ReadonlyArray<GameAction> {
    return this.actionHistory;
  }

  /**
   * Get the current stack depth.
   * Useful for debugging and detecting potential infinite loops.
   *
   * @returns Current recursion depth
   */
  getStackDepth(): number {
    return this.executionStack.length;
  }

  /**
   * Get the current execution stack.
   * Used for debugging and visualization.
   *
   * @returns Read-only array of actions currently being executed
   */
  getExecutionStack(): ReadonlyArray<GameAction> {
    return this.executionStack;
  }

  /**
   * Get the modifier registry.
   * Allows external systems to register/unregister modifiers.
   *
   * @returns The modifier registry
   */
  getModifierRegistry(): ModifierRegistry {
    return this.modifierRegistry;
  }

  /**
   * Get the trigger registry.
   * Allows external systems to register/unregister triggers.
   *
   * @returns The trigger registry
   */
  getTriggerRegistry(): TriggerRegistry {
    return this.triggerRegistry;
  }

  /**
   * Clear all history and reset state.
   * Used for testing and game reset.
   *
   * WARNING: This is destructive and should only be used in specific scenarios.
   */
  reset(): void {
    this.actionHistory = [];
    this.executionStack = [];
    this.cleanupInProgress = false;
    this.modifierRegistry = new ModifierRegistry();
    this.triggerRegistry = new TriggerRegistry();
  }
}
