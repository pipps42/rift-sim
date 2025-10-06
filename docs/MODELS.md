# Riftbound Simulator - Data Models Documentation

This document outlines all the data models required to implement the Riftbound TCG simulator based on the official game rules.

## Core Game Entities

### Player
```typescript
interface Player {
  id: string;
  name: string;
  score: number; // Current victory points (goal: 8)
  championLegend: ChampionLegendCard;
  chosenChampion?: UnitCard; // Starts in Champion Zone
  zones: PlayerZones;
  runePool: RunePool;
  hasPlayedCard: boolean; // For turn tracking
  turnsPassed: number;
}
```

### Game
```typescript
interface Game {
  id: string;
  players: [Player, Player]; // Exactly 2 players (1v1)
  currentPlayerIndex: 0 | 1;
  phase: GamePhase;
  turnState: TurnState;
  round: number;
  winner?: string; // Player ID of winner
  status: GameStatus;
  battlefields: Battlefield[];
  chain: ChainItem[];
  combatState?: CombatState;
  showdownState?: ShowdownState;
  createdAt: Date;
  updatedAt: Date;
}

enum GamePhase {
  AWAKEN = 'awaken',
  BEGINNING = 'beginning',
  CHANNEL = 'channel',
  DRAW = 'draw',
  ACTION = 'action',
  ENDING = 'ending',
  EXPIRATION = 'expiration',
  CLEANUP = 'cleanup'
}

enum TurnState {
  NEUTRAL_OPEN = 'neutral_open',
  NEUTRAL_CLOSED = 'neutral_closed',
  SHOWDOWN_OPEN = 'showdown_open',
  SHOWDOWN_CLOSED = 'showdown_closed'
}

enum GameStatus {
  SETUP = 'setup',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  ABANDONED = 'abandoned'
}
```

## Card System

### Base Card Interface
```typescript
interface BaseCard {
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
}

interface PowerCost {
  domain: Domain;
  amount: number;
}

enum CardType {
  UNIT = 'unit',
  GEAR = 'gear',
  SPELL = 'spell',
  RUNE = 'rune',
  CHAMPION_LEGEND = 'champion_legend',
  BATTLEFIELD = 'battlefield'
}

enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  MYTHIC = 'mythic'
}

enum Domain {
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
```

### Specific Card Types

#### Unit Card
```typescript
interface UnitCard extends BaseCard {
  cardType: CardType.UNIT;
  might: number; // Combat value and health threshold
  subtypes: UnitSubtype[];
  abilities: Ability[];
}

enum UnitSubtype {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  BEAST = 'beast',
  DRAGON = 'dragon',
  ELEMENTAL = 'elemental',
  CONSTRUCT = 'construct',
  SPIRIT = 'spirit',
  CHAMPION = 'champion'
}
```

#### Champion Legend Card
```typescript
interface ChampionLegendCard extends BaseCard {
  cardType: CardType.CHAMPION_LEGEND;
  domainIdentity: Domain[]; // Defines deck building restrictions
  championTag: string; // Tag that Chosen Champion must have
  legendaryAbility: Ability;
}
```

#### Gear Card
```typescript
interface GearCard extends BaseCard {
  cardType: CardType.GEAR;
  gearType: GearType;
  abilities: Ability[];
}

enum GearType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESSORY = 'accessory',
  ARTIFACT = 'artifact'
}
```

#### Spell Card
```typescript
interface SpellCard extends BaseCard {
  cardType: CardType.SPELL;
  spellTiming: SpellTiming;
  targetRequirements?: TargetRequirement[];
  effects: Effect[];
}

enum SpellTiming {
  NORMAL = 'normal', // Default: playable only during Neutral Open in own turn
  ACTION = 'action', // Also playable during Showdowns
  REACTION = 'reaction' // Playable anytime (even during Closed State)
}
```

#### Rune Card
```typescript
interface RuneCard extends BaseCard {
  cardType: CardType.RUNE;
  isBasicRune: boolean;
  abilities: Ability[]; // Typically [T]: Add [1] and Recycle this: Add [C]
}
```

#### Battlefield Card
```typescript
interface BattlefieldCard extends BaseCard {
  cardType: CardType.BATTLEFIELD;
  battlefieldAbilities: Ability[];
  scoreValue: number; // Points awarded for controlling this battlefield
}
```

## Zone System

### Board Zones vs Non-Board Zones
```typescript
interface PlayerZones {
  // Board Zones
  base: GameCard[]; // Personal location, always controlled
  runes: RuneCard[]; // Runes channeled to the board

  // Non-Board Zones
  hand: GameCard[];
  mainDeck: GameCard[];
  runeDeck: RuneCard[];
  championZone: UnitCard[]; // Starts with Chosen Champion
  trash: GameCard[];
  banishment: GameCard[];
}

interface GlobalZones {
  legendZone: ChampionLegendCard[]; // Champion Legends (cannot be moved/removed)
  battlefieldZone: Battlefield[];
  facedownZones: { [battlefieldId: string]: GameCard[] }; // Hidden cards
}

interface Battlefield {
  id: string;
  card: BattlefieldCard;
  units: GameCard[]; // Units currently at this battlefield
  controller?: string; // Player ID who controls this battlefield
  contested: boolean; // Status when units from different players arrive
  facedownCards: GameCard[]; // Hidden cards at this battlefield
}
```

## Game State Models

### Deck Building
```typescript
interface Deck {
  id: string;
  name: string;
  playerId: string;
  championLegend: string; // Champion Legend card ID
  chosenChampion: string; // Chosen Champion card ID
  mainDeck: DeckCard[]; // Minimum 40 cards
  runeDeck: DeckCard[]; // Exactly 12 cards
  battlefields: string[]; // Exactly 3 battlefield card IDs
  isValid: boolean;
  validationErrors: DeckValidationError[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeckCard {
  cardId: string;
  quantity: number; // Max 3 copies per card name, max 3 Signature cards total
}

interface DeckValidationError {
  type: ValidationErrorType;
  message: string;
  cardId?: string;
}

enum ValidationErrorType {
  INVALID_MAIN_DECK_SIZE = 'invalid_main_deck_size',
  INVALID_RUNE_DECK_SIZE = 'invalid_rune_deck_size',
  TOO_MANY_COPIES = 'too_many_copies',
  INVALID_DOMAIN_IDENTITY = 'invalid_domain_identity',
  TOO_MANY_SIGNATURE_CARDS = 'too_many_signature_cards',
  MISSING_CHOSEN_CHAMPION = 'missing_chosen_champion',
  WRONG_BATTLEFIELD_COUNT = 'wrong_battlefield_count'
}
```

## Combat System

### Combat State
```typescript
interface CombatState {
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

interface CombatUnit {
  cardId: string;
  might: number;
  keywords: Keyword[];
  damage: number; // Current damage received
  hasAssaultBonus: boolean; // For attacking units with Assault
  hasShieldBonus: boolean; // For defending units with Shield
  isStunned: boolean; // Stunned units don't contribute damage
}

interface DamageDistribution {
  targetCardId: string;
  damage: number;
  isLethalDamage: boolean; // damage >= target's Might
}

enum CombatStep {
  SHOWDOWN = 'showdown',
  COMBAT_DAMAGE = 'combat_damage',
  RESOLUTION = 'resolution'
}
```

### Showdown State
```typescript
interface ShowdownState {
  battlefield: string;
  relevantPlayers: string[]; // Players involved in the showdown
  focusPlayer: string; // Player who currently has Focus
  initialChainCreated: boolean;
}
```

## Scoring System

### Scoring Models
```typescript
interface ScoringEvent {
  id: string;
  playerId: string;
  battlefieldId: string;
  scoringMethod: ScoringMethod;
  pointsAwarded: number;
  isFinalPoint: boolean;
  timestamp: Date;
}

enum ScoringMethod {
  HOLD = 'hold', // Controlling battlefield during Beginning Phase
  CONQUER = 'conquer' // Gaining control during the turn
}

interface BattlefieldControl {
  battlefieldId: string;
  controllerId?: string;
  contested: boolean;
  scoredThisTurn: boolean; // Prevents double-scoring same battlefield
}
```

## Chain and Resolution System

### Chain Models
```typescript
interface ChainItem {
  id: string;
  type: ChainItemType;
  sourceCardId?: string;
  sourceAbilityId?: string;
  controllerId: string;
  targets: Target[];
  effects: Effect[];
  spellTiming?: SpellTiming; // For spells
  timestamp: Date;
  resolved: boolean;
}

enum ChainItemType {
  SPELL = 'spell',
  ACTIVATED_ABILITY = 'activated_ability',
  TRIGGERED_ABILITY = 'triggered_ability'
}

interface Target {
  type: TargetType;
  cardId?: string;
  playerId?: string;
  battlefieldId?: string;
  restrictions: TargetRestriction[];
}

enum TargetType {
  UNIT = 'unit',
  GEAR = 'gear',
  PLAYER = 'player',
  BATTLEFIELD = 'battlefield',
  CARD_IN_HAND = 'card_in_hand',
  CARD_IN_TRASH = 'card_in_trash'
}

interface TargetRestriction {
  property: TargetProperty;
  operator: ComparisonOperator;
  value: any;
}

enum TargetProperty {
  CARD_TYPE = 'card_type',
  MIGHT = 'might',
  ENERGY_COST = 'energy_cost',
  DOMAIN = 'domain',
  KEYWORD = 'keyword',
  TAG = 'tag'
}

enum ComparisonOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains'
}
```

## Rune Pool and Cost System

### Rune Pool Models
```typescript
interface RunePool {
  energy: number; // Generic colorless resource
  power: PowerPool[]; // Domain-specific resources
}

interface PowerPool {
  domain: Domain;
  amount: number;
}

interface CostPayment {
  energyPaid: number;
  powerPaid: PowerPool[];
  additionalCosts: AdditionalCost[];
}

interface AdditionalCost {
  type: CostType;
  description: string;
  paid: boolean;
}

enum CostType {
  EXHAUST_UNIT = 'exhaust_unit',
  DISCARD_CARD = 'discard_card',
  SACRIFICE_UNIT = 'sacrifice_unit'
}
```

## Keyword System

### Keywords
```typescript
enum Keyword {
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
```

### Ability System
```typescript
interface Ability {
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

enum AbilityType {
  ACTIVATED = 'activated', // [Cost]: Effect
  TRIGGERED = 'triggered', // When/At X: Effect
  STATIC = 'static', // Continuous effect
  REPLACEMENT = 'replacement' // Instead of X, Y
}

enum AbilityTiming {
  NORMAL = 'normal',
  ACTION = 'action',
  REACTION = 'reaction'
}

enum AbilityTrigger {
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

interface Effect {
  type: EffectType;
  value?: number;
  duration?: EffectDuration;
  targetIds?: string[];
  description: string;
}

enum EffectType {
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

enum EffectDuration {
  INSTANT = 'instant',
  END_OF_TURN = 'end_of_turn',
  PERMANENT = 'permanent',
  WHILE_IN_PLAY = 'while_in_play'
}
```

## Game Actions

### Action System
```typescript
interface GameAction {
  id: string;
  type: ActionType;
  playerId: string;
  data: ActionData;
  timestamp: Date;
  resolved: boolean;
}

enum ActionType {
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

interface ActionData {
  cardId?: string;
  abilityId?: string;
  targetIds?: string[];
  fromZone?: string;
  toZone?: string;
  battlefieldId?: string;
  amount?: number;
  additionalData?: any;
}
```

## Priority and Focus System

```typescript
interface PriorityState {
  currentPlayer: string; // Who has priority
  focusPlayer?: string; // Who has focus during showdowns
  relevantPlayers: string[]; // Players who can act
  passedPlayers: string[]; // Players who have passed this round
  waitingForPlayer?: string; // Specific player we're waiting for
}

enum PriorityReason {
  ACTION_PHASE = 'action_phase',
  SHOWDOWN_FOCUS = 'showdown_focus',
  CHAIN_RESPONSE = 'chain_response',
  RELEVANT_PLAYER = 'relevant_player'
}
```

## Event System

```typescript
interface GameEvent {
  id: string;
  gameId: string;
  type: EventType;
  playerId?: string;
  cardId?: string;
  battlefieldId?: string;
  timestamp: Date;
  data: any;
}

enum EventType {
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
  BURN_OUT = 'burn_out'
}
```

## Special Game States

### Burn Out
```typescript
interface BurnOutEvent {
  id: string;
  playerId: string; // Player who burned out
  opponentId: string; // Opponent who gains point
  pointsAwarded: number;
  deckWasEmpty: boolean;
  trashWasEmpty: boolean;
  timestamp: Date;
}
```

### Game Object States
```typescript
interface GameCard {
  instanceId: string; // Unique instance in this game
  cardId: string; // Reference to card definition
  controllerId: string;
  ownerId: string;
  zone: string;
  position?: number; // Position in zone if ordered
  ready: boolean; // Ready vs Exhausted state
  damage: number; // Current damage (only relevant in Board Zones)
  temporaryModifiers: TemporaryModifier[];
  counters: Counter[];
}

interface TemporaryModifier {
  type: ModifierType;
  value: number;
  duration: EffectDuration;
  source: string; // Source card/ability ID
}

enum ModifierType {
  MIGHT_BONUS = 'might_bonus',
  COST_REDUCTION = 'cost_reduction',
  KEYWORD_GRANT = 'keyword_grant'
}

interface Counter {
  type: CounterType;
  amount: number;
}

enum CounterType {
  BUFF = 'buff',
  DAMAGE = 'damage',
  CHARGE = 'charge'
}
```

This comprehensive model structure provides the foundation for implementing all Riftbound TCG mechanics, following the actual game rules including the proper terminology and systems (scoring to 8 points, Domain Identity, Energy/Power costs, Might-based combat, Battlefield control, etc.).