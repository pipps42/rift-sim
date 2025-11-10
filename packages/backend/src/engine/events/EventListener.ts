import { EventListener } from './EventBus';
import { GameEvent, EventType } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for creating event listeners
 */
export abstract class BaseEventListener implements EventListener {
  public readonly id: string;
  public readonly priority: number;

  constructor(priority: number = 0) {
    this.id = uuidv4();
    this.priority = priority;
  }

  abstract callback(event: GameEvent): Promise<void>;
}

/**
 * Event listener builder for creating typed listeners
 */
export class EventListenerBuilder {
  private _id?: string;
  private _priority: number = 0;
  private _callback?: (event: GameEvent) => Promise<void>;

  /**
   * Set listener ID
   */
  id(id: string): EventListenerBuilder {
    this._id = id;
    return this;
  }

  /**
   * Set listener priority
   */
  priority(priority: number): EventListenerBuilder {
    this._priority = priority;
    return this;
  }

  /**
   * Set callback function
   */
  callback(callback: (event: GameEvent) => Promise<void>): EventListenerBuilder {
    this._callback = callback;
    return this;
  }

  /**
   * Build the event listener
   */
  build(): EventListener {
    if (!this._callback) {
      throw new Error('EventListener callback is required');
    }

    return {
      id: this._id || uuidv4(),
      priority: this._priority,
      callback: this._callback
    };
  }
}

/**
 * Common event listener priorities for Riftbound engine
 */
export enum EventListenerPriority {
  HIGHEST = 1000,
  HIGH = 500,
  NORMAL = 0,
  LOW = -500,
  LOWEST = -1000,

  // Specific priorities for game systems
  RULE_VALIDATION = 900,
  STATE_MANAGEMENT = 800,
  GAME_LOGIC = 700,
  COMBAT_SYSTEM = 600,
  SCORING_SYSTEM = 500,
  EFFECT_SYSTEM = 400,
  CHAIN_SYSTEM = 300,
  UI_UPDATES = 100,
  LOGGING = -100,
  ANALYTICS = -200
}

/**
 * Utility class for creating common game event listeners
 */
export class GameEventListeners {

  /**
   * Create a logging listener for all events
   */
  static createLoggingListener(): EventListener {
    return new EventListenerBuilder()
      .id('system-logger')
      .priority(EventListenerPriority.LOGGING)
      .callback(async (event: GameEvent) => {
        console.log(`[EVENT] ${event.type} - Game: ${event.gameId}, Player: ${event.playerId || 'N/A'}`);
      })
      .build();
  }

  /**
   * Create a listener that filters events by game ID
   */
  static createGameFilteredListener(
    gameId: string,
    callback: (event: GameEvent) => Promise<void>,
    priority: number = EventListenerPriority.NORMAL
  ): EventListener {
    return new EventListenerBuilder()
      .priority(priority)
      .callback(async (event: GameEvent) => {
        if (event.gameId === gameId) {
          await callback(event);
        }
      })
      .build();
  }

  /**
   * Create a listener that filters events by player ID
   */
  static createPlayerFilteredListener(
    playerId: string,
    callback: (event: GameEvent) => Promise<void>,
    priority: number = EventListenerPriority.NORMAL
  ): EventListener {
    return new EventListenerBuilder()
      .priority(priority)
      .callback(async (event: GameEvent) => {
        if (event.playerId === playerId) {
          await callback(event);
        }
      })
      .build();
  }

  /**
   * Create a listener that only fires once
   */
  static createOneTimeListener(
    callback: (event: GameEvent) => Promise<void>,
    priority: number = EventListenerPriority.NORMAL
  ): EventListener {
    let fired = false;

    return new EventListenerBuilder()
      .priority(priority)
      .callback(async (event: GameEvent) => {
        if (!fired) {
          fired = true;
          await callback(event);
        }
      })
      .build();
  }

  /**
   * Create a conditional listener
   */
  static createConditionalListener(
    condition: (event: GameEvent) => boolean,
    callback: (event: GameEvent) => Promise<void>,
    priority: number = EventListenerPriority.NORMAL
  ): EventListener {
    return new EventListenerBuilder()
      .priority(priority)
      .callback(async (event: GameEvent) => {
        if (condition(event)) {
          await callback(event);
        }
      })
      .build();
  }

  /**
   * Create a debounced listener (only fires once per time period)
   */
  static createDebouncedListener(
    callback: (event: GameEvent) => Promise<void>,
    debounceMs: number = 100,
    priority: number = EventListenerPriority.NORMAL
  ): EventListener {
    let timeout: NodeJS.Timeout | null = null;
    let lastEvent: GameEvent | null = null;

    return new EventListenerBuilder()
      .priority(priority)
      .callback(async (event: GameEvent) => {
        lastEvent = event;

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(async () => {
          if (lastEvent) {
            await callback(lastEvent);
            lastEvent = null;
          }
        }, debounceMs);
      })
      .build();
  }
}