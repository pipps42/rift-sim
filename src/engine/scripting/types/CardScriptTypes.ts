/**
 * Card Script Types (V2 - Direct Execution Model)
 *
 * Simplified type system for card scripts with direct access to game engine.
 * Based on Legends of Runeterra approach: no sandboxing, no serialization.
 *
 * Key differences from V1:
 * - CardContext has direct Game reference (not SafeGameState)
 * - No BattlefieldAPI, ChainAPI wrappers - scripts access game.* directly
 * - Scripts execute in main Node.js process (no isolated-vm)
 */

import type { Game, GameCard, Player, Card } from '../../../types/game';

// ============================================================================
// CARD CONTEXT
// ============================================================================

/**
 * Context passed to every card script hook.
 * Scripts have DIRECT access to game engine objects.
 */
export interface CardContext {
  /**
   * The card executing this script.
   */
  self: GameCard;

  /**
   * Player who owns/controls this card.
   */
  owner: Player;

  /**
   * Opponent player (convenience property).
   * In 1v1 games, this is always the other player.
   * Automatically populated by CardScriptRuntime.
   */
  opponent: Player;

  /**
   * Direct reference to game instance.
   * Scripts can access game.battlefield, game.effects, etc. directly.
   */
  game: Game;

  /**
   * Selected targets (if any).
   * Populated when card has targeted abilities.
   */
  targets?: GameCard[];

  /**
   * Event-specific data.
   * Example: { amount: 5, source: cardInstanceId } for damage events
   */
  eventData?: EventData;

  // ===== V3 GameAction System Integration =====

  /**
   * V3 Actions API - Execute declarative game actions.
   * All actions go through validation → modifiers → execution → history → triggers.
   *
   * Example:
   * ```typescript
   * await ctx.actions.exhaustCard(ctx.self);
   * await ctx.actions.addEnergy(1);
   * ```
   */
  actions: ActionsAPI;

  /**
   * V3 Modifiers API - Register action modifiers.
   * Modifiers intercept actions before execution to modify them.
   *
   * Example:
   * ```typescript
   * ctx.modifiers.onDamage({
   *   modify: (amount) => amount + 1,  // +1 damage
   *   filter: (target) => target.controllerId !== ctx.owner.id,
   *   duration: 'turn'
   * });
   * ```
   */
  modifiers: ModifiersAPI;

  /**
   * V3 Triggers API - Register event triggers.
   * Triggers fire when specific game events occur.
   *
   * Example:
   * ```typescript
   * ctx.triggers.onUnitEntered({
   *   filter: (unit) => unit.domains?.includes('fury'),
   *   effect: async (unit) => { await ctx.actions.draw(1); }
   * });
   * ```
   */
  triggers: TriggersAPI;
}

/**
 * Event data passed to hooks.
 */
export interface EventData {
  [key: string]: any;
  amount?: number;
  source?: string;
  target?: string;
  type?: string;
}

// ============================================================================
// CARD SCRIPT DEFINITION
// ============================================================================

/**
 * Card script interface.
 * Each method is a hook that triggers on specific game events.
 */
export interface CardScript {
  // -------------------------------------------------------------------------
  // PLAY/CAST HOOKS
  // -------------------------------------------------------------------------

  /**
   * Triggered when this card is played from hand.
   * For units: enters the battlefield
   * For spells: cast effect resolves
   */
  onPlay?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card is cast (spells only).
   * Called BEFORE spell goes on the chain.
   */
  onCast?: (ctx: CardContext) => Promise<void>;

  // -------------------------------------------------------------------------
  // RUNE HOOKS
  // -------------------------------------------------------------------------

  /**
   * Triggered when a rune is tapped for energy (runes only).
   * Basic rune ability: [T]: Add [1] energy
   */
  onTap?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when a rune is recycled for power (runes only).
   * Basic rune ability: Recycle this - Add [Domain] power
   */
  onRecycle?: (ctx: CardContext) => Promise<void>;

  // -------------------------------------------------------------------------
  // ZONE CHANGE HOOKS
  // -------------------------------------------------------------------------

  /**
   * Triggered when this card enters play (battlefield or board zone).
   */
  onEntersPlay?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card leaves play.
   */
  onLeavesPlay?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card is destroyed/dies.
   */
  onDeath?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card is discarded from hand.
   */
  onDiscard?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card is drawn.
   */
  onDraw?: (ctx: CardContext) => Promise<void>;

  // -------------------------------------------------------------------------
  // TURN HOOKS
  // -------------------------------------------------------------------------

  /**
   * Triggered at the start of each turn (if card is in play).
   */
  onTurnStart?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered at the end of each turn (if card is in play).
   */
  onTurnEnd?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered at the start of owner's turn.
   */
  onYourTurnStart?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered at the end of owner's turn.
   */
  onYourTurnEnd?: (ctx: CardContext) => Promise<void>;

  // -------------------------------------------------------------------------
  // COMBAT HOOKS
  // -------------------------------------------------------------------------

  /**
   * Triggered when this card attacks.
   */
  onAttack?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card defends/blocks.
   */
  onDefend?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card deals damage.
   */
  onDamage?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card takes damage.
   */
  onDamaged?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card strikes (deals combat damage).
   */
  onStrike?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when this card is struck (receives combat damage).
   */
  onStruck?: (ctx: CardContext) => Promise<void>;

  // -------------------------------------------------------------------------
  // GAME EVENT HOOKS
  // -------------------------------------------------------------------------

  /**
   * Triggered when ANY spell is cast (global listener).
   */
  onSpellCast?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when ANY unit enters play (global listener).
   */
  onUnitEntersPlay?: (ctx: CardContext) => Promise<void>;

  /**
   * Triggered when ANY unit dies (global listener).
   */
  onUnitDies?: (ctx: CardContext) => Promise<void>;

  // -------------------------------------------------------------------------
  // VALIDATION HOOKS
  // -------------------------------------------------------------------------

  /**
   * Custom validation for playing this card.
   * Return false to prevent playing.
   */
  canPlay?: (ctx: CardContext) => Promise<boolean>;

  /**
   * Custom validation for targeting.
   * Return false to mark target as invalid.
   */
  canTarget?: (ctx: CardContext, target: GameCard) => Promise<boolean>;

  /**
   * Custom validation for attacking.
   * Return false to prevent attack.
   */
  canAttack?: (ctx: CardContext) => Promise<boolean>;

  /**
   * Custom validation for blocking.
   * Return false to prevent block.
   */
  canBlock?: (ctx: CardContext, attacker: GameCard) => Promise<boolean>;

  // -------------------------------------------------------------------------
  // REPLACEMENT EFFECT HOOKS
  // -------------------------------------------------------------------------

  /**
   * Modify draw event before it occurs.
   * Return modified event to change behavior.
   */
  onBeforeDraw?: (ctx: CardContext, event: DrawEvent) => Promise<DrawEvent>;

  /**
   * Modify damage event before it occurs.
   * Return modified event to change damage amount, redirect, etc.
   */
  onBeforeDamage?: (ctx: CardContext, event: DamageEvent) => Promise<DamageEvent>;

  /**
   * Modify heal event before it occurs.
   */
  onBeforeHeal?: (ctx: CardContext, event: HealEvent) => Promise<HealEvent>;

  // -------------------------------------------------------------------------
  // STATIC PROPERTIES
  // -------------------------------------------------------------------------

  /**
   * Override keywords from card definition.
   * Useful for cards that grant keywords dynamically.
   */
  keywords?: string[];

  /**
   * Override might value (attack/power).
   */
  might?: number;
}

// ============================================================================
// EVENT TYPES (for replacement effects)
// ============================================================================

export interface DrawEvent {
  player: Player;
  amount: number;
  reason?: 'draw_phase' | 'effect' | 'mulligan';
}

export interface DamageEvent {
  target: GameCard;
  amount: number;
  source?: GameCard;
  type?: 'combat' | 'effect' | 'burn';
}

export interface HealEvent {
  target: GameCard;
  amount: number;
  source?: GameCard;
}

// ============================================================================
// LOADED SCRIPT
// ============================================================================

/**
 * Metadata about a loaded script.
 */
export interface LoadedScript {
  /**
   * Card ID this script belongs to.
   */
  cardId: string;

  /**
   * The script object.
   */
  script: CardScript;

  /**
   * Path to script file.
   */
  filePath: string;

  /**
   * Timestamp when script was loaded.
   */
  loadedAt: Date;
}

// ============================================================================
// V3 GAMEACTION SYSTEM APIs
// ============================================================================

/**
 * V3 Actions API - Convenience methods for executing game actions.
 * All actions use the V3 declarative pipeline with validation, modifiers, history, and triggers.
 */
export interface ActionsAPI {
  /** Deal damage to target */
  dealDamage(target: GameCard, amount: number, damageType?: 'combat' | 'effect'): Promise<void>;

  /** Heal target */
  heal(target: GameCard, amount: number): Promise<void>;

  /** Draw cards from main deck */
  draw(count: number): Promise<void>;

  /** Add energy to rune pool */
  addEnergy(amount: number): Promise<void>;

  /** Add power to rune pool */
  addPower(domain: string, amount: number): Promise<void>;

  /** Move card between zones */
  moveCard(card: GameCard, fromZone: string, toZone: string): Promise<void>;

  /** Exhaust card (ready → exhausted) */
  exhaustCard(card: GameCard): Promise<void>;

  /** Ready card (exhausted → ready) */
  readyCard(card: GameCard): Promise<void>;

  /** Discard card from hand to trash */
  discard(card: GameCard): Promise<void>;

  /** Recycle card to bottom of deck */
  recycle(card: GameCard, toDeck: 'mainDeck' | 'runeDeck'): Promise<void>;

  /** Kill permanent (send to trash) */
  kill(card: GameCard): Promise<void>;

  /** Hide card facedown at battlefield */
  hide(card: GameCard): Promise<void>;

  // ===== NEW ACTIONS (Phase A additions) =====

  /** Channel runes from Rune Deck to Base */
  channelRunes(amount: number): Promise<void>;

  /** Stun a unit for specified duration */
  stun(target: GameCard, duration?: number): Promise<void>;

  /** Banish card to Banishment zone */
  banish(card: GameCard, fromZone: any, permanent?: boolean): Promise<void>;

  /** Reveal card from private zone */
  reveal(card: GameCard, fromZone: any, duration?: 'instant' | 'until_played' | 'permanent'): Promise<void>;

  /** Counter a spell or ability on the Chain */
  counterSpell(targetChainItemId: string, canCounterAbilities?: boolean): Promise<void>;
}

/**
 * V3 Modifiers API - Register action modifiers that intercept actions.
 */
export interface ModifiersAPI {
  /** Register a damage modifier */
  onDamage(config: {
    modify: (amount: number) => number;
    filter?: (target: GameCard) => boolean;
    duration?: 'turn' | 'permanent';
    maxUses?: number;
  }): void;

  /** Register a cost modifier */
  onCost(config: {
    energyModification?: number;
    powerModification?: number;
    filter?: (card: GameCard) => boolean;
    duration?: 'turn' | 'permanent';
  }): void;

  /** Register a keyword modifier */
  onKeyword(config: {
    operation: 'grant' | 'remove';
    keyword: string;
    filter?: (card: GameCard) => boolean;
    duration?: 'turn' | 'permanent';
  }): void;

  /** Register a prevention modifier */
  onPrevent(config: {
    actionType: string;
    filter?: (action: any) => boolean;
    maxPrevents?: number;
  }): void;
}

/**
 * V3 Triggers API - Register triggers that fire on game events.
 */
export interface TriggersAPI {
  /** Register trigger for when units enter play */
  onUnitEntered(config: {
    filter?: (unit: GameCard) => boolean;
    effect: (unit: GameCard) => Promise<void> | void;
    maxTriggers?: number;
  }): void;

  /** Register trigger for when player scores */
  onScoring(config: {
    filter?: (playerId: string, method: 'hold' | 'conquer') => boolean;
    effect: (playerId: string, battlefield: any) => Promise<void> | void;
    maxTriggers?: number;
  }): void;

  /** Register trigger for phase changes */
  onPhase(config: {
    phase: 'AWAKEN' | 'BEGINNING' | 'CHANNEL' | 'DRAW' | 'ACTION' | 'ENDING' | 'EXPIRATION' | 'CLEANUP';
    timing: 'start' | 'end';
    effect: () => Promise<void> | void;
    maxTriggers?: number;
  }): void;

  /** Register trigger for when damage is dealt */
  onDamageDealt(config: {
    filter?: (target: GameCard, amount: number) => boolean;
    effect: (target: GameCard, amount: number) => Promise<void> | void;
    maxTriggers?: number;
  }): void;

  /** Register trigger for when units die */
  onUnitDeath(config: {
    filter?: (unit: GameCard) => boolean;
    effect: (unit: GameCard) => Promise<void> | void;
    maxTriggers?: number;
  }): void;
}
