/**
 * CardStorage Tests
 *
 * Tests the card storage system for storing and sharing data between cards.
 */

import { CardStorage, type CardStorageAPI } from '../CardStorage';

describe('CardStorage', () => {
  let storage: CardStorage;

  beforeEach(() => {
    storage = new CardStorage();
  });

  describe('Basic Operations', () => {
    it('should create storage for a card', () => {
      const cardStorage = storage.getCardStorage('card-1');

      expect(cardStorage).toBeDefined();
      expect(typeof cardStorage.get).toBe('function');
      expect(typeof cardStorage.set).toBe('function');
    });

    it('should set and get values', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('key1', 'value1');
      expect(cardStorage.get('key1')).toBe('value1');

      cardStorage.set('key2', 42);
      expect(cardStorage.get('key2')).toBe(42);

      cardStorage.set('key3', { nested: 'object' });
      expect(cardStorage.get('key3')).toEqual({ nested: 'object' });
    });

    it('should return undefined for non-existent keys', () => {
      const cardStorage = storage.getCardStorage('card-1');

      expect(cardStorage.get('nonexistent')).toBeUndefined();
    });

    it('should check if key exists', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('exists', true);

      expect(cardStorage.has('exists')).toBe(true);
      expect(cardStorage.has('not-exists')).toBe(false);
    });

    it('should delete keys', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('toDelete', 'value');
      expect(cardStorage.has('toDelete')).toBe(true);

      const deleted = cardStorage.delete('toDelete');
      expect(deleted).toBe(true);
      expect(cardStorage.has('toDelete')).toBe(false);

      const deletedAgain = cardStorage.delete('toDelete');
      expect(deletedAgain).toBe(false);
    });

    it('should clear all data for a card', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('key1', 'value1');
      cardStorage.set('key2', 'value2');
      cardStorage.set('key3', 'value3');

      expect(cardStorage.size()).toBe(3);

      cardStorage.clear();

      expect(cardStorage.size()).toBe(0);
      expect(cardStorage.get('key1')).toBeUndefined();
    });
  });

  describe('Numeric Operations', () => {
    it('should increment values', () => {
      const cardStorage = storage.getCardStorage('card-1');

      const result1 = cardStorage.increment('counter');
      expect(result1).toBe(1);

      const result2 = cardStorage.increment('counter');
      expect(result2).toBe(2);

      const result3 = cardStorage.increment('counter', 5);
      expect(result3).toBe(7);
    });

    it('should decrement values', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('counter', 10);

      const result1 = cardStorage.decrement('counter');
      expect(result1).toBe(9);

      const result2 = cardStorage.decrement('counter', 3);
      expect(result2).toBe(6);
    });

    it('should initialize to 0 for increment on non-existent key', () => {
      const cardStorage = storage.getCardStorage('card-1');

      const result = cardStorage.increment('newCounter');
      expect(result).toBe(1);
    });

    it('should initialize to 0 for decrement on non-existent key', () => {
      const cardStorage = storage.getCardStorage('card-1');

      const result = cardStorage.decrement('newCounter');
      expect(result).toBe(-1);
    });
  });

  describe('Enumeration', () => {
    it('should return all keys', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('key1', 'value1');
      cardStorage.set('key2', 'value2');
      cardStorage.set('key3', 'value3');

      const keys = cardStorage.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('should return all values', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('key1', 'value1');
      cardStorage.set('key2', 'value2');

      const values = cardStorage.values();
      expect(values).toHaveLength(2);
      expect(values).toContain('value1');
      expect(values).toContain('value2');
    });

    it('should return all entries', () => {
      const cardStorage = storage.getCardStorage('card-1');

      cardStorage.set('key1', 'value1');
      cardStorage.set('key2', 'value2');

      const entries = cardStorage.entries();
      expect(entries).toHaveLength(2);
      expect(entries).toContainEqual(['key1', 'value1']);
      expect(entries).toContainEqual(['key2', 'value2']);
    });

    it('should return correct size', () => {
      const cardStorage = storage.getCardStorage('card-1');

      expect(cardStorage.size()).toBe(0);

      cardStorage.set('key1', 'value1');
      expect(cardStorage.size()).toBe(1);

      cardStorage.set('key2', 'value2');
      expect(cardStorage.size()).toBe(2);

      cardStorage.delete('key1');
      expect(cardStorage.size()).toBe(1);
    });
  });

  describe('Multi-Card Storage', () => {
    it('should maintain separate storage for different cards', () => {
      const card1Storage = storage.getCardStorage('card-1');
      const card2Storage = storage.getCardStorage('card-2');

      card1Storage.set('shared-key', 'card1-value');
      card2Storage.set('shared-key', 'card2-value');

      expect(card1Storage.get('shared-key')).toBe('card1-value');
      expect(card2Storage.get('shared-key')).toBe('card2-value');
    });

    it('should return same storage instance for same card ID', () => {
      const storage1 = storage.getCardStorage('card-1');
      const storage2 = storage.getCardStorage('card-1');

      storage1.set('key', 'value');
      expect(storage2.get('key')).toBe('value');
    });

    it('should track number of cards with storage', () => {
      expect(storage.getCardCount()).toBe(0);

      storage.getCardStorage('card-1');
      expect(storage.getCardCount()).toBe(1);

      storage.getCardStorage('card-2');
      expect(storage.getCardCount()).toBe(2);

      // Getting same card again shouldn't increase count
      storage.getCardStorage('card-1');
      expect(storage.getCardCount()).toBe(2);
    });

    it('should list all card IDs with storage', () => {
      storage.getCardStorage('card-1');
      storage.getCardStorage('card-2');
      storage.getCardStorage('card-3');

      const cardIds = storage.getCardIds();
      expect(cardIds).toHaveLength(3);
      expect(cardIds).toContain('card-1');
      expect(cardIds).toContain('card-2');
      expect(cardIds).toContain('card-3');
    });
  });

  describe('Cleanup Operations', () => {
    it('should clear storage for a specific card', () => {
      const card1Storage = storage.getCardStorage('card-1');
      const card2Storage = storage.getCardStorage('card-2');

      card1Storage.set('key', 'value1');
      card2Storage.set('key', 'value2');

      storage.clearCardStorage('card-1');

      expect(storage.hasCardStorage('card-1')).toBe(false);
      expect(storage.hasCardStorage('card-2')).toBe(true);
      expect(card2Storage.get('key')).toBe('value2');
    });

    it('should clear all storage', () => {
      storage.getCardStorage('card-1').set('key', 'value');
      storage.getCardStorage('card-2').set('key', 'value');

      expect(storage.getCardCount()).toBe(2);

      storage.clearAll();

      expect(storage.getCardCount()).toBe(0);
    });

    it('should handle clearing non-existent card gracefully', () => {
      expect(() => {
        storage.clearCardStorage('non-existent');
      }).not.toThrow();
    });
  });

  describe('Debug and Utility', () => {
    it('should create debug dump', () => {
      storage.getCardStorage('card-1').set('key1', 'value1');
      storage.getCardStorage('card-1').set('key2', 42);
      storage.getCardStorage('card-2').set('counter', 5);

      const dump = storage.debugDump();

      expect(dump).toEqual({
        'card-1': {
          key1: 'value1',
          key2: 42,
        },
        'card-2': {
          counter: 5,
        },
      });
    });

    it('should calculate total size', () => {
      storage.getCardStorage('card-1').set('key1', 'value');
      storage.getCardStorage('card-1').set('key2', 'value');
      storage.getCardStorage('card-2').set('key3', 'value');

      expect(storage.getTotalSize()).toBe(3);
    });

    it('should export and import state', () => {
      storage.getCardStorage('card-1').set('key', 'value');
      storage.getCardStorage('card-2').increment('counter', 5);

      const exported = storage.exportState();

      const newStorage = new CardStorage();
      newStorage.importState(exported);

      expect(newStorage.getCardStorage('card-1').get('key')).toBe('value');
      expect(newStorage.getCardStorage('card-2').get('counter')).toBe(5);
    });
  });

  describe('Use Case: Yasuo & Nexus Pattern', () => {
    it('should support LoR-style spell tracking', () => {
      // Nexus card tracks spells cast
      const nexusStorage = storage.getCardStorage('nexus-p1');

      // Spell 1 cast
      nexusStorage.increment('spellsCastThisTurn');
      expect(nexusStorage.get('spellsCastThisTurn')).toBe(1);

      // Spell 2 cast
      nexusStorage.increment('spellsCastThisTurn');
      expect(nexusStorage.get('spellsCastThisTurn')).toBe(2);

      // Yasuo reads the counter
      const yasuoStorage = storage.getCardStorage('yasuo-instance-1');
      const spellCount = nexusStorage.get('spellsCastThisTurn');

      expect(spellCount).toBe(2);

      // Turn ends, reset counter
      nexusStorage.set('spellsCastThisTurn', 0);
      expect(nexusStorage.get('spellsCastThisTurn')).toBe(0);
    });

    it('should support unit remembering attacks', () => {
      const unitStorage = storage.getCardStorage('unit-instance-1');

      // Unit attacks
      unitStorage.increment('attacksThisGame');
      expect(unitStorage.get('attacksThisGame')).toBe(1);

      // Attack again
      unitStorage.increment('attacksThisGame');
      expect(unitStorage.get('attacksThisGame')).toBe(2);

      // Check if unit has attacked 2+ times
      const hasAttackedTwice = (unitStorage.get('attacksThisGame') || 0) >= 2;
      expect(hasAttackedTwice).toBe(true);
    });
  });
});
