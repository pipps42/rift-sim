import {
  CardDefinition,
  UnitDefinition,
  GearDefinition,
  SpellDefinition,
  RuneDefinition,
  BattlefieldDefinition,
  ChampionLegendDefinition,
  CardType,
  Keyword,
  EffectDuration
} from './cardDefinitions';

// ============================================================================
// CARD INSTANCES - Runtime, mutable game objects
// ============================================================================

/**
 * Base interface for all card instances in a game
 * Contains runtime state and references the static definition
 */
export interface BaseCardInstance {
  instanceId: string; // Unique instance ID in this game (e.g., "game_123_card_456")
  definitionId: string; // Reference to static card definition
  controllerId: string; // Player who controls this instance
  ownerId: string; // Player who owns this card (usually same as controller)

  // Zone and position
  zone: string; // Current zone (hand, base, battlefield, etc.)
  position?: number; // Position in zone if ordered

  // Runtime state
  ready: boolean; // Ready vs Exhausted state
  temporaryModifiers: TemporaryModifier[];
  counters: Counter[];

  // Game history
  turnEntered?: number; // Turn number when this instance entered current zone
  timeEntered?: Date; // Timestamp when entered current zone

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Unit instance with combat-specific runtime state
 */
export interface UnitInstance extends BaseCardInstance {
  definition: UnitDefinition; // Reference to static definition

  // Combat state
  damage: number; // Current damage received (only relevant on board)
  currentMight: number; // Base might + temporary modifications
  isStunned: boolean; // Stunned units don't contribute damage

  // Combat roles
  isAttacking: boolean; // Currently participating in attack
  isDefending: boolean; // Currently participating in defense

  // Keyword states
  hasAssaultBonus: boolean; // Assault bonus active this combat
  hasShieldBonus: boolean; // Shield bonus active this combat
  grantedKeywords: Keyword[]; // Keywords granted by other effects

  // Movement state
  canMove: boolean; // Can perform Standard Move this turn
  hasMoved: boolean; // Has moved this turn
  lastMovedTurn?: number; // Last turn this unit moved
}

/**
 * Gear instance with equipment state
 */
export interface GearInstance extends BaseCardInstance {
  definition: GearDefinition;

  // Gear-specific state
  attachedTo?: string; // Unit instance ID if gear is attached
  isEquipped: boolean; // Whether gear is actively providing benefits

  // Activation state
  usesRemaining?: number; // For gear with limited uses
  lastActivatedTurn?: number; // For once-per-turn abilities
}

/**
 * Spell instance (typically short-lived, on Chain)
 */
export interface SpellInstance extends BaseCardInstance {
  definition: SpellDefinition;

  // Spell state
  targets: string[]; // Target instance IDs chosen when cast
  isResolved: boolean; // Whether spell has resolved

  // Chain state
  chainPosition?: number; // Position on the Chain when cast
  castTurn: number; // Turn when spell was cast

  // Cost payment tracking
  energyPaid: number;
  powerPaid: { domain: string; amount: number }[];
  additionalCostsPaid: AdditionalCostPaid[];
}

/**
 * Rune instance with resource generation state
 */
export interface RuneInstance extends BaseCardInstance {
  definition: RuneDefinition;

  // Resource state
  hasGeneratedEnergy: boolean; // Used [T] ability this turn
  hasBeenRecycled: boolean; // Used Recycle ability
  recycledTurn?: number; // Turn when recycled

  // Channel state
  channeledTurn: number; // Turn when rune was channeled
}

/**
 * Battlefield instance with control state
 */
export interface BattlefieldInstance extends BaseCardInstance {
  definition: BattlefieldDefinition;

  // Control state
  controller?: string; // Player ID who controls this battlefield
  contested: boolean; // Whether battlefield is contested
  contestedSince?: number; // Turn when became contested

  // Units present
  unitsPresent: string[]; // Unit instance IDs at this battlefield

  // Scoring state
  scoredThisTurn: boolean; // Prevents double-scoring
  lastScored?: number; // Last turn when points were scored
  scoreHistory: ScoringEvent[]; // History of scoring events

  // Hidden cards
  facedownCards: string[]; // Card instance IDs placed face-down here
}

/**
 * Champion Legend instance (usually in Legend Zone)
 */
export interface ChampionLegendInstance extends BaseCardInstance {
  definition: ChampionLegendDefinition;

  // Legend state
  isActive: boolean; // Whether legendary ability is active
  abilityUsedThisTurn: boolean; // For once-per-turn legendary abilities

  // Domain identity enforcement
  deckRestrictionActive: boolean; // Whether domain identity is being enforced
}

/**
 * Union type for all card instances
 */
export type CardInstance =
  | UnitInstance
  | GearInstance
  | SpellInstance
  | RuneInstance
  | BattlefieldInstance
  | ChampionLegendInstance;

// ============================================================================
// TEMPORARY MODIFIERS AND EFFECTS
// ============================================================================

export interface TemporaryModifier {
  id: string;
  type: ModifierType;
  value: number | string | Keyword; // Can be numeric value, string, or keyword
  duration: EffectDuration;
  source: string; // Source card/ability instance ID
  expiresOnTurn?: number; // Specific turn when this expires
  conditions?: ModifierCondition[]; // Conditions for modifier to be active

  createdAt: Date;
  updatedAt: Date;
}

export enum ModifierType {
  MIGHT_BONUS = 'might_bonus',
  MIGHT_REDUCTION = 'might_reduction',
  ENERGY_COST_REDUCTION = 'energy_cost_reduction',
  ENERGY_COST_INCREASE = 'energy_cost_increase',
  POWER_COST_REDUCTION = 'power_cost_reduction',
  KEYWORD_GRANT = 'keyword_grant',
  KEYWORD_REMOVAL = 'keyword_removal',
  ABILITY_GRANT = 'ability_grant',
  ABILITY_DISABLE = 'ability_disable',
  MOVEMENT_RESTRICTION = 'movement_restriction',
  DAMAGE_PREVENTION = 'damage_prevention',
  DAMAGE_AMPLIFICATION = 'damage_amplification'
}

export interface ModifierCondition {
  type: ConditionType;
  value?: any;
  description: string;
}

export enum ConditionType {
  WHILE_ATTACKING = 'while_attacking',
  WHILE_DEFENDING = 'while_defending',
  WHILE_AT_BATTLEFIELD = 'while_at_battlefield',
  WHILE_CONTROLLER_HAS_PRIORITY = 'while_controller_has_priority',
  WHILE_BATTLEFIELD_CONTROLLED = 'while_battlefield_controlled',
  WHILE_SPECIFIC_CARD_IN_PLAY = 'while_specific_card_in_play'
}

// ============================================================================
// COUNTERS AND MARKERS
// ============================================================================

export interface Counter {
  type: CounterType;
  amount: number;
  source?: string; // What created this counter
  expiresOnTurn?: number; // When this counter expires (if applicable)
}

export enum CounterType {
  BUFF = 'buff', // Generic +1/+1 style counters
  DAMAGE = 'damage', // Damage markers
  CHARGE = 'charge', // Charge counters for abilities
  EXPERIENCE = 'experience', // Experience counters
  QUEST = 'quest', // Quest progress counters
  LOYALTY = 'loyalty', // Loyalty counters (planeswalker-style)
  BOUNTY = 'bounty', // Bounty counters
  POISON = 'poison' // Poison counters
}

// ============================================================================
// COST PAYMENT TRACKING
// ============================================================================

export interface AdditionalCostPaid {
  type: string; // Type of additional cost
  description: string;
  resourcePaid?: any; // What was actually paid
  targetIds?: string[]; // If cost involved targeting
}

// ============================================================================
// SCORING EVENTS
// ============================================================================

export interface ScoringEvent {
  id: string;
  playerId: string;
  method: ScoringMethod;
  pointsAwarded: number;
  turn: number;
  isFinalPoint: boolean;
  timestamp: Date;
}

export enum ScoringMethod {
  HOLD = 'hold',
  CONQUER = 'conquer'
}

// ============================================================================
// CARD INSTANCE UTILITIES
// ============================================================================

/**
 * Type guards for card instances
 */
export function isUnitInstance(instance: CardInstance): instance is UnitInstance {
  return instance.definition.cardType === CardType.UNIT;
}

export function isGearInstance(instance: CardInstance): instance is GearInstance {
  return instance.definition.cardType === CardType.GEAR;
}

export function isSpellInstance(instance: CardInstance): instance is SpellInstance {
  return instance.definition.cardType === CardType.SPELL;
}

export function isRuneInstance(instance: CardInstance): instance is RuneInstance {
  return instance.definition.cardType === CardType.RUNE;
}

export function isBattlefieldInstance(instance: CardInstance): instance is BattlefieldInstance {
  return instance.definition.cardType === CardType.BATTLEFIELD;
}

export function isChampionLegendInstance(instance: CardInstance): instance is ChampionLegendInstance {
  return instance.definition.cardType === CardType.CHAMPION_LEGEND;
}

/**
 * Helper functions for card instance management
 */
export class CardInstanceUtils {
  /**
   * Calculate current effective might for a unit instance
   */
  static calculateCurrentMight(unit: UnitInstance): number {
    let baseMight = unit.definition.might;

    // Apply temporary modifiers
    for (const modifier of unit.temporaryModifiers) {
      if (modifier.type === ModifierType.MIGHT_BONUS && typeof modifier.value === 'number') {
        baseMight += modifier.value;
      } else if (modifier.type === ModifierType.MIGHT_REDUCTION && typeof modifier.value === 'number') {
        baseMight -= modifier.value;
      }
    }

    // Apply buff counters
    for (const counter of unit.counters) {
      if (counter.type === CounterType.BUFF) {
        baseMight += counter.amount;
      }
    }

    return Math.max(0, baseMight); // Might cannot go below 0
  }

  /**
   * Check if a unit instance has a specific keyword (base or granted)
   */
  static hasKeyword(unit: UnitInstance, keyword: Keyword): boolean {
    // Check base keywords
    if (unit.definition.keywords.includes(keyword)) {
      return true;
    }

    // Check granted keywords
    if (unit.grantedKeywords.includes(keyword)) {
      return true;
    }

    // Check temporary modifiers that grant keywords
    for (const modifier of unit.temporaryModifiers) {
      if (modifier.type === ModifierType.KEYWORD_GRANT && modifier.value === keyword) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a card instance is in a board zone
   */
  static isOnBoard(instance: CardInstance): boolean {
    const boardZones = ['base', 'battlefield', 'legend_zone'];
    return boardZones.some(zone => instance.zone.includes(zone));
  }

  /**
   * Check if a unit instance can be targeted
   */
  static canBeTargeted(unit: UnitInstance): boolean {
    // Check for targeting restrictions from keywords or modifiers
    // This would be expanded based on specific Riftbound rules
    return true; // Simplified for now
  }

  /**
   * Get all active keywords for a unit instance
   */
  static getActiveKeywords(unit: UnitInstance): Keyword[] {
    const keywords = new Set<Keyword>();

    // Add base keywords
    unit.definition.keywords.forEach(k => keywords.add(k));

    // Add granted keywords
    unit.grantedKeywords.forEach(k => keywords.add(k));

    // Add keywords from modifiers
    unit.temporaryModifiers.forEach(modifier => {
      if (modifier.type === ModifierType.KEYWORD_GRANT && typeof modifier.value === 'string') {
        keywords.add(modifier.value as Keyword);
      }
    });

    // Remove keywords that are being removed by modifiers
    unit.temporaryModifiers.forEach(modifier => {
      if (modifier.type === ModifierType.KEYWORD_REMOVAL && typeof modifier.value === 'string') {
        keywords.delete(modifier.value as Keyword);
      }
    });

    return Array.from(keywords);
  }
}

// ============================================================================
// CARD INSTANCE FACTORY
// ============================================================================

export interface CardInstanceFactory {
  createUnitInstance(
    definition: UnitDefinition,
    controllerId: string,
    ownerId: string,
    zone: string
  ): UnitInstance;

  createGearInstance(
    definition: GearDefinition,
    controllerId: string,
    ownerId: string,
    zone: string
  ): GearInstance;

  createSpellInstance(
    definition: SpellDefinition,
    controllerId: string,
    ownerId: string,
    targets: string[]
  ): SpellInstance;

  createRuneInstance(
    definition: RuneDefinition,
    controllerId: string,
    ownerId: string,
    zone: string
  ): RuneInstance;

  createBattlefieldInstance(
    definition: BattlefieldDefinition,
    zone: string
  ): BattlefieldInstance;

  createChampionLegendInstance(
    definition: ChampionLegendDefinition,
    controllerId: string,
    ownerId: string
  ): ChampionLegendInstance;
}