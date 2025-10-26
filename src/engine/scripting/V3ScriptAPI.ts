/**
 * V3 GameAction System - Script API Implementation
 *
 * Provides convenient wrapper methods for card scripts to use the V3 action system.
 * These APIs translate simple method calls into declarative V3 actions.
 */

// @ts-nocheck - This file has extensive V3 action system integration that needs refactoring
import type { Game, GameCard, Player } from '../../types/game';
import type { ActionsAPI, ModifiersAPI, TriggersAPI } from './types/CardScriptTypes';
import { ActionExecutor } from '../actions/ActionExecutor';
import { ModifierRegistry } from '../actions/ModifierRegistry';
import { TriggerRegistry } from '../actions/TriggerRegistry';
import { GameActionType } from '../../types/actions';

// Import V3 Actions
import {
  DealDamageAction,
  HealDamageAction,
  DrawCardAction,
  AddEnergyAction,
  AddPowerAction,
  MoveCardAction,
  ExhaustCardAction,
  ReadyCardAction,
  DiscardCardAction,
  RecycleCardAction,
  KillCardAction,
  HideCardAction,
  // New actions
  ChannelRuneAction,
  StunUnitAction,
  BanishCardAction,
  RevealCardAction,
  CounterSpellAction,
} from '../actions/concrete';

// Import V3 Modifiers
import {
  DamageModifier,
  KeywordModifier,
  PreventionModifier,
} from '../actions/modifiers';

// Import V3 Triggers
import {
  OnUnitEnteredPlayTrigger,
  OnScoringTrigger,
  OnPhaseChangeTrigger,
  OnDamageDealtTrigger,
  OnUnitDeathTrigger,
} from '../actions/triggers';

/**
 * V3 Actions API Implementation
 */
export class V3ActionsAPI implements ActionsAPI {
  constructor(
    private executor: ActionExecutor,
    private controller: Player,
    private game: Game,
    private sourceCard?: GameCard
  ) {}

  async dealDamage(target: GameCard, amount: number, damageType: 'combat' | 'effect' = 'effect'): Promise<void> {
    const action = new DealDamageAction(
      this.controller,
      { target, amount, damageType },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async heal(target: GameCard, amount: number): Promise<void> {
    const action = new HealDamageAction(
      this.controller,
      { target, amount },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async draw(count: number): Promise<void> {
    const action = new DrawCardAction(
      this.controller,
      { count, fromZone: 'mainDeck', toZone: 'hand' },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async addEnergy(amount: number): Promise<void> {
    const action = new AddEnergyAction(
      this.controller,
      { amount },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async addPower(domain: string, amount: number): Promise<void> {
    const action = new AddPowerAction(
      this.controller,
      { domain, amount },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async moveCard(card: GameCard, fromZone: string, toZone: string): Promise<void> {
    const action = new MoveCardAction(
      this.controller,
      { card, fromZone: fromZone as any, toZone: toZone as any },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async exhaustCard(card: GameCard): Promise<void> {
    const action = new ExhaustCardAction(
      this.controller,
      { card },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async readyCard(card: GameCard): Promise<void> {
    const action = new ReadyCardAction(
      this.controller,
      { card },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async discard(card: GameCard): Promise<void> {
    const action = new DiscardCardAction(
      this.controller,
      { card },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async recycle(card: GameCard, toDeck: 'mainDeck' | 'runeDeck'): Promise<void> {
    const action = new RecycleCardAction(
      this.controller,
      {
        card,
        fromZone: card.zone as any,
        toDeck,
      },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async kill(card: GameCard): Promise<void> {
    const action = new KillCardAction(
      this.controller,
      { card },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async hide(card: GameCard): Promise<void> {
    const action = new HideCardAction(
      this.controller,
      { card },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  // ===== NEW ACTIONS (Phase A additions) =====

  async channelRunes(amount: number): Promise<void> {
    const action = new ChannelRuneAction(
      this.controller,
      { amount },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async stun(target: GameCard, duration: number = 1): Promise<void> {
    const action = new StunUnitAction(
      this.controller,
      { target, duration },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async banish(card: GameCard, fromZone: any, permanent: boolean = false): Promise<void> {
    const action = new BanishCardAction(
      this.controller,
      { card, fromZone, permanent },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async reveal(card: GameCard, fromZone: any, duration: 'instant' | 'until_played' | 'permanent' = 'instant'): Promise<void> {
    const action = new RevealCardAction(
      this.controller,
      { card, fromZone, duration },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }

  async counterSpell(targetChainItemId: string, canCounterAbilities: boolean = false): Promise<void> {
    const action = new CounterSpellAction(
      this.controller,
      { targetChainItemId, canCounterAbilities },
      this.sourceCard
    );
    await this.executor.execute(action, this.game);
  }
}

/**
 * V3 Modifiers API Implementation
 */
export class V3ModifiersAPI implements ModifiersAPI {
  constructor(
    private registry: ModifierRegistry,
    private controller: Player,
    private game: Game,
    private sourceCard?: GameCard
  ) {}

  onDamage(config: {
    modify: (amount: number) => number;
    filter?: (target: GameCard) => boolean;
    duration?: 'turn' | 'permanent';
    maxUses?: number;
  }): void {
    const modifierConfig: any = {
      damageModification: 0, // Will use custom function instead
    };

    if (this.sourceCard) {
      modifierConfig.sourceCard = this.sourceCard;
    }
    if (config.filter) {
      modifierConfig.filter = (action: any, game: Game) => config.filter!(action.data.target);
    }
    if (config.duration === 'turn') {
      modifierConfig.expiresWhen = (game: Game) => game.phase !== this.game.phase;
    }
    if (config.maxUses !== undefined) {
      modifierConfig.maxUses = config.maxUses;
    }

    const modifier = new DamageModifier(modifierConfig);
    this.registry.register(GameActionType.DEAL_DAMAGE, modifier);
  }

  onCost(config: {
    energyModification?: number;
    powerModification?: number;
    filter?: (card: GameCard) => boolean;
    duration?: 'turn' | 'permanent';
  }): void {
    // Cost modifier registration would go here
    // Implementation depends on CostModifier being updated for V3
  }

  onKeyword(config: {
    operation: 'grant' | 'remove';
    keyword: string;
    filter?: (card: GameCard) => boolean;
    duration?: 'turn' | 'permanent';
  }): void {
    const modifier = new KeywordModifier({
      sourceCard: this.sourceCard,
      operation: config.operation,
      keyword: config.keyword as any,
      filter: config.filter ? (action: any, game: Game) => {
        return config.filter!(action.data.card);
      } : undefined,
      expiresWhen: config.duration === 'turn'
        ? (game) => game.phase !== this.game.phase
        : undefined,
    });

    this.registry.register(GameActionType.PLAY_CARD, modifier);
  }

  onPrevent(config: {
    actionType: string;
    filter?: (action: any) => boolean;
    maxPrevents?: number;
  }): void {
    const modifier = new PreventionModifier({
      sourceCard: this.sourceCard,
      targetActionTypes: [config.actionType as any],
      filter: config.filter ? (action: any, game: Game) => {
        return config.filter!(action);
      } : undefined,
      maxPrevents: config.maxPrevents,
    });

    this.registry.register(config.actionType, modifier);
  }
}

/**
 * V3 Triggers API Implementation
 */
export class V3TriggersAPI implements TriggersAPI {
  constructor(
    private registry: TriggerRegistry,
    private controller: Player,
    private game: Game,
    private sourceCard?: GameCard,
    private actionsAPI?: V3ActionsAPI
  ) {}

  onUnitEntered(config: {
    filter?: (unit: GameCard) => boolean;
    effect: (unit: GameCard) => Promise<void> | void;
    maxTriggers?: number;
  }): void {
    const trigger = new OnUnitEnteredPlayTrigger({
      sourceCard: this.sourceCard,
      filter: config.filter ? (card: GameCard, game: Game) => {
        return config.filter!(card);
      } : undefined,
      onTrigger: async (card: GameCard, game: Game) => {
        await config.effect(card);
        return [];
      },
      maxTriggers: config.maxTriggers,
    });

    this.registry.register(GameActionType.PLAY_CARD, trigger);
  }

  onScoring(config: {
    filter?: (playerId: string, method: 'hold' | 'conquer') => boolean;
    effect: (playerId: string, battlefield: any) => Promise<void> | void;
    maxTriggers?: number;
  }): void {
    const trigger = new OnScoringTrigger({
      sourceCard: this.sourceCard,
      filter: config.filter ? (data: any, game: Game) => {
        return config.filter!(data.playerId, data.method);
      } : undefined,
      onTrigger: async (data: any, game: Game) => {
        await config.effect(data.playerId, data.battlefield);
        return [];
      },
      maxTriggers: config.maxTriggers,
    });

    this.registry.register(GameActionType.SCORE_HOLD, trigger);
  }

  onPhase(config: {
    phase: 'AWAKEN' | 'BEGINNING' | 'CHANNEL' | 'DRAW' | 'ACTION' | 'ENDING' | 'EXPIRATION' | 'CLEANUP';
    timing: 'start' | 'end';
    effect: () => Promise<void> | void;
    maxTriggers?: number;
  }): void {
    const trigger = new OnPhaseChangeTrigger({
      sourceCard: this.sourceCard,
      targetPhase: config.phase as any,
      timing: config.timing,
      onTrigger: async (data: any, game: Game) => {
        await config.effect();
        return [];
      },
      maxTriggers: config.maxTriggers,
    });

    this.registry.register(GameActionType.START_PHASE, trigger);
  }

  onDamageDealt(config: {
    filter?: (target: GameCard, amount: number) => boolean;
    effect: (target: GameCard, amount: number) => Promise<void> | void;
    maxTriggers?: number;
  }): void {
    const trigger = new OnDamageDealtTrigger({
      sourceCard: this.sourceCard,
      filter: config.filter ? (data: any, game: Game) => {
        return config.filter!(data.target, data.amount);
      } : undefined,
      onTrigger: async (data: any, game: Game) => {
        await config.effect(data.target, data.amount);
        return [];
      },
      maxTriggers: config.maxTriggers,
    });

    this.registry.register(GameActionType.DEAL_DAMAGE, trigger);
  }

  onUnitDeath(config: {
    filter?: (unit: GameCard) => boolean;
    effect: (unit: GameCard) => Promise<void> | void;
    maxTriggers?: number;
  }): void {
    const trigger = new OnUnitDeathTrigger({
      sourceCard: this.sourceCard,
      filter: config.filter ? (card: GameCard, game: Game) => {
        return config.filter!(card);
      } : undefined,
      onTrigger: async (card: GameCard, game: Game) => {
        await config.effect(card);
        return [];
      },
      maxTriggers: config.maxTriggers,
    });

    this.registry.register(GameActionType.UNIT_DIES, trigger);
  }
}

/**
 * Factory function to create all V3 APIs for a card script context
 */
export function createV3APIs(
  executor: ActionExecutor,
  modifierRegistry: ModifierRegistry,
  triggerRegistry: TriggerRegistry,
  controller: Player,
  game: Game,
  sourceCard?: GameCard
): { actions: ActionsAPI; modifiers: ModifiersAPI; triggers: TriggersAPI } {
  const actions = new V3ActionsAPI(executor, controller, game, sourceCard);
  const modifiers = new V3ModifiersAPI(modifierRegistry, controller, game, sourceCard);
  const triggers = new V3TriggersAPI(triggerRegistry, controller, game, sourceCard, actions);

  return { actions, modifiers, triggers };
}
