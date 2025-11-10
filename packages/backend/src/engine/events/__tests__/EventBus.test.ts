import { EventBus, EventListener } from '../EventBus';
import { GameEventFactory } from '../GameEvents';
import { EventType } from '../../../types/game';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  afterEach(() => {
    eventBus.clearAllListeners();
    eventBus.clearEventHistory();
  });

  describe('Listener Management', () => {
    it('should register and emit events to listeners', async () => {
      const mockCallback = jest.fn().mockResolvedValue(undefined);
      const listener: EventListener = {
        id: 'test-listener',
        priority: 0,
        callback: mockCallback
      };

      eventBus.on(EventType.GAME_START, listener);

      const event = GameEventFactory.createGameStartEvent('game-1', ['player-1', 'player-2']);
      await eventBus.emit(event);

      expect(mockCallback).toHaveBeenCalledWith(event);
    });

    it('should execute listeners in priority order (highest first)', async () => {
      const executionOrder: number[] = [];

      const lowPriorityListener: EventListener = {
        id: 'low',
        priority: 1,
        callback: async () => { executionOrder.push(1); }
      };

      const highPriorityListener: EventListener = {
        id: 'high',
        priority: 10,
        callback: async () => { executionOrder.push(10); }
      };

      const mediumPriorityListener: EventListener = {
        id: 'medium',
        priority: 5,
        callback: async () => { executionOrder.push(5); }
      };

      eventBus.on(EventType.TURN_START, lowPriorityListener);
      eventBus.on(EventType.TURN_START, highPriorityListener);
      eventBus.on(EventType.TURN_START, mediumPriorityListener);

      const event = GameEventFactory.createTurnStartEvent('game-1', 'player-1', 1);
      await eventBus.emit(event);

      expect(executionOrder).toEqual([10, 5, 1]);
    });

    it('should unregister listeners correctly', async () => {
      const mockCallback = jest.fn().mockResolvedValue(undefined);
      const listener: EventListener = {
        id: 'test-listener',
        priority: 0,
        callback: mockCallback
      };

      eventBus.on(EventType.CARD_PLAYED, listener);
      eventBus.off(EventType.CARD_PLAYED, 'test-listener');

      const event = GameEventFactory.createCardPlayedEvent('game-1', 'player-1', 'card-1');
      await eventBus.emit(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should continue executing other listeners if one fails', async () => {
      const workingCallback = jest.fn().mockResolvedValue(undefined);
      const failingCallback = jest.fn().mockRejectedValue(new Error('Test error'));

      const workingListener: EventListener = {
        id: 'working',
        priority: 0,
        callback: workingCallback
      };

      const failingListener: EventListener = {
        id: 'failing',
        priority: 1,
        callback: failingCallback
      };

      eventBus.on(EventType.COMBAT_START, failingListener);
      eventBus.on(EventType.COMBAT_START, workingListener);

      const event = GameEventFactory.createCombatStartEvent('game-1', 'battlefield-1', 'player-1', 'player-2');
      await eventBus.emit(event);

      expect(failingCallback).toHaveBeenCalled();
      expect(workingCallback).toHaveBeenCalled();
    });
  });

  describe('Event History', () => {
    it('should store events in history', async () => {
      const event1 = GameEventFactory.createGameStartEvent('game-1', ['player-1', 'player-2']);
      const event2 = GameEventFactory.createTurnStartEvent('game-1', 'player-1', 1);

      await eventBus.emit(event1);
      await eventBus.emit(event2);

      const history = eventBus.getEventHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual(event1);
      expect(history[1]).toEqual(event2);
    });

    it('should filter history by game ID', async () => {
      const game1Event = GameEventFactory.createGameStartEvent('game-1', ['player-1', 'player-2']);
      const game2Event = GameEventFactory.createGameStartEvent('game-2', ['player-3', 'player-4']);

      await eventBus.emit(game1Event);
      await eventBus.emit(game2Event);

      const game1History = eventBus.getEventHistory('game-1');
      expect(game1History).toHaveLength(1);
      expect(game1History[0]).toEqual(game1Event);
    });

    it('should limit history size', async () => {
      // Create a new EventBus with smaller history limit for testing
      const limitedEventBus = new EventBus();
      (limitedEventBus as any).maxHistorySize = 2;

      const event1 = GameEventFactory.createTurnStartEvent('game-1', 'player-1', 1);
      const event2 = GameEventFactory.createTurnStartEvent('game-1', 'player-1', 2);
      const event3 = GameEventFactory.createTurnStartEvent('game-1', 'player-1', 3);

      await limitedEventBus.emit(event1);
      await limitedEventBus.emit(event2);
      await limitedEventBus.emit(event3);

      const history = limitedEventBus.getEventHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual(event2);
      expect(history[1]).toEqual(event3);
    });
  });

  describe('Statistics', () => {
    it('should provide accurate statistics', () => {
      const listener1: EventListener = { id: '1', priority: 0, callback: async () => {} };
      const listener2: EventListener = { id: '2', priority: 0, callback: async () => {} };
      const listener3: EventListener = { id: '3', priority: 0, callback: async () => {} };

      eventBus.on(EventType.GAME_START, listener1);
      eventBus.on(EventType.GAME_START, listener2);
      eventBus.on(EventType.TURN_START, listener3);

      const stats = eventBus.getStats();
      expect(stats.totalListeners).toBe(3);
      expect(stats.listenersByType[EventType.GAME_START]).toBe(2);
      expect(stats.listenersByType[EventType.TURN_START]).toBe(1);
      expect(stats.historySize).toBe(0);
    });
  });

  describe('Utility Methods', () => {
    it('should clear listeners by type', () => {
      const listener: EventListener = { id: 'test', priority: 0, callback: async () => {} };

      eventBus.on(EventType.GAME_START, listener);
      eventBus.on(EventType.TURN_START, listener);

      eventBus.clearListeners(EventType.GAME_START);

      expect(eventBus.getListeners(EventType.GAME_START)).toHaveLength(0);
      expect(eventBus.getListeners(EventType.TURN_START)).toHaveLength(1);
    });

    it('should clear all listeners', () => {
      const listener: EventListener = { id: 'test', priority: 0, callback: async () => {} };

      eventBus.on(EventType.GAME_START, listener);
      eventBus.on(EventType.TURN_START, listener);

      eventBus.clearAllListeners();

      const stats = eventBus.getStats();
      expect(stats.totalListeners).toBe(0);
    });
  });
});