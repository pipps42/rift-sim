import { EventType, GameEvent } from '@/types/game';
import { logger } from '@/utils/logger';

/**
 * Event listener interface with priority support
 */
export interface EventListener {
  id: string;
  priority: number; // Higher numbers = higher priority
  callback: (event: GameEvent) => Promise<void>;
}

/**
 * Central event bus for Riftbound game engine
 * Implements observer pattern with priority-based listener execution
 */
export class EventBus {
  private listeners: Map<EventType, EventListener[]> = new Map();
  private eventHistory: GameEvent[] = [];
  private maxHistorySize: number = 1000;

  /**
   * Register an event listener
   */
  on(eventType: EventType, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    const listeners = this.listeners.get(eventType)!;
    listeners.push(listener);

    // Sort by priority (highest first)
    listeners.sort((a, b) => b.priority - a.priority);

    logger.debug(`EventBus: Registered listener ${listener.id} for ${eventType} with priority ${listener.priority}`);
  }

  /**
   * Unregister an event listener
   */
  off(eventType: EventType, listenerId: string): void {
    const listeners = this.listeners.get(eventType);
    if (!listeners) return;

    const index = listeners.findIndex(l => l.id === listenerId);
    if (index !== -1) {
      listeners.splice(index, 1);
      logger.debug(`EventBus: Unregistered listener ${listenerId} for ${eventType}`);
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  async emit(event: GameEvent): Promise<void> {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    logger.debug(`EventBus: Emitting event ${event.type} for game ${event.gameId}`);

    const listeners = this.listeners.get(event.type);
    if (!listeners || listeners.length === 0) {
      logger.debug(`EventBus: No listeners for event type ${event.type}`);
      return;
    }

    // Execute listeners in priority order
    for (const listener of listeners) {
      try {
        await listener.callback(event);
      } catch (error) {
        logger.error(`EventBus: Error in listener ${listener.id} for event ${event.type}:`, error);
        // Continue with other listeners even if one fails
      }
    }
  }

  /**
   * Get all listeners for a specific event type
   */
  getListeners(eventType: EventType): EventListener[] {
    return this.listeners.get(eventType) || [];
  }

  /**
   * Clear all listeners for a specific event type
   */
  clearListeners(eventType: EventType): void {
    this.listeners.delete(eventType);
    logger.debug(`EventBus: Cleared all listeners for ${eventType}`);
  }

  /**
   * Clear all listeners
   */
  clearAllListeners(): void {
    this.listeners.clear();
    logger.debug('EventBus: Cleared all listeners');
  }

  /**
   * Get event history
   */
  getEventHistory(gameId?: string): GameEvent[] {
    if (gameId) {
      return this.eventHistory.filter(event => event.gameId === gameId);
    }
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearEventHistory(): void {
    this.eventHistory = [];
    logger.debug('EventBus: Cleared event history');
  }

  /**
   * Get statistics about the event bus
   */
  getStats(): {
    totalListeners: number;
    listenersByType: Record<EventType, number>;
    historySize: number;
  } {
    const listenersByType: Record<EventType, number> = {} as Record<EventType, number>;
    let totalListeners = 0;

    for (const [eventType, listeners] of this.listeners) {
      listenersByType[eventType] = listeners.length;
      totalListeners += listeners.length;
    }

    return {
      totalListeners,
      listenersByType,
      historySize: this.eventHistory.length
    };
  }
}

// Global event bus instance
export const eventBus = new EventBus();