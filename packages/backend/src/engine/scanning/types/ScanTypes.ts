/**
 * Types for the CardStateScanner system
 *
 * The scanner iterates through all cards on state changes to determine:
 * - What cards are playable
 * - What activated abilities are available
 * - What triggers are pending
 * - Effective costs with modifiers applied
 */

import type { GameCard, Game, Player, PowerCost, GameEvent } from '../../../types/game';
import type { CardContext } from '../../scripting/types/CardScriptTypes';
import type { GameAction } from '../../actions/base/GameAction';

// ============================================================================
// ZONE TYPES
// ============================================================================

export type Zone =
  | 'hand'
  | 'deck'
  | 'battlefield'
  | 'facedown'
  | 'trash'
  | 'runeDeck'
  | 'runePool'
  | 'chain';

export type SpellTiming = 'sorcery' | 'instant';

// ============================================================================
// COST TYPES
// ============================================================================

export interface EffectiveCost {
  energy: number;
  power: PowerCost[];
  modifiedBy?: 'base' | 'modified';
}

export interface CostModifierMetadata {
  id: string;
  description: string;
  calculate: (ctx: CardContext) => CostModification;
}

export interface CostModification {
  energyChange?: number;
  powerChanges?: { domain: string; change: number }[];
}

// ============================================================================
// CONSTRAINT TYPES
// ============================================================================

export interface ConstraintMetadata {
  id: string;
  description: string;
  check: (ctx: CardContext) => ConstraintCheckResult;
}

export interface ConstraintCheckResult {
  satisfied: boolean;
  reason?: string;
}

// ============================================================================
// ACTIVATED ABILITY TYPES
// ============================================================================

export interface ActivatedAbilityMetadata {
  id: string;
  name: string;
  description: string;
  availableFrom: Zone[];
  costs?: {
    energy?: number;
    power?: PowerCost[];
  };
  constraints?: ConstraintMetadata[];
  timing?: SpellTiming;
  onActivate: (ctx: CardContext) => Promise<GameAction[]>;
}

export interface ActivatedAbilityInfo extends ActivatedAbilityMetadata {
  canActivate: boolean;
  reason?: string;
}

// ============================================================================
// REACTIVE TRIGGER TYPES
// ============================================================================

export interface ReactiveTriggerMetadata {
  id: string;
  eventType: string;
  description: string;
  condition: (event: GameEvent, ctx: CardContext) => boolean;
}

export interface PendingTrigger {
  triggerId: string;
  event: GameEvent;
  card: GameCard;
}

// ============================================================================
// CARD METADATA (for scanner)
// ============================================================================

export interface CardMetadata {
  /**
   * Target requirements for this card
   * Example: "Target a unit with 3 or less Might"
   */
  targetRequirements?: import('../../../types/game').TargetRequirement[];

  /**
   * Cost modifiers applied to this card
   * Example: "Costs 1 less for each unit you control"
   */
  costModifiers?: CostModifierMetadata[];

  /**
   * Constraints for playing this card
   * Example: "Can only play if you control a battlefield"
   */
  playConstraints?: ConstraintMetadata[];

  /**
   * Activated abilities available from various zones
   * Example: HIDDEN keyword, Phoenix resurrection
   */
  activatedAbilities?: ActivatedAbilityMetadata[];

  /**
   * Reactive triggers for UI hints
   * Example: "When a unit dies" (shows in UI before it happens)
   */
  reactiveTriggers?: ReactiveTriggerMetadata[];
}

// ============================================================================
// PLAYABILITY TYPES
// ============================================================================

export interface PlayabilityInfo {
  canPlay: boolean;
  reason?: string;
}

// ============================================================================
// SCAN RESULT TYPES
// ============================================================================

export interface CardScanResult {
  card: GameCard;
  playable: PlayabilityInfo | null; // null if not in hand
  effectiveCost: EffectiveCost;
  abilities: ActivatedAbilityInfo[];
  pendingTriggers: PendingTrigger[];
}

// ============================================================================
// SCAN DELTA TYPES (what changed since last scan)
// ============================================================================

export type CardStateChangeType =
  | 'new'
  | 'removed'
  | 'playability_changed'
  | 'abilities_changed'
  | 'triggers_pending'
  | 'cost_changed';

export interface CardStateChange {
  type: CardStateChangeType;
  card: GameCard;
  result?: CardScanResult;
  from?: any;
  to?: any;
  abilities?: ActivatedAbilityInfo[];
  triggers?: PendingTrigger[];
}

export interface ScanDelta {
  changed: boolean;
  changes?: CardStateChange[];
  timestamp?: Date;
}

// ============================================================================
// GAME STATE SNAPSHOT (for change detection)
// ============================================================================

export interface GameStateSnapshot {
  phase: string;
  turn: number;
  playerIndex: number;
  chainLength: number;
  historyLength: number;
  players: {
    id: string;
    energy: number;
    power: Record<string, number>;
    handSize: number;
    battlefieldUnitCount: number;
  }[];
}
