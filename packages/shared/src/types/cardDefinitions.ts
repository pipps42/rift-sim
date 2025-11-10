import { BaseEntity } from './common';

// ============================================================================
// CARD DEFINITIONS - Static, immutable card data (database/configuration)
// ============================================================================

export interface PowerCost {
  domain: Domain;
  amount: number;
}

export enum CardType {
  UNIT = 'unit',
  GEAR = 'gear',
  SPELL = 'spell',
  RUNE = 'rune',
  CHAMPION_LEGEND = 'champion_legend',
  BATTLEFIELD = 'battlefield'
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  MYTHIC = 'mythic'
}

export enum Domain {
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  LIGHT = 'light',
  DARK = 'dark',
  NATURE = 'nature',
  TECH = 'tech',
  UNIVERSAL = 'universal' // For universal power
}

export type Tag = string; // Generic tag system for champions, regions, factions, etc.

// ============================================================================
// BASE CARD DEFINITION
// ============================================================================

export interface BaseCardDefinition {
  id: string; // Unique card ID (e.g., "RB_001_Yasuo")
  name: string;
  energyCost: number; // Generic energy cost
  powerCost: PowerCost[]; // Domain-specific power costs
  description: string;
  flavorText?: string;
  cardType: CardType;
  rarity: Rarity;
  domains: Domain[];
  keywords: Keyword[];
  imageUrl?: string;
  artist?: string;
  cardNumber?: string;
  tags: Tag[];
  set?: string; // Card set/expansion
  legality?: CardLegality; // Tournament legality
}

export interface CardLegality {
  standard: boolean;
  historic: boolean;
  banned: boolean;
}

// ============================================================================
// SPECIFIC CARD DEFINITION TYPES
// ============================================================================

export interface UnitDefinition extends BaseCardDefinition {
  cardType: CardType.UNIT;
  might: number; // Base combat value and health threshold
  subtypes: UnitSubtype[];
  abilities: AbilityDefinition[];
}

export enum UnitSubtype {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  BEAST = 'beast',
  DRAGON = 'dragon',
  ELEMENTAL = 'elemental',
  CONSTRUCT = 'construct',
  SPIRIT = 'spirit',
  CHAMPION = 'champion'
}

export interface ChampionLegendDefinition extends BaseCardDefinition {
  cardType: CardType.CHAMPION_LEGEND;
  domainIdentity: Domain[]; // Defines deck building restrictions
  championTag: string; // Tag that Chosen Champion must have
  legendaryAbility: AbilityDefinition;
}

export interface GearDefinition extends BaseCardDefinition {
  cardType: CardType.GEAR;
  gearType: GearType;
  abilities: AbilityDefinition[];
}

export enum GearType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
  ARTIFACT = 'artifact'
}

export interface SpellDefinition extends BaseCardDefinition {
  cardType: CardType.SPELL;
  spellTiming: SpellTiming;
  targetRequirements?: TargetRequirement[];
  effects: EffectDefinition[];
}

export enum SpellTiming {
  NORMAL = 'normal', // Default: playable only during Neutral Open in own turn
  ACTION = 'action', // Also playable during Showdowns
  REACTION = 'reaction' // Playable anytime (even during Closed State)
}

export interface RuneDefinition extends BaseCardDefinition {
  cardType: CardType.RUNE;
  isBasicRune: boolean;
  abilities: AbilityDefinition[]; // Typically [T]: Add [1] and Recycle this: Add [C]
}

export interface BattlefieldDefinition extends BaseCardDefinition {
  cardType: CardType.BATTLEFIELD;
  battlefieldAbilities: AbilityDefinition[];
  scoreValue: number; // Points awarded for controlling this battlefield
}

export type CardDefinition =
  | UnitDefinition
  | ChampionLegendDefinition
  | GearDefinition
  | SpellDefinition
  | RuneDefinition
  | BattlefieldDefinition;

// ============================================================================
// ABILITY DEFINITIONS
// ============================================================================

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  cost?: CostDefinition;
  timing: AbilityTiming;
  triggers?: AbilityTrigger[];
  effects: EffectDefinition[];
  targetRequirements?: TargetRequirement[];
}

export enum AbilityType {
  ACTIVATED = 'activated', // [Cost]: Effect
  TRIGGERED = 'triggered', // When/At X: Effect
  STATIC = 'static', // Continuous effect
  REPLACEMENT = 'replacement' // Instead of X, Y
}

export enum AbilityTiming {
  NORMAL = 'normal',
  ACTION = 'action',
  REACTION = 'reaction'
}

export enum AbilityTrigger {
  ENTERS_PLAY = 'enters_play',
  ATTACKS = 'attacks',
  DEFENDS = 'defends',
  DIES = 'dies',
  DEALS_DAMAGE = 'deals_damage',
  TAKES_DAMAGE = 'takes_damage',
  TURN_START = 'turn_start',
  TURN_END = 'turn_end',
  BATTLEFIELD_CONTROLLED = 'battlefield_controlled',
  SPELL_CAST = 'spell_cast'
}

export interface CostDefinition {
  energyCost?: number;
  powerCost?: PowerCost[];
  additionalCosts?: AdditionalCostDefinition[];
}

export interface AdditionalCostDefinition {
  type: CostType;
  description: string;
  amount?: number;
}

export enum CostType {
  EXHAUST_UNIT = 'exhaust_unit',
  DISCARD_CARD = 'discard_card',
  SACRIFICE_UNIT = 'sacrifice_unit',
  PAY_LIFE = 'pay_life'
}

// ============================================================================
// EFFECT DEFINITIONS
// ============================================================================

export interface EffectDefinition {
  type: EffectType;
  value?: number;
  duration?: EffectDuration;
  description: string;
  conditions?: ConditionDefinition[];
}

export enum EffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  BUFF_MIGHT = 'buff_might',
  DRAW_CARDS = 'draw_cards',
  DISCARD_CARDS = 'discard_cards',
  DESTROY = 'destroy',
  RETURN_TO_HAND = 'return_to_hand',
  MOVE_UNIT = 'move_unit',
  EXHAUST = 'exhaust',
  READY = 'ready',
  STUN = 'stun',
  ADD_KEYWORD = 'add_keyword',
  REMOVE_KEYWORD = 'remove_keyword',
  CREATE_TOKEN = 'create_token',
  SEARCH_DECK = 'search_deck',
  MILL_CARDS = 'mill_cards'
}

export enum EffectDuration {
  INSTANT = 'instant',
  END_OF_TURN = 'end_of_turn',
  PERMANENT = 'permanent',
  WHILE_IN_PLAY = 'while_in_play'
}

export interface ConditionDefinition {
  type: ConditionType;
  value?: any;
  description: string;
}

export enum ConditionType {
  TARGET_COUNT = 'target_count',
  BATTLEFIELD_CONTROL = 'battlefield_control',
  CARD_IN_HAND = 'card_in_hand',
  ENERGY_AVAILABLE = 'energy_available'
}

// ============================================================================
// TARGET SYSTEM
// ============================================================================

export interface TargetRequirement {
  targetType: TargetType;
  count: number;
  optional: boolean;
  restrictions?: TargetRestriction[];
}

export enum TargetType {
  UNIT = 'unit',
  GEAR = 'gear',
  PLAYER = 'player',
  BATTLEFIELD = 'battlefield',
  CARD_IN_HAND = 'card_in_hand',
  CARD_IN_TRASH = 'card_in_trash'
}

export interface TargetRestriction {
  property: TargetProperty;
  operator: ComparisonOperator;
  value: any;
}

export enum TargetProperty {
  CARD_TYPE = 'card_type',
  MIGHT = 'might',
  ENERGY_COST = 'energy_cost',
  DOMAIN = 'domain',
  KEYWORD = 'keyword',
  TAG = 'tag'
}

export enum ComparisonOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains'
}

// ============================================================================
// KEYWORD DEFINITIONS
// ============================================================================

export enum Keyword {
  // Unit Keywords
  ACCELERATE = 'accelerate', // Enter ready instead of exhausted
  ASSAULT = 'assault', // +X might when attacking
  DEFLECT = 'deflect', // Redirect damage
  GANKING = 'ganking', // Can move from battlefield to battlefield
  SHIELD = 'shield', // +X might when defending
  TANK = 'tank', // Must receive lethal damage before other units
  TEMPORARY = 'temporary', // Goes to trash at end of turn
  VISION = 'vision', // Can see hidden information

  // Spell/Ability Keywords
  ACTION = 'action', // Can be played during Showdowns
  REACTION = 'reaction', // Can be played during Closed State
  LEGION = 'legion', // Affects multiple targets

  // Permanent Keywords
  DEATHKNELL = 'deathknell', // Triggered when unit dies
  HIDDEN = 'hidden' // Can be placed facedown
}

export interface KeywordDefinition {
  keyword: Keyword;
  name: string;
  description: string;
  applicableCardTypes: CardType[];
  hasValue?: boolean; // e.g., Assault X, Shield X
}

// ============================================================================
// CARD DATABASE INTERFACE
// ============================================================================

export interface CardDatabase {
  cards: Map<string, CardDefinition>;
  keywords: Map<Keyword, KeywordDefinition>;

  getCard(id: string): CardDefinition | undefined;
  getCardsByType(type: CardType): CardDefinition[];
  getCardsByDomain(domain: Domain): CardDefinition[];
  getCardsByTag(tag: string): CardDefinition[];
  searchCards(query: string): CardDefinition[];
}