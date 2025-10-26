/**
 * ModifierRegistry - Manages all active action modifiers.
 *
 * Modifiers can intercept and modify actions before they execute.
 * Examples:
 * - Spell damage +1
 * - Cost reduction
 * - Barrier (prevent damage)
 * - Damage doubling
 *
 * @module engine/actions/ModifierRegistry
 */

import type { Game } from '../../types/game';
import type {
  GameActionType,
  ActionModifier,
  ModifierPriority,
  TimingLayer,
} from '../../types/actions';

/**
 * Registry that tracks all active modifiers.
 *
 * Modifiers are organized by:
 * 1. Action type they modify
 * 2. Priority (lower = executes first)
 * 3. Registration timestamp (for tie-breaking)
 */
export class ModifierRegistry {
  /**
   * Map of action type → array of modifiers.
   * Modifiers are kept sorted by priority.
   */
  private modifiers: Map<GameActionType, ActionModifier[]> = new Map();

  /**
   * Map of modifier ID → metadata for fast lookup.
   */
  private modifierMetadata: Map<string, ModifierMetadata> = new Map();

  /**
   * Register a modifier for a specific action type.
   *
   * @param actionType - The type of action this modifier affects
   * @param modifier - The modifier to register
   */
  register(actionType: GameActionType, modifier: ActionModifier): void {
    // Get or create modifier array for this action type
    if (!this.modifiers.has(actionType)) {
      this.modifiers.set(actionType, []);
    }

    const modifierList = this.modifiers.get(actionType)!;

    // Add modifier
    modifierList.push(modifier);

    // Sort by priority (lower = first)
    this.sortModifiers(modifierList);

    // Store metadata
    this.modifierMetadata.set(modifier.id, {
      actionTypes: [actionType],
      registeredAt: new Date(),
    });
  }

  /**
   * Register a modifier for multiple action types.
   *
   * Useful for modifiers that affect multiple related actions.
   * Example: A modifier that affects both DEAL_DAMAGE and DEAL_COMBAT_DAMAGE
   *
   * @param actionTypes - Array of action types this modifier affects
   * @param modifier - The modifier to register
   */
  registerMultiple(actionTypes: GameActionType[], modifier: ActionModifier): void {
    for (const actionType of actionTypes) {
      this.register(actionType, modifier);
    }

    // Update metadata with all action types
    this.modifierMetadata.set(modifier.id, {
      actionTypes,
      registeredAt: new Date(),
    });
  }

  /**
   * Unregister a specific modifier.
   *
   * Removes the modifier from all action types it was registered for.
   *
   * @param modifier - The modifier to unregister
   */
  unregister(modifier: ActionModifier): void {
    const metadata = this.modifierMetadata.get(modifier.id);

    if (!metadata) {
      return; // Modifier not registered
    }

    // Remove from all action types
    for (const actionType of metadata.actionTypes) {
      const modifierList = this.modifiers.get(actionType);

      if (modifierList) {
        const index = modifierList.findIndex(m => m.id === modifier.id);

        if (index !== -1) {
          modifierList.splice(index, 1);
        }
      }
    }

    // Remove metadata
    this.modifierMetadata.delete(modifier.id);
  }

  /**
   * Unregister all modifiers from a specific source card.
   *
   * Used when a card leaves play - all its modifiers are removed.
   *
   * @param sourceCardId - Instance ID of the source card
   */
  unregisterBySource(sourceCardId: string): void {
    const modifiersToRemove: ActionModifier[] = [];

    // Find all modifiers from this source
    for (const modifierList of this.modifiers.values()) {
      for (const modifier of modifierList) {
        if (modifier.sourceCard?.instanceId === sourceCardId) {
          modifiersToRemove.push(modifier);
        }
      }
    }

    // Unregister them
    for (const modifier of modifiersToRemove) {
      this.unregister(modifier);
    }
  }

  /**
   * Get all modifiers for a specific action type.
   *
   * Returns modifiers in priority order (already sorted).
   *
   * @param actionType - The action type to get modifiers for
   * @returns Array of modifiers (sorted by priority)
   */
  getModifiersFor(actionType: GameActionType): ActionModifier[] {
    return this.modifiers.get(actionType) || [];
  }

  /**
   * Get all active modifiers across all action types.
   *
   * @returns Array of all registered modifiers
   */
  getAllModifiers(): ActionModifier[] {
    const allModifiers: ActionModifier[] = [];
    const seen = new Set<string>();

    for (const modifierList of this.modifiers.values()) {
      for (const modifier of modifierList) {
        if (!seen.has(modifier.id)) {
          allModifiers.push(modifier);
          seen.add(modifier.id);
        }
      }
    }

    return allModifiers;
  }

  /**
   * Cleanup expired modifiers.
   *
   * Removes modifiers that have expired due to:
   * - Time-based expiration
   * - Use-based expiration
   *
   * This is called automatically after each action resolution.
   */
  cleanupExpired(): void {
    const expiredModifiers: ActionModifier[] = [];

    // Find expired modifiers
    for (const modifierList of this.modifiers.values()) {
      for (const modifier of modifierList) {
        if (modifier.isExpired()) {
          expiredModifiers.push(modifier);
        }
      }
    }

    // Remove expired modifiers
    for (const modifier of expiredModifiers) {
      this.unregister(modifier);
    }
  }

  /**
   * Get count of registered modifiers.
   *
   * @returns Total number of unique modifiers
   */
  getModifierCount(): number {
    return this.modifierMetadata.size;
  }

  /**
   * Check if a modifier is registered.
   *
   * @param modifierId - ID of the modifier to check
   * @returns True if registered
   */
  isRegistered(modifierId: string): boolean {
    return this.modifierMetadata.has(modifierId);
  }

  /**
   * Sort modifiers by priority.
   *
   * Sorting order:
   * 1. Timing layer (if specified)
   * 2. Priority (lower = first)
   * 3. Registration timestamp (earlier = first)
   *
   * @param modifiers - Array of modifiers to sort (modified in place)
   * @private
   */
  private sortModifiers(modifiers: ActionModifier[]): void {
    modifiers.sort((a, b) => {
      // First, sort by timing layer if both have it
      if (a.timingLayer !== undefined && b.timingLayer !== undefined) {
        const layerDiff = a.timingLayer - b.timingLayer;
        if (layerDiff !== 0) return layerDiff;
      }

      // Then by priority (lower = first)
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff !== 0) return priorityDiff;

      // Finally by registration time (earlier = first)
      const metadataA = this.modifierMetadata.get(a.id);
      const metadataB = this.modifierMetadata.get(b.id);

      if (metadataA && metadataB) {
        return metadataA.registeredAt.getTime() - metadataB.registeredAt.getTime();
      }

      return 0;
    });
  }

  /**
   * Clear all modifiers.
   *
   * Used for testing and game reset.
   */
  clear(): void {
    this.modifiers.clear();
    this.modifierMetadata.clear();
  }
}

/**
 * Metadata stored for each registered modifier.
 */
interface ModifierMetadata {
  /** Action types this modifier is registered for */
  actionTypes: GameActionType[];

  /** When this modifier was registered */
  registeredAt: Date;
}
