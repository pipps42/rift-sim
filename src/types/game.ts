import { BaseEntity } from './common';
import type { CardStorage } from '../engine/storage/CardStorage';
import type { HistoryQueryAPI } from '../engine/history/HistoryQueryAPI';

// ============================================================================
// CORE GAME ENTITIES
// ============================================================================

export interface Player {
  id: string;
  name: string;
  score: number; // Current victory points (goal: 8)
  championLegend: LegendCard;
  chosenChampion?: ChampionCard; // Starts in Champion Zone
  zones: PlayerZones;
  runePool: RunePool;
  hasPlayedCard: boolean; // For turn tracking
  turnsPassed: number;
}

export interface Game {
  id: string;
  players: [Player, Player]; // Exactly 2 players (1v1)
  currentPlayerIndex: 0 | 1;
  phase: GamePhase;
  turnState: TurnState;
  round: number;
  currentTurn: number; // Absolute turn counter (increments every turn, starts at 1)
  winner?: string; // Player ID of winner
  status: GameStatus;
  battlefields: Battlefield[];
  chain: ChainItem[];
  combatState?: CombatState;
  showdownState?: ShowdownState;
  storage: CardStorage; // Card storage system for sharing data between cards
  history: GameEvent[]; // Game event history for replay/queries
  historyQuery: HistoryQueryAPI; // Helper API for common history queries
  processDeaths?: () => Promise<void>; // State-based action to process unit deaths
  createdAt: Date;
  updatedAt: Date;
}

export enum GamePhase {
  AWAKEN = 'awaken',
  BEGINNING = 'beginning',
  CHANNEL = 'channel',
  DRAW = 'draw',
  ACTION = 'action',
  ENDING = 'ending',
  EXPIRATION = 'expiration',
  CLEANUP = 'cleanup'
}

export enum TurnState {
  NEUTRAL_OPEN = 'neutral_open',
  NEUTRAL_CLOSED = 'neutral_closed',
  SHOWDOWN_OPEN = 'showdown_open',
  SHOWDOWN_CLOSED = 'showdown_closed'
}

export enum GameStatus {
  SETUP = 'setup',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  ABANDONED = 'abandoned'
}

// ============================================================================
// CARD SYSTEM
// ============================================================================

export interface BaseCard {
  id: string;
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
  scriptPath?: string; // Optional path to script file (for V2 runtime)
}

export interface PowerCost {
  domain: Domain;
  amount: number;
}

export enum CardType {
  UNIT = 'unit',
  CHAMPION = 'champion',
  GEAR = 'gear',
  SPELL = 'spell',
  RUNE = 'rune',
  LEGEND = 'legend',
  BATTLEFIELD = 'battlefield',
  SIGNATURE = 'signature',
  TOKEN = 'token'
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  MYTHIC = 'mythic'
}

export enum Domain {
  FURY = 'fury',
  CALM = 'calm',
  MIND = 'mind',
  BODY = 'body',
  CHAOS = 'chaos',
  ORDER = 'order',
  UNIVERSAL = 'universal' // For universal power
}

export type Tag = string; // Generic tag system for champions, regions, factions, etc.

// ============================================================================
// SPECIFIC CARD TYPES
// ============================================================================

export interface UnitCard extends BaseCard {
  cardType: CardType.UNIT;
  might: number; // Combat value and health threshold
  subtypes: UnitSubtype[];
  abilities: Ability[];
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

export interface LegendCard extends BaseCard {
  cardType: CardType.LEGEND;
  domainIdentity: Domain[]; // Defines deck building restrictions
  championTag: string; // Tag that Chosen Champion must have
  legendaryAbility: Ability;
}

export interface ChampionCard extends BaseCard {
  cardType: CardType.CHAMPION;
  might: number;
  subtypes: UnitSubtype[];
  abilities: Ability[];
}

export interface TokenCard extends BaseCard {
  cardType: CardType.TOKEN;
  might: number;
  subtypes: UnitSubtype[];
  abilities?: Ability[];
}

export interface SignatureCard extends BaseCard {
  cardType: CardType.SIGNATURE;
  abilities: Ability[];
}

export interface GearCard extends BaseCard {
  cardType: CardType.GEAR;
  gearType: GearType;
  abilities: Ability[];
}

export enum GearType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
  ARTIFACT = 'artifact'
}

export interface SpellCard extends BaseCard {
  cardType: CardType.SPELL;
  spellTiming: SpellTiming;
  targetRequirements?: TargetRequirement[];
  effects: Effect[];
}

export enum SpellTiming {
  NORMAL = 'normal', // Default: playable only during Neutral Open in own turn
  ACTION = 'action', // Also playable during Showdowns
  REACTION = 'reaction' // Playable anytime (even during Closed State)
}

export interface RuneCard extends BaseCard {
  cardType: CardType.RUNE;
  isBasicRune: boolean;
  abilities: Ability[]; // Typically [T]: Add [1] and Recycle this: Add [C]
}

export interface BattlefieldCard extends BaseCard {
  cardType: CardType.BATTLEFIELD;
  battlefieldAbilities: Ability[];
  scoreValue: number; // Points awarded for controlling this battlefield
}

export type Card = UnitCard | ChampionCard | LegendCard | GearCard | SpellCard | RuneCard | BattlefieldCard | SignatureCard | TokenCard;

// ============================================================================
// ZONE SYSTEM
// ============================================================================

export interface PlayerZones {
  // Board Zones
  base: GameCard[]; // Personal location, always controlled
  runes: GameCard[]; // Runes channeled to the board

  // Non-Board Zones
  hand: GameCard[];
  mainDeck: GameCard[];
  runeDeck: GameCard[];
  championZone: GameCard[]; // Starts with Chosen Champion
  trash: GameCard[];
  banishment: GameCard[];
}

export interface GlobalZones {
  legendZone: LegendCard[]; // Champion Legends (cannot be moved/removed)
  battlefieldZone: Battlefield[];
  facedownZones: { [battlefieldId: string]: GameCard[] }; // Hidden cards
}

export interface Battlefield {
  id: string;
  card: BattlefieldCard;
  units: GameCard[]; // All units at this battlefield (maintained for compatibility)
  sides: {
    // Units organized by controlling player for efficient access
    [playerId: string]: GameCard[];
  };
  controller?: string; // Player ID who controls this battlefield
  contested: boolean; // Status when units from different players arrive
  facedownCards: GameCard[]; // Hidden cards at this battlefield
}

// ============================================================================
// DECK BUILDING
// ============================================================================

export interface Deck extends BaseEntity {
  name: string;
  playerId: string;
  championLegend: string; // Champion Legend card ID
  chosenChampion: string; // Chosen Champion card ID
  mainDeck: DeckCard[]; // Minimum 40 cards
  runeDeck: DeckCard[]; // Exactly 12 cards
  battlefields: string[]; // Exactly 3 battlefield card IDs
  isValid: boolean;
  validationErrors: DeckValidationError[];
}

export interface DeckCard {
  cardId: string;
  quantity: number; // Max 3 copies per card name, max 3 Signature cards total
}

export interface DeckValidationError {
  type: ValidationErrorType;
  message: string;
  cardId?: string;
}

export enum ValidationErrorType {
  INVALID_MAIN_DECK_SIZE = 'invalid_main_deck_size',
  INVALID_RUNE_DECK_SIZE = 'invalid_rune_deck_size',
  TOO_MANY_COPIES = 'too_many_copies',
  INVALID_DOMAIN_IDENTITY = 'invalid_domain_identity',
  TOO_MANY_SIGNATURE_CARDS = 'too_many_signature_cards',
  MISSING_CHOSEN_CHAMPION = 'missing_chosen_champion',
  WRONG_BATTLEFIELD_COUNT = 'wrong_battlefield_count'
}

// ============================================================================
// COMBAT SYSTEM
// ============================================================================

export interface CombatState {
  battlefield: string; // Battlefield ID where combat is occurring
  attackingPlayer: string;
  defendingPlayer: string;
  attackingUnits: CombatUnit[];
  defendingUnits: CombatUnit[];
  step: CombatStep;
  totalAttackingMight: number;
  totalDefendingMight: number;
  damageDistribution?: DamageDistribution[];
}

export interface CombatUnit {
  cardId: string;
  might: number;
  keywords: Keyword[];
  damage: number; // Current damage received
  hasAssaultBonus: boolean; // For attacking units with Assault
  hasShieldBonus: boolean; // For defending units with Shield
  isStunned: boolean; // Stunned units don't contribute damage
}

export interface DamageDistribution {
  targetCardId: string;
  damage: number;
  isLethalDamage: boolean; // damage >= target's Might
}

export enum CombatStep {
  SHOWDOWN = 'showdown',
  COMBAT_DAMAGE = 'combat_damage',
  RESOLUTION = 'resolution'
}

export interface ShowdownState {
  battlefield: string;
  relevantPlayers: string[]; // Players involved in the showdown
  focusPlayer: string; // Player who currently has Focus
  initialChainCreated: boolean;
}

// ============================================================================
// SCORING SYSTEM
// ============================================================================

export interface ScoringEvent {
  id: string;
  playerId: string;
  battlefieldId: string;
  scoringMethod: ScoringMethod;
  pointsAwarded: number;
  isFinalPoint: boolean;
  timestamp: Date;
}

export enum ScoringMethod {
  HOLD = 'hold', // Controlling battlefield during Beginning Phase
  CONQUER = 'conquer' // Gaining control during the turn
}

export interface BattlefieldControl {
  battlefieldId: string;
  controllerId?: string;
  contested: boolean;
  scoredThisTurn: boolean; // Prevents double-scoring same battlefield
}

// ============================================================================
// CHAIN AND RESOLUTION SYSTEM
// ============================================================================

export interface ChainItem {
  id: string;
  type: ChainItemType;
  sourceCardId?: string;
  sourceCard?: GameCard; // Reference to the actual card (for counter spells to check costs)
  sourceAbilityId?: string;
  controllerId: string;
  targets: Target[];
  effects: Effect[];
  spellTiming?: SpellTiming; // For spells
  timestamp: Date;
  resolved: boolean;
}

export enum ChainItemType {
  SPELL = 'spell',
  ACTIVATED_ABILITY = 'activated_ability',
  TRIGGERED_ABILITY = 'triggered_ability'
}

export interface Target {
  type: TargetType;
  cardId?: string;
  playerId?: string;
  battlefieldId?: string;
  restrictions: TargetRestriction[];
}

export enum TargetType {
  UNIT = 'unit',
  GEAR = 'gear',
  PLAYER = 'player',
  BATTLEFIELD = 'battlefield',
  CARD_IN_HAND = 'card_in_hand',
  CARD_IN_TRASH = 'card_in_trash',
  CHAIN_ITEM = 'chain_item'
}

export interface TargetRequirement {
  targetType: TargetType;
  count: number;
  optional: boolean;
  restrictions?: TargetRestriction[];
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
// RUNE POOL AND COST SYSTEM
// ============================================================================

export interface RunePool {
  energy: number; // Generic colorless resource
  power: PowerPool[]; // Domain-specific resources
}

export interface PowerPool {
  domain: Domain;
  amount: number;
}

export interface CostPayment {
  energyPaid: number;
  powerPaid: PowerPool[];
  additionalCosts: AdditionalCost[];
}

export interface AdditionalCost {
  type: CostType;
  description: string;
  paid: boolean;
}

export enum CostType {
  EXHAUST_UNIT = 'exhaust_unit',
  DISCARD_CARD = 'discard_card',
  SACRIFICE_UNIT = 'sacrifice_unit',
  PAY_LIFE = 'pay_life'
}

// ============================================================================
// KEYWORD SYSTEM
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

// ============================================================================
// ABILITY SYSTEM
// ============================================================================

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  cost?: CostPayment;
  timing: AbilityTiming;
  triggers?: AbilityTrigger[];
  effects: Effect[];
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

export interface Effect {
  type: EffectType;
  value?: number;
  duration?: EffectDuration;
  targetIds?: string[];
  description: string;
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

// ============================================================================
// GAME ACTIONS
// ============================================================================

export interface GameAction {
  id: string;
  type: ActionType;
  playerId: string;
  data: ActionData;
  timestamp: Date;
  resolved: boolean;
}

export enum ActionType {
  // Discretionary Actions
  PLAY_CARD = 'play_card',
  ACTIVATE_ABILITY = 'activate_ability',
  STANDARD_MOVE = 'standard_move',
  HIDE_CARD = 'hide_card',
  PASS_PRIORITY = 'pass_priority',

  // Limited Actions (only when instructed)
  DRAW_CARD = 'draw_card',
  DISCARD_CARD = 'discard_card',
  RECYCLE_CARD = 'recycle_card',
  CHANNEL_RUNE = 'channel_rune',
  EXHAUST_CARD = 'exhaust_card',
  READY_CARD = 'ready_card',
  KILL_UNIT = 'kill_unit',
  BANISH_CARD = 'banish_card',

  // Special Actions
  MULLIGAN = 'mulligan',
  SURRENDER = 'surrender'
}

export interface ActionData {
  cardId?: string;
  abilityId?: string;
  targetIds?: string[];
  fromZone?: string;
  toZone?: string;
  battlefieldId?: string;
  amount?: number;
  additionalData?: any;
}

// ============================================================================
// PRIORITY AND FOCUS SYSTEM
// ============================================================================

export interface PriorityState {
  currentPlayer: string; // Who has priority
  focusPlayer?: string; // Who has focus during showdowns
  relevantPlayers: string[]; // Players who can act
  passedPlayers: string[]; // Players who have passed this round
  waitingForPlayer?: string; // Specific player we're waiting for
}

export enum PriorityReason {
  ACTION_PHASE = 'action_phase',
  SHOWDOWN_FOCUS = 'showdown_focus',
  CHAIN_RESPONSE = 'chain_response',
  RELEVANT_PLAYER = 'relevant_player'
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

export interface GameEvent {
  id: string;
  gameId: string;
  type: EventType;
  playerId?: string;
  cardId?: string;
  battlefieldId?: string;
  timestamp: Date;
  data: any;
}

export enum EventType {
  GAME_START = 'game_start',
  TURN_START = 'turn_start',
  TURN_END = 'turn_end',
  PHASE_CHANGE = 'phase_change',
  CARD_PLAYED = 'card_played',
  CARD_DRAWN = 'card_drawn',
  UNIT_MOVED = 'unit_moved',
  COMBAT_START = 'combat_start',
  COMBAT_DAMAGE = 'combat_damage',
  COMBAT_END = 'combat_end',
  SHOWDOWN_START = 'showdown_start',
  SHOWDOWN_END = 'showdown_end',
  BATTLEFIELD_SCORED = 'battlefield_scored',
  GAME_END = 'game_end',
  ABILITY_ACTIVATED = 'ability_activated',
  SPELL_CAST = 'spell_cast',
  UNIT_DIED = 'unit_died',
  RUNE_CHANNELED = 'rune_channeled',
  BURN_OUT = 'burn_out',
  // V2 Scripting System Events
  RUNE_RECYCLE = 'rune_recycle',
  UNIT_PLAYED = 'unit_played',
  UNIT_DEATH = 'unit_death',
  ATTACK = 'attack'
}

// ============================================================================
// SPECIAL GAME STATES
// ============================================================================

export interface BurnOutEvent {
  id: string;
  playerId: string; // Player who burned out
  opponentId: string; // Opponent who gains point
  pointsAwarded: number;
  deckWasEmpty: boolean;
  trashWasEmpty: boolean;
  timestamp: Date;
}

/**
 * GameCard - Instance of a card in a game.
 *
 * Extends BaseCard to include all card definition properties (cardType, energyCost, domains, etc.)
 * plus game-specific instance state (instanceId, controllerId, zone, ready, damage).
 *
 * This design allows card scripts to access card properties directly without lookups:
 * - ctx.self.cardType (instead of lookup by cardId)
 * - ctx.self.domains (instead of lookup by cardId)
 * - ctx.self.energyCost (can be modified by cost reduction effects)
 *
 * Properties from BaseCard that can change during the game are redefined as mutable.
 */
export interface GameCard extends Omit<BaseCard, 'energyCost'> {
  // ===== Instance Properties =====
  instanceId: string; // Unique instance in this game
  cardId: string; // Reference to original card definition
  controllerId: string;
  ownerId: string;
  zone: string;
  position?: number; // Position in zone if ordered
  ready: boolean; // Ready vs Exhausted state
  damage: number; // Current damage (only relevant in Board Zones)

  // ===== Mutable Properties (can change during game) =====
  energyCost: number; // Can be modified by cost reduction/increase effects
  might?: number; // Optional - only present on units/champions, can be modified by buffs/debuffs

  // ===== Temporary State =====
  temporaryModifiers: TemporaryModifier[];
  counters: Counter[];
}

/**
 * Type guards for checking card types.
 * These return boolean, not narrowed types, to avoid TypeScript conflicts.
 * Cards have might? as optional property, so after checking isUnitCard(),
 * you can safely access card.might with ?? operator for default value.
 */

/**
 * Check if a GameCard is a unit or champion.
 * Units have might property.
 */
export function isUnitCard(card: GameCard): boolean {
  return card.cardType === 'unit' || card.cardType === 'champion';
}

/**
 * Check if a GameCard is a spell.
 */
export function isSpellCard(card: GameCard): boolean {
  return card.cardType === 'spell';
}

/**
 * Check if a GameCard is a gear.
 */
export function isGearCard(card: GameCard): boolean {
  return card.cardType === 'gear';
}

/**
 * Check if a GameCard is a rune.
 */
export function isRuneCard(card: GameCard): boolean {
  return card.cardType === 'rune';
}

/**
 * Check if a GameCard is a legend.
 */
export function isLegendCard(card: GameCard): boolean {
  return card.cardType === 'legend';
}

/**
 * Check if a GameCard is a battlefield.
 */
export function isBattlefieldCard(card: GameCard): boolean {
  return card.cardType === 'battlefield';
}

export interface TemporaryModifier {
  type: ModifierType;
  value: number;
  duration: EffectDuration;
  source: string; // Source card/ability ID
}

export enum ModifierType {
  MIGHT_BONUS = 'might_bonus',
  COST_REDUCTION = 'cost_reduction',
  KEYWORD_GRANT = 'keyword_grant'
}

export interface Counter {
  type: CounterType;
  amount: number;
}

export enum CounterType {
  BUFF = 'buff',
  DAMAGE = 'damage',
  CHARGE = 'charge'
}