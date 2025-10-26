/**
 * TriggerRegistry - Manages all active action triggers.
 *
 * Triggers react to actions and generate new actions as side effects.
 * Examples:
 * - "When I attack: Deal 1 damage"
 * - "When a unit dies: Draw a card"
 * - "When you play a spell: Deal 1 random damage"
 *
 * @module engine/actions/TriggerRegistry
 */

import type { Game } from '../../types/game';
import type {
  GameActionType,
  ActionTrigger,
  TriggerPriority,
} from '../../types/actions';

/**
 * Registry that tracks all active triggers.
 *
 * Triggers are organized by:
 * 1. Action type they trigger on
 * 2. Priority (lower = executes first)
 * 3. Registration timestamp (for tie-breaking)
 */
export class TriggerRegistry {
  /**
   * Map of action type → array of triggers.
   * Triggers are kept sorted by priority.
   */
  private triggers: Map<GameActionType, ActionTrigger[]> = new Map();

  /**
   * Map of trigger ID → metadata for fast lookup.
   */
  private triggerMetadata: Map<string, TriggerMetadata> = new Map();

  /**
   * Register a trigger for a specific action type.
   *
   * @param actionType - The type of action this trigger reacts to
   * @param trigger - The trigger to register
   */
  register(actionType: GameActionType, trigger: ActionTrigger): void {
    // Get or create trigger array for this action type
    if (!this.triggers.has(actionType)) {
      this.triggers.set(actionType, []);
    }

    const triggerList = this.triggers.get(actionType)!;

    // Add trigger
    triggerList.push(trigger);

    // Sort by priority (lower = first)
    this.sortTriggers(triggerList);

    // Store metadata
    this.triggerMetadata.set(trigger.id, {
      actionTypes: [actionType],
      registeredAt: new Date(),
    });
  }

  /**
   * Register a trigger for multiple action types.
   *
   * Useful for triggers that react to multiple related actions.
   * Example: A trigger that fires on both DEAL_DAMAGE and DEAL_COMBAT_DAMAGE
   *
   * @param actionTypes - Array of action types this trigger reacts to
   * @param trigger - The trigger to register
   */
  registerMultiple(actionTypes: GameActionType[], trigger: ActionTrigger): void {
    for (const actionType of actionTypes) {
      this.register(actionType, trigger);
    }

    // Update metadata with all action types
    this.triggerMetadata.set(trigger.id, {
      actionTypes,
      registeredAt: new Date(),
    });
  }

  /**
   * Unregister a specific trigger.
   *
   * Removes the trigger from all action types it was registered for.
   *
   * @param trigger - The trigger to unregister
   */
  unregister(trigger: ActionTrigger): void {
    const metadata = this.triggerMetadata.get(trigger.id);

    if (!metadata) {
      return; // Trigger not registered
    }

    // Remove from all action types
    for (const actionType of metadata.actionTypes) {
      const triggerList = this.triggers.get(actionType);

      if (triggerList) {
        const index = triggerList.findIndex(t => t.id === trigger.id);

        if (index !== -1) {
          triggerList.splice(index, 1);
        }
      }
    }

    // Remove metadata
    this.triggerMetadata.delete(trigger.id);
  }

  /**
   * Unregister all triggers from a specific source card.
   *
   * Used when a card leaves play - all its triggers are removed.
   *
   * @param sourceCardId - Instance ID of the source card
   */
  unregisterBySource(sourceCardId: string): void {
    const triggersToRemove: ActionTrigger[] = [];

    // Find all triggers from this source
    for (const triggerList of this.triggers.values()) {
      for (const trigger of triggerList) {
        if (trigger.sourceCard?.instanceId === sourceCardId) {
          triggersToRemove.push(trigger);
        }
      }
    }

    // Unregister them
    for (const trigger of triggersToRemove) {
      this.unregister(trigger);
    }
  }

  /**
   * Get all triggers for a specific action type.
   *
   * Returns triggers in priority order (already sorted).
   *
   * @param actionType - The action type to get triggers for
   * @returns Array of triggers (sorted by priority)
   */
  getTriggersFor(actionType: GameActionType): ActionTrigger[] {
    return this.triggers.get(actionType) || [];
  }

  /**
   * Get all active triggers across all action types.
   *
   * @returns Array of all registered triggers
   */
  getAllTriggers(): ActionTrigger[] {
    const allTriggers: ActionTrigger[] = [];
    const seen = new Set<string>();

    for (const triggerList of this.triggers.values()) {
      for (const trigger of triggerList) {
        if (!seen.has(trigger.id)) {
          allTriggers.push(trigger);
          seen.add(trigger.id);
        }
      }
    }

    return allTriggers;
  }

  /**
   * Cleanup expired triggers.
   *
   * Removes triggers that have expired due to:
   * - Time-based expiration
   * - One-shot triggers that have fired
   *
   * This is called automatically after each action resolution.
   */
  cleanupExpired(): void {
    const expiredTriggers: ActionTrigger[] = [];

    // Find expired triggers
    for (const triggerList of this.triggers.values()) {
      for (const trigger of triggerList) {
        if (trigger.isExpired()) {
          expiredTriggers.push(trigger);
        }
      }
    }

    // Remove expired triggers
    for (const trigger of expiredTriggers) {
      this.unregister(trigger);
    }
  }

  /**
   * Get count of registered triggers.
   *
   * @returns Total number of unique triggers
   */
  getTriggerCount(): number {
    return this.triggerMetadata.size;
  }

  /**
   * Check if a trigger is registered.
   *
   * @param triggerId - ID of the trigger to check
   * @returns True if registered
   */
  isRegistered(triggerId: string): boolean {
    return this.triggerMetadata.has(triggerId);
  }

  /**
   * Sort triggers by priority.
   *
   * Sorting order:
   * 1. Priority (lower = first)
   * 2. Registration timestamp (earlier = first)
   *
   * @param triggers - Array of triggers to sort (modified in place)
   * @private
   */
  private sortTriggers(triggers: ActionTrigger[]): void {
    triggers.sort((a, b) => {
      // First by priority (lower = first)
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff !== 0) return priorityDiff;

      // Then by registration time (earlier = first)
      const metadataA = this.triggerMetadata.get(a.id);
      const metadataB = this.triggerMetadata.get(b.id);

      if (metadataA && metadataB) {
        return metadataA.registeredAt.getTime() - metadataB.registeredAt.getTime();
      }

      return 0;
    });
  }

  /**
   * Clear all triggers.
   *
   * Used for testing and game reset.
   */
  clear(): void {
    this.triggers.clear();
    this.triggerMetadata.clear();
  }
}

/**
 * Metadata stored for each registered trigger.
 */
interface TriggerMetadata {
  /** Action types this trigger is registered for */
  actionTypes: GameActionType[];

  /** When this trigger was registered */
  registeredAt: Date;
}
