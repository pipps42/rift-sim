# Riftbound Simulator - Game Engine Architecture

This document outlines the architecture and components of the Riftbound TCG game engine, designed to handle all game mechanics, state management, and rule enforcement according to the Riftbound rules.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Web Client    │  │  Mobile Client  │  │  Admin Panel │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/WebSocket
┌─────────────────────────┴───────────────────────────────────┐
│                    API Gateway                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Authentication  │  │ Rate Limiting   │  │   Routing    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                Riftbound Game Engine Core                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Game Manager   │  │  Rule Engine    │  │ Event System │ │
│  │                 │  │                 │  │              │ │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌──────────┐ │ │
│  │ │ Game State  │ │  │ │ Validators  │ │  │ │Event Bus │ │ │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └──────────┘ │ │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌──────────┐ │ │
│  │ │Turn Manager │ │  │ │Chain System │ │  │ │Listeners │ │ │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └──────────┘ │ │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │              │ │
│  │ │Priority Mgr │ │  │ │Effect System│ │  │              │ │
│  │ └─────────────┘ │  │ └─────────────┘ │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │Battlefield Mgr  │  │ Rune Pool Mgr   │  │Scoring Mgr   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                    Data Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   PostgreSQL    │  │     Redis       │  │  File System │ │
│  │  (Game Data)    │  │   (Sessions)    │  │  (Card Art)  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Engine Components

### 1. Game Manager
Central orchestrator for all Riftbound game operations.

```typescript
class GameManager {
  private games: Map<string, Game> = new Map();
  private turnManager: TurnManager;
  private ruleEngine: RuleEngine;
  private eventBus: EventBus;
  private battlefieldManager: BattlefieldManager;
  private scoringManager: ScoringManager;

  // Core game lifecycle
  async createGame(players: Player[], decks: Deck[]): Promise<Game>
  async joinGame(gameId: string, player: Player): Promise<void>
  async startGame(gameId: string): Promise<void>
  async endGame(gameId: string, reason: GameEndReason): Promise<void>

  // Riftbound-specific actions
  async playCard(gameId: string, playerId: string, cardId: string, targets?: Target[]): Promise<ActionResult>
  async standardMove(gameId: string, playerId: string, unitId: string, toBattlefield: string): Promise<ActionResult>
  async hideCard(gameId: string, playerId: string, cardId: string, battlefieldId: string): Promise<ActionResult>
  async activateAbility(gameId: string, playerId: string, abilityId: string, targets?: Target[]): Promise<ActionResult>
  async passPriority(gameId: string, playerId: string): Promise<ActionResult>
  async surrender(gameId: string, playerId: string): Promise<void>

  // Deck building validation
  async validateDeck(deck: Deck): Promise<DeckValidationResult>

  private async setupGame(game: Game): Promise<void>
  private async performMulligan(game: Game): Promise<void>
}
```

### 2. Turn Manager
Handles Riftbound's specific turn structure and phase transitions.

```typescript
class TurnManager {
  private eventBus: EventBus;
  private runePoolManager: RunePoolManager;

  async startTurn(game: Game): Promise<void>
  async nextPhase(game: Game): Promise<void>
  async endTurn(game: Game): Promise<void>

  // Riftbound phase implementations
  private async executeAwakenPhase(game: Game): Promise<void>
  private async executeBeginningPhase(game: Game): Promise<void>
  private async executeChannelPhase(game: Game): Promise<void>
  private async executeDrawPhase(game: Game): Promise<void>
  private async executeActionPhase(game: Game): Promise<void>
  private async executeEndingPhase(game: Game): Promise<void>
  private async executeExpirationPhase(game: Game): Promise<void>
  private async executeCleanupPhase(game: Game): Promise<void>

  // Phase-specific actions
  private async awakenAllCards(game: Game, playerId: string): Promise<void>
  private async checkScoring(game: Game, playerId: string): Promise<void>
  private async channelRunes(game: Game, playerId: string, count: number): Promise<void>
  private async drawCard(game: Game, playerId: string): Promise<void>
  private async clearRunePool(game: Game, playerId: string): Promise<void>
  private async removeTemporaryEffects(game: Game): Promise<void>
  private async performCleanup(game: Game): Promise<void>
}
```

### 3. Rule Engine
Validates actions and enforces Riftbound game rules.

```typescript
class RuleEngine {
  private validators: Map<ActionType, ActionValidator[]> = new Map();
  private chainSystem: ChainSystem;

  validateAction(game: Game, action: GameAction): ValidationResult
  canPlayCard(game: Game, playerId: string, cardId: string): boolean
  canStandardMove(game: Game, unitId: string, toBattlefield: string): boolean
  canActivateAbility(game: Game, abilityId: string): boolean

  // Riftbound-specific validations
  private validateDomainIdentity(deck: Deck): boolean
  private validateEnergyAndPowerCosts(game: Game, playerId: string, card: Card): boolean
  private validateMovementRestrictions(game: Game, unitId: string, toBattlefield: string): boolean
  private validateSignatureCards(deck: Deck): boolean
  private validateBattlefieldControl(game: Game, battlefieldId: string): boolean
  private validateSpellTiming(game: Game, spell: SpellCard): boolean
}
```

### 4. Chain System
Manages spell and ability resolution using Riftbound's Chain system.

```typescript
class ChainSystem {
  private chain: ChainItem[] = [];
  private eventBus: EventBus;

  push(item: ChainItem): void
  async resolve(game: Game): Promise<void>
  peek(): ChainItem | undefined
  isEmpty(): boolean
  canAddToChain(game: Game, item: ChainItem): boolean

  // Riftbound-specific chain handling
  private async checkTriggeredAbilities(game: Game, event: GameEvent): Promise<void>
  private async resolveChainItem(game: Game, item: ChainItem): Promise<void>
  private validateSpellTiming(game: Game, timing: SpellTiming): boolean
  private checkReactionWindow(game: Game): boolean
}
```

### 5. Combat and Showdown Manager
Handles Riftbound's combat system with Showdowns and Battlefield control.

```typescript
class CombatManager {
  private eventBus: EventBus;
  private battlefieldManager: BattlefieldManager;

  async initiateShowdown(game: Game, battlefieldId: string): Promise<void>
  async initiateCombat(game: Game, battlefieldId: string): Promise<void>
  async resolveCombatDamage(game: Game, combat: CombatState): Promise<void>

  // Riftbound combat mechanics
  private async applyAssaultBonuses(combat: CombatState): Promise<void>
  private async applyShieldBonuses(combat: CombatState): Promise<void>
  private async distributeDamage(game: Game, combat: CombatState): Promise<void>
  private async handleTankKeyword(combat: CombatState): Promise<void>
  private async checkMightThresholds(game: Game, units: CombatUnit[]): Promise<void>
  private async handleConquer(game: Game, battlefieldId: string, winnerId: string): Promise<void>
}
```

### 6. Battlefield Manager
Manages battlefield control, movement, and Contested status.

```typescript
class BattlefieldManager {
  private eventBus: EventBus;

  async moveUnitToBattlefield(game: Game, unitId: string, battlefieldId: string): Promise<void>
  async checkBattlefieldControl(game: Game, battlefieldId: string): Promise<string | null>
  async setContested(game: Game, battlefieldId: string, contested: boolean): Promise<void>
  async recallUnitsToBase(game: Game, units: string[], playerId: string): Promise<void>

  // Movement validation
  canMoveToOccupiedBattlefield(game: Game, unitId: string, battlefieldId: string): boolean
  validateGankingMovement(game: Game, unitId: string, fromBattlefield: string, toBattlefield: string): boolean

  private async triggerBattlefieldAbilities(game: Game, battlefieldId: string): Promise<void>
  private async checkCombatTrigger(game: Game, battlefieldId: string): Promise<void>
}
```

### 7. Rune Pool Manager
Manages Energy and Power resources according to Riftbound rules.

```typescript
class RunePoolManager {
  private eventBus: EventBus;

  async channelRunes(game: Game, playerId: string, count: number): Promise<void>
  async addEnergy(game: Game, playerId: string, amount: number): Promise<void>
  async addPower(game: Game, playerId: string, domain: Domain, amount: number): Promise<void>
  async payEnergyCost(game: Game, playerId: string, amount: number): Promise<boolean>
  async payPowerCost(game: Game, playerId: string, costs: PowerCost[]): Promise<boolean>
  async clearRunePool(game: Game, playerId: string): Promise<void>

  canAffordCard(game: Game, playerId: string, card: Card): boolean
  getAvailableEnergy(game: Game, playerId: string): number
  getAvailablePower(game: Game, playerId: string, domain: Domain): number

  private async recycleRune(game: Game, playerId: string, runeId: string): Promise<void>
  private async handleBasicRuneAbilities(game: Game, rune: RuneCard): Promise<void>
}
```

### 8. Scoring Manager
Handles Riftbound's victory condition system (Hold, Conquer, 8-point victory).

```typescript
class ScoringManager {
  private eventBus: EventBus;

  async checkHoldScoring(game: Game, playerId: string): Promise<void>
  async checkConquerScoring(game: Game, playerId: string, battlefieldId: string): Promise<void>
  async awardPoints(game: Game, playerId: string, points: number, method: ScoringMethod, battlefieldId: string): Promise<void>
  async checkVictoryCondition(game: Game): Promise<string | null>

  // Final point special rules
  private async handleFinalPoint(game: Game, playerId: string, method: ScoringMethod, battlefieldId: string): Promise<void>
  private async checkAllBattlefieldsScored(game: Game, playerId: string): Promise<boolean>
  private canScoreBattlefield(game: Game, battlefieldId: string, playerId: string): boolean
}
```

### 9. Priority and Focus Manager
Manages Priority, Focus, and Relevant Players according to Riftbound rules.

```typescript
class PriorityManager {
  private eventBus: EventBus;

  async assignPriority(game: Game, playerId: string, reason: PriorityReason): Promise<void>
  async assignFocus(game: Game, playerId: string): Promise<void>
  async passPriority(game: Game, playerId: string): Promise<void>
  async determineRelevantPlayers(game: Game, context: GameContext): Promise<string[]>

  hasPriority(game: Game, playerId: string): boolean
  hasFocus(game: Game, playerId: string): boolean
  canTakeAction(game: Game, playerId: string): boolean

  private async checkPriorityTransition(game: Game): Promise<void>
  private async handleFocusTransition(game: Game): Promise<void>
  private async invitePlayer(game: Game, playerId: string): Promise<void>
}
```

### 10. Effect System
Manages all card effects, abilities, and triggers according to Riftbound mechanics.

```typescript
class EffectSystem {
  private eventBus: EventBus;
  private chainSystem: ChainSystem;

  async resolveEffect(game: Game, effect: Effect): Promise<void>
  async triggerAbilities(game: Game, event: GameEvent): Promise<void>
  registerTrigger(trigger: AbilityTrigger, callback: TriggerCallback): void

  // Riftbound-specific effects
  private async damageEffect(game: Game, targets: Target[], amount: number): Promise<void>
  private async mightBuffEffect(game: Game, targets: Target[], bonus: number): Promise<void>
  private async moveUnitEffect(game: Game, unitId: string, destination: string): Promise<void>
  private async exhaustEffect(game: Game, targets: Target[]): Promise<void>
  private async readyEffect(game: Game, targets: Target[]): Promise<void>
  private async stunEffect(game: Game, targets: Target[]): Promise<void>
  private async addKeywordEffect(game: Game, targets: Target[], keyword: Keyword): Promise<void>
  private async createTokenEffect(game: Game, tokenCard: Card, location: string): Promise<void>
}
```

### 11. Event System
Decoupled event-driven architecture for Riftbound game events.

```typescript
class EventBus {
  private listeners: Map<EventType, EventListener[]> = new Map();

  emit(event: GameEvent): void
  on(eventType: EventType, listener: EventListener): void
  off(eventType: EventType, listener: EventListener): void

  private notifyListeners(event: GameEvent): void
}

interface EventListener {
  priority: number;
  callback: (event: GameEvent) => Promise<void>;
}

// Riftbound-specific events
enum RiftboundEventType {
  // Phase events
  AWAKEN_PHASE = 'awaken_phase',
  BEGINNING_PHASE = 'beginning_phase',
  CHANNEL_PHASE = 'channel_phase',

  // Battlefield events
  UNIT_MOVED = 'unit_moved',
  BATTLEFIELD_CONTESTED = 'battlefield_contested',
  BATTLEFIELD_SCORED = 'battlefield_scored',

  // Combat events
  SHOWDOWN_START = 'showdown_start',
  COMBAT_DAMAGE_DEALT = 'combat_damage_dealt',
  UNIT_MIGHT_REACHED = 'unit_might_reached',

  // Resource events
  RUNE_CHANNELED = 'rune_channeled',
  ENERGY_ADDED = 'energy_added',
  POWER_ADDED = 'power_added',
  RUNE_POOL_CLEARED = 'rune_pool_cleared',

  // Special events
  BURN_OUT = 'burn_out',
  FINAL_POINT_ATTEMPT = 'final_point_attempt'
}
```

## State Management

### Game State Store
```typescript
class GameStateStore {
  private redis: RedisClient;
  private postgres: PostgreSQLClient;

  // Game state persistence
  async saveGameState(gameId: string, state: GameState): Promise<void>
  async loadGameState(gameId: string): Promise<GameState | null>
  async deleteGameState(gameId: string): Promise<void>

  // Riftbound-specific state
  async saveRunePoolState(gameId: string, playerId: string, pool: RunePool): Promise<void>
  async saveBattlefieldStates(gameId: string, battlefields: Battlefield[]): Promise<void>
  async saveChainState(gameId: string, chain: ChainItem[]): Promise<void>

  // Player session management
  async savePlayerSession(playerId: string, session: PlayerSession): Promise<void>
  async getPlayerSession(playerId: string): Promise<PlayerSession | null>

  // Game history and replay
  async saveGameEvent(event: GameEvent): Promise<void>
  async getGameHistory(gameId: string): Promise<GameEvent[]>
  async createGameReplay(gameId: string): Promise<GameReplay>
}
```

### State Synchronization
```typescript
class StateSynchronizer {
  private websocketManager: WebSocketManager;

  async broadcastGameState(gameId: string, state: GameState): Promise<void>
  async sendPlayerUpdate(playerId: string, update: PlayerUpdate): Promise<void>
  async notifySpectators(gameId: string, event: GameEvent): Promise<void>

  // Riftbound-specific synchronization
  async broadcastBattlefieldUpdate(gameId: string, battlefield: Battlefield): Promise<void>
  async broadcastRunePoolUpdate(gameId: string, playerId: string, pool: RunePool): Promise<void>
  async broadcastPriorityChange(gameId: string, priorityState: PriorityState): Promise<void>

  private filterStateForPlayer(state: GameState, playerId: string): FilteredGameState
  private filterHiddenInformation(state: GameState, playerId: string): GameState
}
```

## Input Validation and Security

### Action Validator
```typescript
class ActionValidator {
  validatePlayCard(game: Game, playerId: string, action: PlayCardAction): ValidationResult
  validateStandardMove(game: Game, playerId: string, action: MoveAction): ValidationResult
  validateAbilityActivation(game: Game, playerId: string, action: AbilityAction): ValidationResult

  // Riftbound-specific validations
  private validatePlayerHasPriority(game: Game, playerId: string): boolean
  private validatePhaseRestrictions(game: Game, action: GameAction): boolean
  private validateEnergyAndPowerRequirements(game: Game, playerId: string, costs: CostPayment): boolean
  private validateDomainIdentityCompliance(deck: Deck): boolean
  private validateMovementRestrictions(game: Game, unitId: string, destination: string): boolean
}
```

### Anti-Cheat System
```typescript
class AntiCheatSystem {
  private suspiciousActions: Map<string, SuspiciousAction[]> = new Map();

  validateActionTiming(playerId: string, action: GameAction): boolean
  checkActionFrequency(playerId: string): boolean
  validateGameStateConsistency(game: Game): boolean

  // Riftbound-specific anti-cheat
  private validateRunePoolConsistency(game: Game, playerId: string): boolean
  private validateBattlefieldControlIntegrity(game: Game): boolean
  private validateChainResolutionOrder(game: Game): boolean
  private validateScoringIntegrity(game: Game): boolean

  private flagSuspiciousActivity(playerId: string, reason: string): void
  private checkReplayConsistency(gameId: string): Promise<boolean>
}
```

## AI and Automation

### AI Player Interface
```typescript
interface RiftboundAIPlayer {
  id: string;
  difficulty: AIDifficulty;
  makeDecision(game: Game, availableActions: GameAction[]): Promise<GameAction>
  evaluateGameState(game: Game): GameStateEvaluation

  // Riftbound-specific AI decisions
  chooseBattlefieldToAttack(game: Game, availableBattlefields: string[]): Promise<string>
  prioritizeScoring(game: Game, scoringOpportunities: ScoringOpportunity[]): Promise<ScoringOpportunity>
  manageRunePool(game: Game, availableRunes: RuneCard[]): Promise<RuneCard[]>
}

enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}
```

### Deck Builder AI
```typescript
class RiftboundDeckBuilderAI {
  async generateDeck(championLegend: ChampionLegendCard, strategy: DeckStrategy): Promise<Deck>
  async suggestCardReplacements(deck: Deck, meta: MetaAnalysis): Promise<CardSuggestion[]>

  // Riftbound-specific deck building
  private validateDomainIdentity(deck: Deck, championLegend: ChampionLegendCard): boolean
  private optimizeEnergyCurve(deck: Deck): DeckCard[]
  private balanceSignatureCards(deck: Deck): DeckCard[]
  private calculateDomainSynergy(cards: Card[], domains: Domain[]): number
  private evaluateRuneDeckComposition(runeDeck: RuneCard[]): RuneDeckAnalysis
}
```

## Testing Framework

### Game Simulator
```typescript
class RiftboundGameSimulator {
  async simulateGame(deck1: Deck, deck2: Deck, iterations: number): Promise<SimulationResult>
  async testCardBalance(card: Card, environment: TestEnvironment): Promise<BalanceReport>
  async validateRuleImplementation(rule: GameRule): Promise<ValidationReport>

  // Riftbound-specific testing
  async testScoringMechanics(scenarios: ScoringScenario[]): Promise<ScoringTestResult>
  async testBattlefieldControl(scenarios: BattlefieldScenario[]): Promise<BattlefieldTestResult>
  async testChainResolution(scenarios: ChainScenario[]): Promise<ChainTestResult>
  async testCombatMechanics(scenarios: CombatScenario[]): Promise<CombatTestResult>

  private createTestGame(decks: Deck[]): Game
  private executeRandomActions(game: Game): Promise<void>
  private validateFinalGameState(game: Game): ValidationResult
}
```

### Integration Testing
```typescript
class RiftboundEngineTests {
  async testGameFlow(): Promise<TestResult>
  async testTurnStructure(): Promise<TestResult>
  async testShowdownMechanics(): Promise<TestResult>
  async testChainResolution(): Promise<TestResult>
  async testKeywordInteractions(): Promise<TestResult>
  async testScoringSystem(): Promise<TestResult>
  async testBurnOutMechanics(): Promise<TestResult>

  private setupTestGame(): Game
  private assertGameState(game: Game, expectedState: Partial<GameState>): void
  private simulateFullGame(deck1: Deck, deck2: Deck): Promise<Game>
}
```

## Performance and Monitoring

### Performance Monitor
```typescript
class RiftboundPerformanceMonitor {
  private metrics: Map<string, Metric[]> = new Map();

  recordActionLatency(action: string, duration: number): void
  recordChainResolutionTime(chainLength: number, duration: number): void
  recordCombatResolutionTime(unitsCount: number, duration: number): void
  recordMemoryUsage(gameId: string, usage: number): void
  recordConcurrentGames(count: number): void

  generatePerformanceReport(): PerformanceReport
  checkPerformanceThresholds(): Alert[]

  // Riftbound-specific metrics
  private trackRunePoolOperations(): void
  private trackBattlefieldStateChanges(): void
  private trackScoringPerformance(): void
}
```

### Game Analytics
```typescript
class RiftboundGameAnalytics {
  async trackCardUsage(cardId: string, context: UsageContext): Promise<void>
  async trackWinRates(deckArchetype: string, winRate: number): Promise<void>
  async trackScoringPatterns(method: ScoringMethod, timing: number): Promise<void>
  async generateMetaReport(): Promise<RiftboundMetaReport>

  // Riftbound-specific analytics
  private calculateDomainPopularity(): DomainPopularity[]
  private analyzeBattlefieldControlPatterns(): BattlefieldPattern[]
  private identifyBalanceIssues(): BalanceIssue[]
  private trackKeywordEffectiveness(): KeywordAnalysis[]
}
```

## Error Handling and Recovery

### Error Handler
```typescript
class RiftboundGameErrorHandler {
  async handleGameError(error: GameError, game: Game): Promise<void>
  async recoverFromDesync(gameId: string): Promise<boolean>
  async rollbackToLastValidState(gameId: string): Promise<void>

  // Riftbound-specific error recovery
  async recoverFromChainCorruption(gameId: string): Promise<void>
  async recoverFromBattlefieldDesync(gameId: string): Promise<void>
  async recoverFromRunePoolInconsistency(gameId: string, playerId: string): Promise<void>
  async recoverFromScoringError(gameId: string): Promise<void>

  private logError(error: GameError, context: ErrorContext): void
  private notifyPlayers(gameId: string, message: string): void
  private createErrorReport(error: GameError, game: Game): ErrorReport
}
```

This architecture provides a robust, scalable foundation for implementing the complete Riftbound TCG simulator while maintaining performance, security, and extensibility according to the actual Riftbound game rules and mechanics.