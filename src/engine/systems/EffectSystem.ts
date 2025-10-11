import {
  Game,
  Effect,
  EffectType,
  EffectDuration,
  GameCard,
  Target,
  TargetType,
  TemporaryModifier,
  ModifierType
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Manages effect execution and resolution
 *
 * Effect Rules:
 * - Effects are executed in order
 * - Targets must be validated before execution
 * - Duration determines when effects end
 * - Modifiers are tracked on game cards
 */
export class EffectSystem {

  /**
   * Execute an effect
   */
  async executeEffect(
    game: Game,
    effect: Effect,
    sourceCardId: string,
    controllerId: string
  ): Promise<void> {
    logger.debug(`EffectSystem: Executing effect ${effect.type} from ${sourceCardId}`);

    switch (effect.type) {
      case EffectType.DAMAGE:
        await this.executeDamageEffect(game, effect, controllerId);
        break;

      case EffectType.HEAL:
        await this.executeHealEffect(game, effect);
        break;

      case EffectType.BUFF_MIGHT:
        await this.executeBuffMightEffect(game, effect, sourceCardId);
        break;

      case EffectType.DRAW_CARDS:
        await this.executeDrawCardsEffect(game, effect, controllerId);
        break;

      case EffectType.DISCARD_CARDS:
        await this.executeDiscardCardsEffect(game, effect, controllerId);
        break;

      case EffectType.DESTROY:
        await this.executeDestroyEffect(game, effect);
        break;

      case EffectType.RETURN_TO_HAND:
        await this.executeReturnToHandEffect(game, effect);
        break;

      case EffectType.MOVE_UNIT:
        await this.executeMoveUnitEffect(game, effect);
        break;

      case EffectType.EXHAUST:
        await this.executeExhaustEffect(game, effect);
        break;

      case EffectType.READY:
        await this.executeReadyEffect(game, effect);
        break;

      case EffectType.STUN:
        await this.executeStunEffect(game, effect);
        break;

      case EffectType.ADD_KEYWORD:
        await this.executeAddKeywordEffect(game, effect, sourceCardId);
        break;

      case EffectType.REMOVE_KEYWORD:
        await this.executeRemoveKeywordEffect(game, effect);
        break;

      case EffectType.CREATE_TOKEN:
        await this.executeCreateTokenEffect(game, effect, controllerId);
        break;

      case EffectType.SEARCH_DECK:
        await this.executeSearchDeckEffect(game, effect, controllerId);
        break;

      case EffectType.MILL_CARDS:
        await this.executeMillCardsEffect(game, effect, controllerId);
        break;

      default:
        logger.warn(`EffectSystem: Unknown effect type ${effect.type}`);
    }
  }

  /**
   * Execute multiple effects in sequence
   */
  async executeEffects(
    game: Game,
    effects: Effect[],
    sourceCardId: string,
    controllerId: string
  ): Promise<void> {
    for (const effect of effects) {
      await this.executeEffect(game, effect, sourceCardId, controllerId);
    }
  }

  /**
   * Deal damage to target(s)
   */
  private async executeDamageEffect(game: Game, effect: Effect, controllerId: string): Promise<void> {
    const value = effect.value || 0;
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target) {
        target.damage += value;
        logger.info(`EffectSystem: Dealt ${value} damage to ${targetId} (total: ${target.damage})`);
      }
    }
  }

  /**
   * Heal target(s)
   */
  private async executeHealEffect(game: Game, effect: Effect): Promise<void> {
    const value = effect.value || 0;
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target && target.damage > 0) {
        const healAmount = Math.min(value, target.damage);
        target.damage -= healAmount;
        logger.info(`EffectSystem: Healed ${healAmount} damage from ${targetId} (remaining: ${target.damage})`);
      }
    }
  }

  /**
   * Buff Might of target(s)
   */
  private async executeBuffMightEffect(game: Game, effect: Effect, sourceCardId: string): Promise<void> {
    const value = effect.value || 0;
    const duration = effect.duration || EffectDuration.END_OF_TURN;
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target) {
        const modifier: TemporaryModifier = {
          type: ModifierType.MIGHT_BONUS,
          value,
          duration,
          source: sourceCardId
        };

        target.temporaryModifiers.push(modifier);
        logger.info(`EffectSystem: Added +${value} Might to ${targetId} until ${duration}`);
      }
    }
  }

  /**
   * Draw cards
   */
  private async executeDrawCardsEffect(game: Game, effect: Effect, controllerId: string): Promise<void> {
    const value = effect.value || 1;
    const player = game.players.find(p => p.id === controllerId);

    if (!player) return;

    for (let i = 0; i < value; i++) {
      if (player.zones.mainDeck.length === 0) {
        logger.warn(`EffectSystem: Player ${controllerId} cannot draw - deck empty`);
        // TODO: Trigger Burn Out
        break;
      }

      const card = player.zones.mainDeck.shift();
      if (card) {
        player.zones.hand.push(card);

        await eventBus.emit(GameEventFactory.createCardDrawnEvent(
          game.id,
          controllerId,
          card.cardId
        ));

        logger.debug(`EffectSystem: Player ${controllerId} drew a card`);
      }
    }

    logger.info(`EffectSystem: Player ${controllerId} drew ${value} card(s)`);
  }

  /**
   * Discard cards
   */
  private async executeDiscardCardsEffect(game: Game, effect: Effect, controllerId: string): Promise<void> {
    const value = effect.value || 1;
    const player = game.players.find(p => p.id === controllerId);

    if (!player) return;

    // For now, discard from the end of hand (would need player choice in full implementation)
    for (let i = 0; i < value && player.zones.hand.length > 0; i++) {
      const card = player.zones.hand.pop();
      if (card) {
        player.zones.trash.push(card);
        logger.debug(`EffectSystem: Player ${controllerId} discarded card ${card.instanceId}`);
      }
    }

    logger.info(`EffectSystem: Player ${controllerId} discarded ${value} card(s)`);
  }

  /**
   * Destroy target(s)
   */
  private async executeDestroyEffect(game: Game, effect: Effect): Promise<void> {
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target) {
        await this.destroyCard(game, target);
        logger.info(`EffectSystem: Destroyed card ${targetId}`);
      }
    }
  }

  /**
   * Return target(s) to hand
   */
  private async executeReturnToHandEffect(game: Game, effect: Effect): Promise<void> {
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target) {
        await this.returnCardToHand(game, target);
        logger.info(`EffectSystem: Returned card ${targetId} to hand`);
      }
    }
  }

  /**
   * Move unit to battlefield
   */
  private async executeMoveUnitEffect(game: Game, effect: Effect): Promise<void> {
    // This would integrate with BattlefieldManager
    logger.debug('EffectSystem: Move unit effect (placeholder)');
  }

  /**
   * Exhaust target(s)
   */
  private async executeExhaustEffect(game: Game, effect: Effect): Promise<void> {
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target) {
        target.ready = false;
        logger.info(`EffectSystem: Exhausted card ${targetId}`);
      }
    }
  }

  /**
   * Ready target(s)
   */
  private async executeReadyEffect(game: Game, effect: Effect): Promise<void> {
    const targetIds = effect.targetIds || [];

    for (const targetId of targetIds) {
      const target = this.findCard(game, targetId);
      if (target) {
        target.ready = true;
        logger.info(`EffectSystem: Readied card ${targetId}`);
      }
    }
  }

  /**
   * Stun target(s)
   */
  private async executeStunEffect(game: Game, effect: Effect): Promise<void> {
    // Stun would be implemented as a temporary modifier
    logger.debug('EffectSystem: Stun effect (placeholder)');
  }

  /**
   * Add keyword to target(s)
   */
  private async executeAddKeywordEffect(game: Game, effect: Effect, sourceCardId: string): Promise<void> {
    // Keywords would be added as temporary modifiers
    logger.debug('EffectSystem: Add keyword effect (placeholder)');
  }

  /**
   * Remove keyword from target(s)
   */
  private async executeRemoveKeywordEffect(game: Game, effect: Effect): Promise<void> {
    logger.debug('EffectSystem: Remove keyword effect (placeholder)');
  }

  /**
   * Create token unit
   * TODO: This needs a proper TokenCard definition to work with GameCard extends BaseCard
   */
  private async executeCreateTokenEffect(game: Game, effect: Effect, controllerId: string): Promise<void> {
    const player = game.players.find(p => p.id === controllerId);
    if (!player) return;

    // TODO: Need token card definition to use createGameCard helper
    // For now, throw error until we implement token system properly
    throw new Error('Token creation not yet implemented - needs TokenCard definition');

    /*
    // OLD CODE - doesn't work with GameCard extends BaseCard
    const token: GameCard = {
      instanceId: uuidv4(),
      cardId: 'token-' + uuidv4(),
      controllerId,
      ownerId: controllerId,
      zone: 'base',
      ready: true,
      damage: 0,
      temporaryModifiers: [],
      counters: []
    };
    */

    logger.info(`EffectSystem: Created token for player ${controllerId}`);
  }

  /**
   * Search deck for card
   */
  private async executeSearchDeckEffect(game: Game, effect: Effect, controllerId: string): Promise<void> {
    // Would require card database and search criteria
    logger.debug('EffectSystem: Search deck effect (placeholder)');
  }

  /**
   * Mill cards from deck to trash
   */
  private async executeMillCardsEffect(game: Game, effect: Effect, controllerId: string): Promise<void> {
    const value = effect.value || 1;
    const player = game.players.find(p => p.id === controllerId);

    if (!player) return;

    for (let i = 0; i < value && player.zones.mainDeck.length > 0; i++) {
      const card = player.zones.mainDeck.shift();
      if (card) {
        player.zones.trash.push(card);
        logger.debug(`EffectSystem: Milled card ${card.instanceId} from deck to trash`);
      }
    }

    logger.info(`EffectSystem: Milled ${value} card(s) from player ${controllerId}'s deck`);
  }

  /**
   * Find a card in the game
   */
  private findCard(game: Game, cardId: string): GameCard | undefined {
    // Search battlefields
    for (const battlefield of game.battlefields) {
      const card = battlefield.units.find(u => u.instanceId === cardId);
      if (card) return card;

      const hiddenCard = battlefield.facedownCards.find(c => c.instanceId === cardId);
      if (hiddenCard) return hiddenCard;
    }

    // Search player zones
    for (const player of game.players) {
      // Check all zones
      const zones = [
        player.zones.base,
        player.zones.runes,
        player.zones.hand,
        player.zones.championZone
      ];

      for (const zone of zones) {
        const card = zone.find(c => c.instanceId === cardId);
        if (card) return card;
      }
    }

    return undefined;
  }

  /**
   * Destroy a card
   */
  private async destroyCard(game: Game, card: GameCard): Promise<void> {
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) return;

    // Remove from current location
    this.removeCardFromLocation(game, card);

    // Move to trash
    card.damage = 0;
    card.ready = false;
    card.temporaryModifiers = [];
    owner.zones.trash.push(card);

    // Emit unit died event if on battlefield
    if (this.isUnitOnBattlefield(game, card.instanceId)) {
      await eventBus.emit(GameEventFactory.createUnitDiedEvent(
        game.id,
        card.controllerId,
        card.cardId,
        'battlefield-id' // Would need actual battlefield ID
      ));
    }
  }

  /**
   * Return card to hand
   */
  private async returnCardToHand(game: Game, card: GameCard): Promise<void> {
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) return;

    // Remove from current location
    this.removeCardFromLocation(game, card);

    // Reset card state
    card.damage = 0;
    card.ready = false;
    card.temporaryModifiers = [];

    // Add to hand
    owner.zones.hand.push(card);
  }

  /**
   * Remove card from its current location
   */
  private removeCardFromLocation(game: Game, card: GameCard): void {
    // Remove from battlefields
    for (const battlefield of game.battlefields) {
      let index = battlefield.units.findIndex(u => u.instanceId === card.instanceId);
      if (index !== -1) {
        battlefield.units.splice(index, 1);
        return;
      }

      index = battlefield.facedownCards.findIndex(c => c.instanceId === card.instanceId);
      if (index !== -1) {
        battlefield.facedownCards.splice(index, 1);
        return;
      }
    }

    // Remove from player zones
    for (const player of game.players) {
      const zones = [
        player.zones.base,
        player.zones.runes,
        player.zones.hand,
        player.zones.championZone
      ];

      for (const zone of zones) {
        const index = zone.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
          zone.splice(index, 1);
          return;
        }
      }
    }
  }

  /**
   * Check if unit is on a battlefield
   */
  private isUnitOnBattlefield(game: Game, cardId: string): boolean {
    return game.battlefields.some(b =>
      b.units.some(u => u.instanceId === cardId)
    );
  }

  /**
   * Calculate total Might including modifiers
   */
  getMightWithModifiers(card: GameCard, baseMight: number): number {
    let totalMight = baseMight;

    for (const modifier of card.temporaryModifiers) {
      if (modifier.type === ModifierType.MIGHT_BONUS) {
        totalMight += modifier.value;
      }
    }

    return totalMight;
  }

  /**
   * Remove expired modifiers from a card
   */
  removeExpiredModifiers(card: GameCard, currentDuration: EffectDuration): void {
    card.temporaryModifiers = card.temporaryModifiers.filter(modifier => {
      // Remove modifiers that should expire at this duration
      if (modifier.duration === currentDuration) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get effect statistics
   */
  getEffectStats(game: Game): {
    totalModifiers: number;
    modifiersByType: Record<ModifierType, number>;
    cardsWithModifiers: number;
  } {
    let totalModifiers = 0;
    let cardsWithModifiers = 0;
    const modifiersByType: Record<ModifierType, number> = {
      [ModifierType.MIGHT_BONUS]: 0,
      [ModifierType.COST_REDUCTION]: 0,
      [ModifierType.KEYWORD_GRANT]: 0
    };

    // Count modifiers on battlefields
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        if (unit.temporaryModifiers.length > 0) {
          cardsWithModifiers++;
          totalModifiers += unit.temporaryModifiers.length;

          for (const modifier of unit.temporaryModifiers) {
            modifiersByType[modifier.type]++;
          }
        }
      }
    }

    // Count modifiers in player zones
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        if (unit.temporaryModifiers.length > 0) {
          cardsWithModifiers++;
          totalModifiers += unit.temporaryModifiers.length;

          for (const modifier of unit.temporaryModifiers) {
            modifiersByType[modifier.type]++;
          }
        }
      }
    }

    return {
      totalModifiers,
      modifiersByType,
      cardsWithModifiers
    };
  }
}
