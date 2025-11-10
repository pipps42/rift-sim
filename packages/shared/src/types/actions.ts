/**
 * GameAction System - Type Definitions (V3)
 *
 * Complete type system for the declarative action-based game engine.
 * Based on Legends of Runeterra's GameAction architecture.
 *
 * @module types/actions
 */

import type { Game, GameCard, Player, GameEvent } from './game';

// ============================================================================
// GAME ACTION TYPE ENUM
// ============================================================================

/**
 * All possible action types in the game.
 * Used for matching with modifiers and triggers.
 */
export enum GameActionType {
  // ===== CARD ACTIONS =====
  PLAY_CARD = 'play_card',
  DRAW_CARD = 'draw_card',
  DISCARD_CARD = 'discard_card',
  MILL_CARD = 'mill_card',
  SHUFFLE_CARD = 'shuffle_card',
  RECYCLE_CARD = 'recycle_card',
  KILL_CARD = 'kill_card',
  HIDE_CARD = 'hide_card',
  EXHAUST_CARD = 'exhaust_card',
  READY_CARD = 'ready_card',

  // ===== ZONE ACTIONS =====
  MOVE_CARD = 'move_card',
  SHUFFLE_DECK = 'shuffle_deck',
  REVEAL_CARD = 'reveal_card',
  BANISH_CARD = 'banish_card',

  // ===== COMBAT ACTIONS =====
  DECLARE_ATTACK = 'declare_attack',
  DECLARE_BLOCK = 'declare_block',
  RESOLVE_COMBAT = 'resolve_combat',
  DEAL_COMBAT_DAMAGE = 'deal_combat_damage',

  // ===== DAMAGE & HEALING =====
  DEAL_DAMAGE = 'deal_damage',
  HEAL_DAMAGE = 'heal_damage',
  PREVENT_DAMAGE = 'prevent_damage',

  // ===== STATUS EFFECTS =====
  APPLY_BUFF = 'apply_buff',
  APPLY_DEBUFF = 'apply_debuff',
  REMOVE_EFFECT = 'remove_effect',
  STUN_UNIT = 'stun_unit',
  SILENCE_UNIT = 'silence_unit',
  FREEZE_UNIT = 'freeze_unit',

  // ===== KEYWORD ACTIONS =====
  GRANT_KEYWORD = 'grant_keyword',
  REMOVE_KEYWORD = 'remove_keyword',

  // ===== RESOURCE ACTIONS =====
  ADD_ENERGY = 'add_energy',
  SPEND_ENERGY = 'spend_energy',
  ADD_POWER = 'add_power',
  SPEND_POWER = 'spend_power',
  TAP_RUNE = 'tap_rune',
  RECYCLE_RUNE = 'recycle_rune',
  UNTAP_RUNE = 'untap_rune',
  CHANNEL_RUNE = 'channel_rune',

  // ===== SPECIAL ACTIONS =====
  CREATE_TOKEN = 'create_token',
  TRANSFORM_CARD = 'transform_card',
  COPY_CARD = 'copy_card',
  DESTROY_CARD = 'destroy_card',

  // ===== SPELL ACTIONS =====
  CAST_SPELL = 'cast_spell',
  COUNTER_SPELL = 'counter_spell',
  RESOLVE_SPELL = 'resolve_spell',

  // ===== TURN ACTIONS =====
  START_TURN = 'start_turn',
  END_TURN = 'end_turn',
  START_PHASE = 'start_phase',
  END_PHASE = 'end_phase',
  PASS_PRIORITY = 'pass_priority',
  PASS_FOCUS = 'pass_focus',

  // ===== SHOWDOWN ACTIONS (Riftbound) =====
  ENTER_SHOWDOWN = 'enter_showdown',
  EXIT_SHOWDOWN = 'exit_showdown',
  START_COMBAT = 'start_combat',

  // ===== BATTLEFIELD ACTIONS (Riftbound) =====
  MOVE_UNIT = 'move_unit',
  CONQUER_BATTLEFIELD = 'conquer_battlefield',
  GAIN_CONTROL = 'gain_control',
  LOSE_CONTROL = 'lose_control',

  // ===== SCORING ACTIONS (Riftbound) =====
  SCORE_HOLD = 'score_hold',
  SCORE_CONQUER = 'score_conquer',
  GAIN_POINT = 'gain_point',

  // ===== CLEANUP ACTIONS (Riftbound) =====
  PERFORM_CLEANUP = 'perform_cleanup',
  CHECK_DEATHS = 'check_deaths',

  // ===== DEATH ACTIONS =====
  UNIT_DIES = 'unit_dies',
  PROCESS_DEATHS = 'process_deaths',

  // ===== TRIGGER ACTIONS =====
  ACTIVATE_ABILITY = 'activate_ability',
  TRIGGER_EFFECT = 'trigger_effect',

  // ===== META ACTIONS =====
  NULL_ACTION = 'null_action', // Action that does nothing (for replacement effects)
  BATCH_ACTION = 'batch_action', // Execute multiple actions atomically
}

// ============================================================================
// CARD TIMING SYSTEM (Riftbound)
// ============================================================================

/**
 * Card timing determines when a card can be played based on turn state.
 * Based on Riftbound's timing keywords.
 */
export enum CardTiming {
  /**
   * Default: Can only be played during Neutral Open state in your own turn.
   * This is the timing for most cards.
   */
  DEFAULT = 'default',

  /**
   * Action: Can be played during Neutral Open AND during Showdowns.
   * Allows response during Showdown phases.
   */
  ACTION = 'action',

  /**
   * Reaction: Can be played at any time, even during Closed State.
   * Most flexible timing, for instant responses and counter spells.
   */
  REACTION = 'reaction',
}

/**
 * Turn state combinations (Riftbound).
 * Game is always in one of these 4 states.
 */
export enum TurnState {
  /** Default state, cards with Default timing can be played */
  NEUTRAL_OPEN = 'neutral_open',

  /** Chain is active, only Reaction cards can be played */
  NEUTRAL_CLOSED = 'neutral_closed',

  /** Showdown without chain, Action and Reaction cards can be played */
  SHOWDOWN_OPEN = 'showdown_open',

  /** Showdown with chain, only Reaction cards can be played */
  SHOWDOWN_CLOSED = 'showdown_closed',
}

// ============================================================================
// PRIORITY SYSTEM
// ============================================================================

/**
 * Priority levels for modifiers.
 * Lower numbers execute first.
 */
export enum ModifierPriority {
  /** Replacement effects (completely prevent an action) */
  REPLACEMENT = -100,

  /** Cost reduction/increase */
  COST_MODIFICATION = -50,

  /** Damage/heal prevention (Barrier, Shield) */
  PREVENTION = -25,

  /** Damage/healing amount modification */
  DAMAGE_MODIFICATION = 0,

  /** Stat buffs/debuffs (Attack/Health) */
  STAT_MODIFICATION = 25,

  /** Keyword grants/removals */
  KEYWORD_MODIFICATION = 50,

  /** Post-effects (after everything else) */
  POST_EFFECT = 100,
}

/**
 * Priority levels for triggers.
 * Lower numbers execute first.
 */
export enum TriggerPriority {
  /** Critical triggers that must execute before everything */
  VERY_HIGH = -100,

  /** High priority triggers */
  HIGH = -50,

  /** Normal priority (default) */
  NORMAL = 0,

  /** Low priority triggers */
  LOW = 50,

  /** Cleanup triggers (execute last) */
  CLEANUP = 100,
}

/**
 * Timing layers for modifier resolution.
 * Modifiers are sorted by layer first, then by priority within layer.
 */
export enum TimingLayer {
  REPLACEMENT = 0,
  COST_MODIFICATION = 1,
  PREVENTION = 2,
  DAMAGE_MODIFICATION = 3,
  STAT_MODIFICATION = 4,
  KEYWORD_MODIFICATION = 5,
  POST_EFFECT = 6,
}

// ============================================================================
// ACTION VALIDATION & EXECUTION RESULTS
// ============================================================================

/**
 * Result of action validation.
 */
export interface ActionValidationResult {
  /** Whether the action is valid */
  valid: boolean;

  /** Human-readable reason if invalid */
  reason?: string;

  /** Additional context data */
  context?: Record<string, any>;
}

/**
 * Result of action execution.
 */
export interface ActionExecutionResult {
  /** Whether the action executed successfully */
  success: boolean;

  /** Error if execution failed */
  error?: Error;

  /** Actions generated as side effects */
  sideEffects?: GameAction[];

  /** Additional result data */
  data?: Record<string, any>;
}

// ============================================================================
// BASE GAME ACTION
// ============================================================================

/**
 * Base interface for all game actions.
 * Actions are DECLARATIVE - they describe intent, not implementation.
 *
 * All actions must be:
 * - Immutable during modification (create new instance if modified)
 * - Serializable (for replay/network)
 * - Validatable (before execution)
 */
export interface GameAction<TData = any> {
  /** Unique ID for this action instance */
  readonly id: string;

  /** Type of action (for modifier/trigger matching) */
  readonly type: GameActionType;

  /** Player who initiated this action */
  readonly controller: Player;

  /** Card that is the source of this action (if any) */
  readonly source?: GameCard;

  /** When this action was created */
  readonly timestamp: Date;

  /** Action-specific data (can be modified by pipeline) */
  data: TData;

  /** Metadata for debugging/replay */
  metadata: ActionMetadata;

  /**
   * Validate if this action can be executed.
   * Called BEFORE modifiers are applied.
   */
  validate(game: Game): ActionValidationResult;

  /**
   * Execute the action, mutating game state.
   * Called AFTER modifiers have been applied.
   * This is the ONLY place where game state should be mutated.
   */
  execute(game: Game): ActionExecutionResult;

  /**
   * Convert action to history entry for logging.
   * Called automatically after successful execution.
   */
  toHistoryEntry(): GameEvent;

  /**
   * Create a deep clone of this action.
   * Used by modifiers to create modified versions.
   */
  clone(): GameAction<TData>;
}

/**
 * Metadata attached to every action.
 */
export interface ActionMetadata {
  /** Script that originated this action (if from card script) */
  originScript?: string;

  /** Stack depth when this action was created */
  stackDepth: number;

  /** Whether this action was generated by a trigger */
  isTriggered: boolean;

  /** Whether this action was generated by a modifier */
  isModifierGenerated: boolean;

  /** Parent action that triggered this one (if any) */
  parentActionId?: string;

  /** Additional debug info */
  debugInfo?: Record<string, any>;
}

// ============================================================================
// ACTION MODIFIER
// ============================================================================

/**
 * Modifiers alter actions before they execute.
 * Examples: Spell Damage +1, Cost Reduction, Barrier (prevention)
 */
export interface ActionModifier {
  /** Unique ID for this modifier */
  readonly id: string;

  /** Type identifier for this modifier */
  readonly type: string;

  /** Priority within timing layer */
  readonly priority: number;

  /** Timing layer for this modifier */
  readonly timingLayer: TimingLayer;

  /** Card that created this modifier (if any) */
  readonly sourceCard?: GameCard;

  /** When this modifier expires (if time-based) */
  expiresAt?: Date;

  /** Number of uses before expiring (if use-based) */
  expiresAfterUses?: number;

  /** Current use count */
  currentUses: number;

  /** When this modifier was created */
  readonly createdAt: Date;

  /**
   * Modify an action before it executes.
   *
   * @param action - The action to modify
   * @param game - Current game state
   * @returns Modified action, or null to completely prevent the action
   */
  modify(action: GameAction, game: Game): Promise<GameAction | null>;

  /**
   * Check if this modifier is currently active.
   * Inactive modifiers are not applied to actions.
   */
  isActive(game: Game): boolean;

  /**
   * Check if this modifier has expired.
   */
  isExpired(): boolean;

  /**
   * Mark this modifier as used (increments use count).
   */
  markUsed(): void;
}

// ============================================================================
// ACTION TRIGGER
// ============================================================================

/**
 * Triggers react to actions after they execute.
 * Examples: Yasuo (when stun, deal damage), Deathrattle, Attack triggers
 */
export interface ActionTrigger {
  /** Unique ID for this trigger */
  readonly id: string;

  /** Type identifier for this trigger */
  readonly type: string;

  /** Priority for trigger resolution order */
  readonly priority: TriggerPriority;

  /** Card that created this trigger (if any) */
  readonly sourceCard?: GameCard;

  /** Whether this trigger consumes itself after one use */
  readonly isOneShot: boolean;

  /** When this trigger expires (if time-based) */
  expiresAt?: Date;

  /** When this trigger was created */
  readonly createdAt: Date;

  /**
   * React to an action and optionally create new actions.
   *
   * @param action - The action that just executed
   * @param game - Current game state
   * @returns Array of actions to execute as a result (empty if none)
   */
  onAction(action: GameAction, game: Game): Promise<GameAction[]>;

  /**
   * Check if this trigger is currently active.
   * Inactive triggers do not fire.
   */
  isActive(game: Game): boolean;

  /**
   * Check if this trigger has expired.
   */
  isExpired(): boolean;

  /**
   * Mark this trigger as fired (increments fire count).
   */
  markFired(): void;
}

// ============================================================================
// AURA MODIFIER (Special type of modifier)
// ============================================================================

/**
 * Auras are continuous effects that apply to multiple targets.
 * Examples: "Your units have +1/+1", "Enemy spells cost 1 more"
 */
export interface AuraModifier extends ActionModifier {
  /**
   * Get all targets currently affected by this aura.
   */
  getAffectedTargets(game: Game): GameCard[];

  /**
   * Apply aura effect to a target.
   * Called when target enters aura range.
   */
  applyAuraEffect(target: GameCard, game: Game): void;

  /**
   * Remove aura effect from a target.
   * Called when target leaves aura range.
   */
  removeAuraEffect(target: GameCard, game: Game): void;

  /**
   * Update aura (called when board state changes).
   * Handles adding/removing targets.
   */
  update(game: Game): void;
}

// ============================================================================
// ACTION STACK
// ============================================================================

/**
 * Entry on the action stack.
 */
export interface ChainEntry {
  /** The action on the chain */
  action: GameAction;

  /** Timing of this action */
  timing: CardTiming;

  /** When this was added to chain */
  timestamp: number;

  /** Player who added this to chain */
  controller: Player;
}

// ============================================================================
// COMMON ACTION DATA TYPES
// ============================================================================

/**
 * Data for damage actions.
 */
export interface DamageActionData {
  /** Source of the damage (if any) */
  source?: GameCard;

  /** Target receiving damage */
  target: GameCard;

  /** Amount of damage */
  amount: number;

  /** Type of damage */
  damageType: 'combat' | 'spell' | 'effect' | 'burn';

  /** Whether this damage can be prevented */
  preventable?: boolean;
}

/**
 * Data for heal actions.
 */
export interface HealActionData {
  /** Source of the healing (if any) */
  source?: GameCard;

  /** Target receiving healing */
  target: GameCard;

  /** Amount of healing */
  amount: number;
}

/**
 * Data for card movement actions.
 */
export interface MoveCardActionData {
  /** Card being moved */
  card: GameCard;

  /** Source zone */
  fromZone: string;

  /** Destination zone */
  toZone: string;

  /** Position in destination zone (optional) */
  position?: number;

  /** Whether to reveal the card */
  reveal?: boolean;
}

/**
 * Data for draw card actions.
 */
export interface DrawCardActionData {
  /** Player drawing cards */
  player: Player;

  /** Number of cards to draw */
  amount: number;

  /** Whether to reveal drawn cards */
  reveal?: boolean;
}

/**
 * Data for play card actions.
 */
export interface PlayCardActionData {
  /** Card being played */
  card: GameCard;

  /** Targets selected for the card (if any) */
  targets?: GameCard[];

  /** Energy cost to pay */
  energyCost: number;

  /** Power costs to pay */
  powerCosts: Array<{ domain: string; amount: number }>;

  /** Whether to pay alternative cost */
  alternativeCost?: boolean;
}

/**
 * Data for combat actions.
 */
export interface CombatActionData {
  /** Units attacking */
  attackers: GameCard[];

  /** Map of attacker ID to blocker (if any) */
  blockers: Map<string, GameCard>;

  /** Target player for unblocked attackers */
  defendingPlayer: Player;
}

/**
 * Data for buff/debuff actions.
 */
export interface BuffActionData {
  /** Target to buff */
  target: GameCard;

  /** Attack modifier */
  attackDelta: number;

  /** Health modifier */
  healthDelta: number;

  /** Duration in turns (undefined = permanent) */
  duration?: number;

  /** Keywords to grant */
  keywordsGranted?: string[];
}

/**
 * Data for stun actions.
 */
export interface StunActionData {
  /** Target to stun */
  target: GameCard;

  /** Duration in turns */
  duration: number;
}

/**
 * Data for keyword modification actions.
 */
export interface KeywordActionData {
  /** Target card */
  target: GameCard;

  /** Keyword to grant/remove */
  keyword: string;

  /** Whether this is permanent or temporary */
  permanent?: boolean;

  /** Duration if temporary */
  duration?: number;
}

/**
 * Data for resource actions.
 */
export interface ResourceActionData {
  /** Player gaining/spending resource */
  player: Player;

  /** Amount of resource */
  amount: number;

  /** Type of resource (for power) */
  resourceType?: string;
}

/**
 * Data for token creation.
 */
export interface CreateTokenActionData {
  /** ID of token card to create */
  tokenId: string;

  /** Owner of the token */
  owner: Player;

  /** Zone to create token in */
  zone: string;

  /** Position in zone (optional) */
  position?: number;

  /** Number of tokens to create */
  count?: number;
}

// ============================================================================
// EXECUTION CONTEXT
// ============================================================================

/**
 * Context provided to actions during execution.
 * Contains references to executor, registries, etc.
 */
export interface ActionExecutionContext {
  /** The game instance */
  game: Game;

  /** The action executor */
  executor: ActionExecutor;

  /** Modifier registry */
  modifierRegistry: ModifierRegistry;

  /** Trigger registry */
  triggerRegistry: TriggerRegistry;

  /** Current stack depth */
  stackDepth: number;

  /** Maximum allowed stack depth */
  maxStackDepth: number;
}

// ============================================================================
// REGISTRIES (Interfaces - implementations will be in separate files)
// ============================================================================

/**
 * Registry for managing action modifiers.
 */
export interface ModifierRegistry {
  /**
   * Register a modifier for specific action types.
   */
  register(actionTypes: GameActionType | GameActionType[], modifier: ActionModifier): void;

  /**
   * Unregister a specific modifier.
   */
  unregister(modifier: ActionModifier): void;

  /**
   * Unregister all modifiers from a specific source card.
   */
  unregisterBySource(sourceCardId: string): void;

  /**
   * Get all active modifiers for an action type.
   */
  getModifiersFor(actionType: GameActionType, game: Game): ActionModifier[];

  /**
   * Remove expired modifiers.
   */
  cleanupExpired(): void;

  /**
   * Get all registered modifiers (for debugging).
   */
  getAllModifiers(): ActionModifier[];
}

/**
 * Registry for managing action triggers.
 */
export interface TriggerRegistry {
  /**
   * Register a trigger for specific action types.
   */
  register(actionTypes: GameActionType | GameActionType[], trigger: ActionTrigger): void;

  /**
   * Unregister a specific trigger.
   */
  unregister(trigger: ActionTrigger): void;

  /**
   * Unregister all triggers from a specific source card.
   */
  unregisterBySource(sourceCardId: string): void;

  /**
   * Get all active triggers for an action type.
   */
  getTriggersFor(actionType: GameActionType, game: Game): ActionTrigger[];

  /**
   * Remove expired triggers.
   */
  cleanupExpired(): void;

  /**
   * Get all registered triggers (for debugging).
   */
  getAllTriggers(): ActionTrigger[];
}

/**
 * Main action executor - orchestrates the action pipeline.
 */
export interface ActionExecutor {
  /**
   * Execute an action through the full pipeline.
   */
  execute(action: GameAction): Promise<ActionExecutionResult>;

  /**
   * Get complete action history (for replay).
   */
  getActionHistory(): ReadonlyArray<GameAction>;

  /**
   * Get modifier registry.
   */
  getModifierRegistry(): ModifierRegistry;

  /**
   * Get trigger registry.
   */
  getTriggerRegistry(): TriggerRegistry;

  /**
   * Reset executor state (for testing).
   */
  reset(): void;
}

// ============================================================================
// CARD CONTEXT EXTENSION
// ============================================================================

/**
 * Extended CardContext with action system integration.
 * This will be merged into the existing CardContext interface.
 */
export interface ActionCardContext {
  /**
   * Execute a game action through the pipeline.
   */
  execute(action: GameAction): Promise<ActionExecutionResult>;

  /**
   * Register a modifier for this card.
   * Automatically cleaned up when card leaves play.
   */
  registerModifier(
    actionTypes: GameActionType | GameActionType[],
    modifier: ActionModifier
  ): void;

  /**
   * Register a trigger for this card.
   * Automatically cleaned up when card leaves play.
   */
  registerTrigger(
    actionTypes: GameActionType | GameActionType[],
    trigger: ActionTrigger
  ): void;

  /**
   * Unregister all modifiers and triggers from this card.
   * Called automatically when card leaves play.
   */
  cleanup(): void;

  /**
   * Get the action executor.
   */
  getExecutor(): ActionExecutor;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type guard for checking if an action is of a specific type.
 */
export type ActionOfType<T extends GameActionType> = GameAction & {
  type: T;
};

/**
 * Extract data type from action type.
 */
export type ActionDataType<T extends GameActionType> =
  T extends GameActionType.DEAL_DAMAGE ? DamageActionData :
  T extends GameActionType.HEAL_DAMAGE ? HealActionData :
  T extends GameActionType.MOVE_CARD ? MoveCardActionData :
  T extends GameActionType.DRAW_CARD ? DrawCardActionData :
  T extends GameActionType.PLAY_CARD ? PlayCardActionData :
  T extends GameActionType.RESOLVE_COMBAT ? CombatActionData :
  T extends GameActionType.APPLY_BUFF ? BuffActionData :
  T extends GameActionType.STUN_UNIT ? StunActionData :
  T extends GameActionType.GRANT_KEYWORD ? KeywordActionData :
  T extends GameActionType.ADD_ENERGY ? ResourceActionData :
  T extends GameActionType.CREATE_TOKEN ? CreateTokenActionData :
  any;

/**
 * Configuration for action executor.
 */
export interface ActionExecutorConfig {
  /** Maximum stack depth before overflow error */
  maxStackDepth?: number;

  /** Whether to enable debug logging */
  debug?: boolean;

  /** Whether to profile action performance */
  profile?: boolean;
}

/**
 * Statistics for action execution (for profiling).
 */
export interface ActionExecutionStats {
  /** Total actions executed */
  totalActions: number;

  /** Actions by type */
  actionsByType: Map<GameActionType, number>;

  /** Average execution time per action type */
  avgExecutionTime: Map<GameActionType, number>;

  /** Total modifiers applied */
  totalModifiersApplied: number;

  /** Total triggers fired */
  totalTriggersFired: number;

  /** Peak stack depth */
  peakStackDepth: number;
}
