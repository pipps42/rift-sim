/**
 * Card Storage System
 *
 * Allows cards to store and share data across the game.
 * Inspired by Legends of Runeterra's "everything is a card" approach where
 * cards like Nexus can store counters (e.g., "spells cast this turn").
 *
 * Architecture:
 * - Each card instance has its own key-value storage
 * - Storage persists while card is in game
 * - Automatic cleanup when card leaves game
 * - O(1) access for get/set operations
 *
 * Example use cases:
 * - Yasuo: Read "spells cast this turn" from Nexus storage
 * - Nexus: Track game-wide counters
 * - Units: Remember "times attacked this game"
 * - Landmarks: Store persistent state
 */

/**
 * API for accessing a single card's storage.
 */
export interface CardStorageAPI {
  /**
   * Get value by key.
   * Returns undefined if key doesn't exist.
   */
  get<T = any>(key: string): T | undefined;

  /**
   * Set value by key.
   */
  set<T = any>(key: string, value: T): void;

  /**
   * Check if key exists.
   */
  has(key: string): boolean;

  /**
   * Delete key.
   * Returns true if key existed and was deleted.
   */
  delete(key: string): boolean;

  /**
   * Clear all data for this card.
   */
  clear(): void;

  /**
   * Increment numeric value by delta.
   * Initializes to 0 if key doesn't exist.
   * Returns new value.
   */
  increment(key: string, delta?: number): number;

  /**
   * Decrement numeric value by delta.
   * Initializes to 0 if key doesn't exist.
   * Returns new value.
   */
  decrement(key: string, delta?: number): number;

  /**
   * Get all keys.
   */
  keys(): string[];

  /**
   * Get all values.
   */
  values(): any[];

  /**
   * Get all entries as [key, value] pairs.
   */
  entries(): [string, any][];

  /**
   * Get number of stored keys.
   */
  size(): number;
}

/**
 * Card Storage Manager.
 * Manages storage for all card instances in the game.
 */
export class CardStorage {
  private storage = new Map<string, Map<string, any>>();

  /**
   * Get storage API for a specific card instance.
   *
   * @param cardInstanceId - Instance ID of the card
   * @returns Storage API for that card
   */
  getCardStorage(cardInstanceId: string): CardStorageAPI {
    // Ensure storage exists for this card
    if (!this.storage.has(cardInstanceId)) {
      this.storage.set(cardInstanceId, new Map<string, any>());
    }

    const cardData = this.storage.get(cardInstanceId)!;

    // Return API object
    return {
      get: <T = any>(key: string): T | undefined => {
        return cardData.get(key) as T | undefined;
      },

      set: <T = any>(key: string, value: T): void => {
        cardData.set(key, value);
      },

      has: (key: string): boolean => {
        return cardData.has(key);
      },

      delete: (key: string): boolean => {
        return cardData.delete(key);
      },

      clear: (): void => {
        cardData.clear();
      },

      increment: (key: string, delta: number = 1): number => {
        const current = cardData.get(key) as number | undefined;
        const newValue = (current || 0) + delta;
        cardData.set(key, newValue);
        return newValue;
      },

      decrement: (key: string, delta: number = 1): number => {
        const current = cardData.get(key) as number | undefined;
        const newValue = (current || 0) - delta;
        cardData.set(key, newValue);
        return newValue;
      },

      keys: (): string[] => {
        return Array.from(cardData.keys());
      },

      values: (): any[] => {
        return Array.from(cardData.values());
      },

      entries: (): [string, any][] => {
        return Array.from(cardData.entries());
      },

      size: (): number => {
        return cardData.size;
      },
    };
  }

  /**
   * Clear storage for a specific card.
   * Called when card leaves the game.
   *
   * @param cardInstanceId - Instance ID of the card
   */
  clearCardStorage(cardInstanceId: string): void {
    this.storage.delete(cardInstanceId);
  }

  /**
   * Clear all storage (for game reset).
   */
  clearAll(): void {
    this.storage.clear();
  }

  /**
   * Get total number of cards with storage data.
   */
  getCardCount(): number {
    return this.storage.size;
  }

  /**
   * Get all card instance IDs that have storage.
   */
  getCardIds(): string[] {
    return Array.from(this.storage.keys());
  }

  /**
   * Check if card has any storage data.
   */
  hasCardStorage(cardInstanceId: string): boolean {
    return this.storage.has(cardInstanceId);
  }

  /**
   * Get debug dump of all storage data.
   * Useful for debugging and testing.
   */
  debugDump(): Record<string, Record<string, any>> {
    const dump: Record<string, Record<string, any>> = {};

    for (const [cardId, data] of this.storage.entries()) {
      dump[cardId] = Object.fromEntries(data.entries());
    }

    return dump;
  }

  /**
   * Get total size (sum of all keys across all cards).
   */
  getTotalSize(): number {
    let total = 0;
    for (const data of this.storage.values()) {
      total += data.size;
    }
    return total;
  }

  /**
   * Import storage state (for game restoration/replay).
   */
  importState(state: Record<string, Record<string, any>>): void {
    this.storage.clear();

    for (const [cardId, data] of Object.entries(state)) {
      const cardMap = new Map<string, any>(Object.entries(data));
      this.storage.set(cardId, cardMap);
    }
  }

  /**
   * Export storage state (for game save/serialization).
   */
  exportState(): Record<string, Record<string, any>> {
    return this.debugDump();
  }
}
