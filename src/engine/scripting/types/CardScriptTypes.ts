/**
 * Card Scripting System - Type Definitions
 *
 * This module defines all interfaces and types for the card scripting system,
 * inspired by Legends of Runeterra's approach (Riot Games).
 *
 * Cards are implemented as TypeScript scripts that define behavior through
 * declarative hooks and handlers, executed in a sandboxed environment.
 */

import type { Card, Effect, Ability, Player, Game, GameCard } from '../../../types/game';
import type { BaseEntity } from '../../../types/common';

// ============================================================================
// Core Script Interface
// ============================================================================

/**
 * Main interface that all card scripts must implement.
 * Each card file exports an object conforming to this interface.
 */
export interface CardScript {
  /** Unique card identifier (e.g., "CARD_001") */
  id: string;

  /** Card name */
  name: string;

  /** Card type */
  type: 'unit' | 'spell' | 'artifact' | 'ritual';

  /** Mana cost */
  cost: number;

  /** Card rarity */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  /** Optional: Unit stats (for unit cards) */
  stats?: {
    attack: number;
    health: number;
  };

  /** Optional: Card description/flavor text */
  description?: string;

  /** Optional: Keywords (e.g., ["flying", "rush", "taunt"]) */
  keywords?: string[];

  /** Optional: Tags for categorization (e.g., ["dragon", "spell-damage"]) */
  tags?: string[];

  // Lifecycle Hooks
  /** Called when card is played/summoned */
  onPlay?: PlayHandler;

  /** Called when unit dies (units only) */
  onDeath?: DeathHandler;

  /** Called at start of turn (persistent effects) */
  onTurnStart?: TurnHandler;

  /** Called at end of turn (persistent effects) */
  onTurnEnd?: TurnHandler;

  /** Called when unit attacks (units only) */
  onAttack?: AttackHandler;

  /** Called when unit is attacked (units only) */
  onDefend?: DefendHandler;

  /** Called when unit deals damage */
  onDamage?: DamageHandler;

  /** Called when unit takes damage */
  onDamaged?: DamageHandler;

  // Trigger System
  /** Custom event triggers */
  triggers?: TriggerDefinition[];

  // Effect System
  /** Passive abilities (always active) */
  passiveEffects?: PassiveEffect[];

  /** Activated abilities (player-triggered) */
  activatedAbilities?: ActivatedAbility[];

  // Validation
  /** Custom play validation (beyond standard rules) */
  canPlay?: CanPlayHandler;

  /** Custom target validation */
  canTarget?: CanTargetHandler;
}

// ============================================================================
// Handler Types
// ============================================================================

/** Handler for onPlay hook */
export type PlayHandler = (context: CardContext) => void | Promise<void>;

/** Handler for onDeath hook */
export type DeathHandler = (context: CardContext) => void | Promise<void>;

/** Handler for turn start/end hooks */
export type TurnHandler = (context: CardContext) => void | Promise<void>;

/** Handler for attack events */
export type AttackHandler = (context: CardContext, defender: GameCard) => void | Promise<void>;

/** Handler for defend events */
export type DefendHandler = (context: CardContext, attacker: GameCard) => void | Promise<void>;

/** Handler for damage events */
export type DamageHandler = (
  context: CardContext,
  amount: number,
  target: GameCard
) => void | Promise<void>;

/** Handler for play validation */
export type CanPlayHandler = (context: CardContext) => boolean;

/** Handler for target validation */
export type CanTargetHandler = (context: CardContext, target: GameCard) => boolean;

// ============================================================================
// Context Interface
// ============================================================================

/**
 * Context object passed to all card script handlers.
 * Provides safe access to game state and action APIs.
 */
export interface CardContext {
  /** The card being scripted */
  self: Card;

  /** Owner of the card */
  owner: Player;

  /** Current game state (read-only) */
  game: SafeGameState;

  /** API for battlefield interactions */
  battlefield: BattlefieldAPI;

  /** API for effect chain manipulation */
  chain: ChainAPI;

  /** API for random number generation */
  random: RandomAPI;

  /** API for logging and debugging */
  log: LogAPI;

  /** Targets selected for this action (if any) */
  targets?: GameCard[];

  /** Additional event-specific data */
  eventData?: Record<string, any>;
}

// ============================================================================
// Safe Game State (Read-Only)
// ============================================================================

/**
 * Read-only view of game state for scripts.
 * Prevents direct mutations, all changes go through APIs.
 */
export interface SafeGameState {
  readonly turn: number;
  readonly phase: string;
  readonly activePlayer: string; // player ID
  readonly players: ReadonlyArray<SafePlayer>;
  readonly battlefield: ReadonlyArray<SafeEntity>;
}

export interface SafePlayer {
  readonly id: string;
  readonly name: string;
  readonly health: number;
  readonly maxHealth: number;
  readonly mana: number;
  readonly maxMana: number;
  readonly deckSize: number;
  readonly handSize: number;
  readonly graveyardSize: number;
}

export interface SafeEntity {
  readonly id: string;
  readonly cardId: string;
  readonly name: string;
  readonly type: string;
  readonly owner: string;
  readonly attack: number;
  readonly health: number;
  readonly maxHealth: number;
  readonly position: { row: number; col: number };
  readonly status: ReadonlyArray<string>;
  readonly keywords: ReadonlyArray<string>;
  readonly canMove: boolean;
  readonly canAttack: boolean;
  readonly hasAttacked: boolean;
}

// ============================================================================
// Battlefield API
// ============================================================================

/**
 * API for interacting with the battlefield.
 * All actions are queued and executed through the game engine.
 */
export interface BattlefieldAPI {
  /** Get entity by ID */
  getEntity(entityId: string): SafeEntity | undefined;

  /** Get all entities matching filter */
  getEntities(filter?: EntityFilter): SafeEntity[];

  /** Get entities in specific area */
  getEntitiesInArea(area: Area): SafeEntity[];

  /** Deal damage to target */
  dealDamage(target: string | GameCard, amount: number, source?: string): void;

  /** Heal target */
  heal(target: string | GameCard, amount: number): void;

  /** Destroy entity */
  destroy(target: string | GameCard): void;

  /** Move entity to position */
  move(entity: string | GameCard, position: Position): void;

  /** Add status effect to entity */
  addStatus(target: string | GameCard, status: string, duration?: number): void;

  /** Remove status effect from entity */
  removeStatus(target: string | GameCard, status: string): void;

  /** Modify entity stats */
  modifyStats(target: string | GameCard, stats: StatModification): void;

  /** Summon new entity */
  summon(cardId: string, position: Position, owner: string): void;

  /** Transform entity into another card */
  transform(entity: string | GameCard, newCardId: string): void;
}

// ============================================================================
// Chain API
// ============================================================================

/**
 * API for manipulating the effect chain.
 * Allows scripts to add effects, counter actions, etc.
 */
export interface ChainAPI {
  /** Add effect to chain */
  addEffect(effect: Effect): void;

  /** Counter/cancel last effect in chain */
  counter(): void;

  /** Get current chain length */
  getChainLength(): number;

  /** Check if chain is empty */
  isEmpty(): boolean;
}

// ============================================================================
// Random API
// ============================================================================

/**
 * API for deterministic random number generation.
 * Uses seeded RNG for replay consistency.
 */
export interface RandomAPI {
  /** Random integer in range [min, max) */
  int(min: number, max: number): number;

  /** Random float in range [0, 1) */
  float(): number;

  /** Pick random element from array */
  pick<T>(array: T[]): T;

  /** Shuffle array (returns new array) */
  shuffle<T>(array: T[]): T[];

  /** Random boolean with given probability (0-1) */
  chance(probability: number): boolean;
}

// ============================================================================
// Log API
// ============================================================================

/**
 * API for logging and debugging.
 */
export interface LogAPI {
  /** Log info message */
  info(message: string, data?: any): void;

  /** Log warning message */
  warn(message: string, data?: any): void;

  /** Log error message */
  error(message: string, data?: any): void;

  /** Log debug message (only in dev mode) */
  debug(message: string, data?: any): void;
}

// ============================================================================
// Trigger System
// ============================================================================

/**
 * Defines a custom event trigger for the card.
 */
export interface TriggerDefinition {
  /** Event to listen for */
  event: TriggerEvent;

  /** Optional condition to check before executing */
  condition?: (context: CardContext) => boolean;

  /** Handler to execute when triggered */
  handler: (context: CardContext) => void | Promise<void>;

  /** Optional: trigger only once */
  once?: boolean;
}

export type TriggerEvent =
  | 'UNIT_SUMMONED'
  | 'UNIT_DIED'
  | 'SPELL_CAST'
  | 'DAMAGE_DEALT'
  | 'DAMAGE_TAKEN'
  | 'TURN_START'
  | 'TURN_END'
  | 'PHASE_CHANGE'
  | 'CARD_DRAWN'
  | 'CARD_DISCARDED'
  | 'ATTACK_DECLARED'
  | 'ENTITY_MOVED'
  | string; // Allow custom events

// ============================================================================
// Effect System
// ============================================================================

/**
 * Passive effect definition (always active while card is in play).
 */
export interface PassiveEffect {
  /** Effect description */
  description: string;

  /** Affected targets */
  targets: EntityFilter;

  /** Stat modifications */
  statMods?: StatModification;

  /** Keywords to add */
  addKeywords?: string[];

  /** Custom effect handler */
  apply?: (context: CardContext, target: GameCard) => void;

  /** Optional condition for effect to be active */
  condition?: (context: CardContext) => boolean;
}

/**
 * Activated ability definition (player must activate manually).
 */
export interface ActivatedAbility {
  /** Ability name */
  name: string;

  /** Ability description */
  description: string;

  /** Mana cost (optional) */
  cost?: number;

  /** Cooldown in turns (optional) */
  cooldown?: number;

  /** Target requirements */
  targetRequirement?: TargetRequirement;

  /** Can use check */
  canUse?: (context: CardContext) => boolean;

  /** Effect handler */
  effect: (context: CardContext) => void | Promise<void>;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface EntityFilter {
  type?: 'unit' | 'spell' | 'artifact' | 'ritual';
  owner?: 'self' | 'opponent' | 'any';
  keywords?: string[];
  tags?: string[];
  minAttack?: number;
  maxAttack?: number;
  minHealth?: number;
  maxHealth?: number;
  status?: string[];
  custom?: (entity: SafeEntity) => boolean;
}

export interface Area {
  type: 'circle' | 'rectangle' | 'line' | 'cross';
  center: Position;
  radius?: number; // for circle
  width?: number; // for rectangle
  height?: number; // for rectangle
  direction?: 'north' | 'south' | 'east' | 'west'; // for line
}

export interface Position {
  row: number;
  col: number;
}

export interface StatModification {
  attack?: number;
  health?: number;
  maxHealth?: number;
}

export interface TargetRequirement {
  count: number;
  filter: EntityFilter;
  optional?: boolean;
}

// ============================================================================
// Script Loader Types
// ============================================================================

/**
 * Result of loading and compiling a card script.
 */
export interface LoadedScript {
  script: CardScript;
  compiledCode: string;
  filePath: string;
  lastModified: number;
}

/**
 * Error during script loading/compilation.
 */
export interface ScriptError {
  cardId: string;
  filePath: string;
  error: Error;
  timestamp: number;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  Card,
  GameCard,
  Game,
  Effect,
  Ability,
  Player,
  BaseEntity,
};
