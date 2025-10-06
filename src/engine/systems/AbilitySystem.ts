import {
  Game,
  Ability,
  AbilityType,
  AbilityTiming,
  AbilityTrigger,
  GameCard,
  GamePhase,
  TurnState,
  EventType
} from '@/types/game';
import { eventBus } from '../events';
import { EffectSystem } from './EffectSystem';
import { ChainSystem } from './ChainSystem';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Manages ability activation, triggers, and resolution
 *
 * Ability Types:
 * - Activated: [Cost]: Effect - requires player activation
 * - Triggered: When/At X: Effect - automatic when trigger occurs
 * - Static: Continuous effect - always active
 * - Replacement: Instead of X, Y - modifies game rules
 */
export class AbilitySystem {
  private effectSystem: EffectSystem;
  private chainSystem: ChainSystem;
  private triggeredAbilities: Map<string, Ability[]> = new Map();

  constructor(effectSystem: EffectSystem, chainSystem: ChainSystem) {
    this.effectSystem = effectSystem;
    this.chainSystem = chainSystem;
  }

  /**
   * Activate an activated ability
   */
  async activateAbility(
    game: Game,
    ability: Ability,
    sourceCard: GameCard,
    playerId: string,
    targets: string[]
  ): Promise<void> {
    if (ability.type !== AbilityType.ACTIVATED) {
      throw new Error('Can only activate Activated abilities');
    }

    logger.info(`AbilitySystem: Player ${playerId} activating ability ${ability.id} from ${sourceCard.instanceId}`);

    // Validate can activate
    if (!this.canActivateAbility(game, ability, sourceCard, playerId)) {
      throw new Error('Cannot activate ability at this time');
    }

    // Pay costs
    if (ability.cost) {
      await this.payCosts(game, ability, playerId);
    }

    // Add to chain if appropriate
    if (ability.timing === AbilityTiming.ACTION || ability.timing === AbilityTiming.REACTION) {
      // Create chain item for ability
      const chainItem = {
        id: uuidv4(),
        type: 'activated_ability' as any,
        sourceCardId: sourceCard.instanceId,
        sourceAbilityId: ability.id,
        controllerId: playerId,
        targets: [],
        effects: ability.effects,
        timestamp: new Date(),
        resolved: false
      };

      this.chainSystem.push(game, chainItem);
      logger.debug(`AbilitySystem: Added ability ${ability.id} to chain`);
    } else {
      // Execute immediately
      await this.effectSystem.executeEffects(game, ability.effects, sourceCard.instanceId, playerId);
    }
  }

  /**
   * Check for and process triggered abilities
   */
  async checkTriggeredAbilities(
    game: Game,
    trigger: AbilityTrigger,
    context?: any
  ): Promise<void> {
    logger.debug(`AbilitySystem: Checking for triggered abilities on trigger ${trigger}`);

    const triggeredAbilities = this.getTriggeredAbilitiesForTrigger(game, trigger);

    if (triggeredAbilities.length === 0) {
      return;
    }

    logger.info(`AbilitySystem: Found ${triggeredAbilities.length} triggered abilities for ${trigger}`);

    // Group by controller
    const abilitiesByController = new Map<string, Array<{ ability: Ability; sourceCard: GameCard }>>();

    for (const { ability, sourceCard } of triggeredAbilities) {
      const controllerId = sourceCard.controllerId;
      if (!abilitiesByController.has(controllerId)) {
        abilitiesByController.set(controllerId, []);
      }
      abilitiesByController.get(controllerId)!.push({ ability, sourceCard });
    }

    // Add to chain in Turn Order
    // Controller chooses order for their own triggers
    for (const [controllerId, abilities] of abilitiesByController) {
      for (const { ability, sourceCard } of abilities) {
        await this.triggerAbility(game, ability, sourceCard, controllerId);
      }
    }
  }

  /**
   * Trigger a triggered ability
   */
  private async triggerAbility(
    game: Game,
    ability: Ability,
    sourceCard: GameCard,
    controllerId: string
  ): Promise<void> {
    logger.info(`AbilitySystem: Triggering ability ${ability.id} from ${sourceCard.instanceId}`);

    // Add to chain
    const chainItem = {
      id: uuidv4(),
      type: 'triggered_ability' as any,
      sourceCardId: sourceCard.instanceId,
      sourceAbilityId: ability.id,
      controllerId,
      targets: [],
      effects: ability.effects,
      timestamp: new Date(),
      resolved: false
    };

    this.chainSystem.push(game, chainItem);
    logger.debug(`AbilitySystem: Added triggered ability ${ability.id} to chain`);
  }

  /**
   * Apply static abilities
   */
  applyStaticAbilities(game: Game): void {
    // Static abilities create continuous effects
    // These would modify game state or calculations

    logger.debug('AbilitySystem: Applying static abilities (placeholder)');

    // TODO: Implement static ability application
    // Examples:
    // - "Units you control get +1 Might"
    // - "Your spells cost 1 less"
    // - "Opponents cannot play spells during your turn"
  }

  /**
   * Check if ability can be activated
   */
  canActivateAbility(
    game: Game,
    ability: Ability,
    sourceCard: GameCard,
    playerId: string
  ): boolean {
    // Check if player controls the card
    if (sourceCard.controllerId !== playerId) {
      return false;
    }

    // Check if card is in valid zone
    if (!this.isCardInPlayZone(game, sourceCard)) {
      return false;
    }

    // Check timing restrictions
    if (!this.checkTimingRestrictions(game, ability, playerId)) {
      return false;
    }

    // Check if ability can be used (not already used this turn, etc.)
    // TODO: Track ability usage

    return true;
  }

  /**
   * Check timing restrictions for ability
   */
  private checkTimingRestrictions(
    game: Game,
    ability: Ability,
    playerId: string
  ): boolean {
    const timing = ability.timing;

    switch (timing) {
      case AbilityTiming.NORMAL:
        // Only during own turn, Neutral Open
        if (game.turnState !== TurnState.NEUTRAL_OPEN) {
          return false;
        }
        const currentPlayer = game.players[game.currentPlayerIndex];
        if (currentPlayer?.id !== playerId) {
          return false;
        }
        break;

      case AbilityTiming.ACTION:
        // During Neutral Open (own turn) or Showdowns
        if (game.turnState === TurnState.NEUTRAL_CLOSED) {
          return false;
        }
        break;

      case AbilityTiming.REACTION:
        // Can be used anytime
        break;

      default:
        return false;
    }

    return true;
  }

  /**
   * Pay costs for ability
   */
  private async payCosts(game: Game, ability: Ability, playerId: string): Promise<void> {
    if (!ability.cost) return;

    // Pay energy costs
    if (ability.cost.energyPaid > 0) {
      // Would integrate with RunePoolManager
      logger.debug(`AbilitySystem: Paying ${ability.cost.energyPaid} energy for ability`);
    }

    // Pay power costs
    if (ability.cost.powerPaid.length > 0) {
      // Would integrate with RunePoolManager
      logger.debug(`AbilitySystem: Paying power costs for ability`);
    }

    // Pay additional costs
    for (const additionalCost of ability.cost.additionalCosts) {
      logger.debug(`AbilitySystem: Paying additional cost ${additionalCost.type}`);
      // TODO: Implement additional cost payment
    }
  }

  /**
   * Get all triggered abilities for a trigger
   */
  private getTriggeredAbilitiesForTrigger(
    game: Game,
    trigger: AbilityTrigger
  ): Array<{ ability: Ability; sourceCard: GameCard }> {
    const triggeredAbilities: Array<{ ability: Ability; sourceCard: GameCard }> = [];

    // Check all cards in play for triggered abilities
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        const abilities = this.getCardAbilities(unit);
        for (const ability of abilities) {
          if (ability.type === AbilityType.TRIGGERED && ability.triggers?.includes(trigger)) {
            triggeredAbilities.push({ ability, sourceCard: unit });
          }
        }
      }
    }

    // Check base zones
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        const abilities = this.getCardAbilities(unit);
        for (const ability of abilities) {
          if (ability.type === AbilityType.TRIGGERED && ability.triggers?.includes(trigger)) {
            triggeredAbilities.push({ ability, sourceCard: unit });
          }
        }
      }
    }

    return triggeredAbilities;
  }

  /**
   * Get abilities from a card
   */
  private getCardAbilities(card: GameCard): Ability[] {
    // TODO: Get actual abilities from card definition
    // For now, return empty array
    return [];
  }

  /**
   * Check if card is in play zone
   */
  private isCardInPlayZone(game: Game, card: GameCard): boolean {
    // Check battlefields
    for (const battlefield of game.battlefields) {
      if (battlefield.units.some(u => u.instanceId === card.instanceId)) {
        return true;
      }
    }

    // Check player bases
    for (const player of game.players) {
      if (player.zones.base.some(u => u.instanceId === card.instanceId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Register triggered abilities for events
   */
  registerTriggeredAbilities(game: Game): void {
    // This would set up event listeners for triggered abilities
    logger.debug('AbilitySystem: Registering triggered abilities (placeholder)');

    // Example:
    // eventBus.on(EventType.UNIT_DIED, async (event) => {
    //   await this.checkTriggeredAbilities(game, AbilityTrigger.DIES, event);
    // });
  }

  /**
   * Unregister all triggered abilities
   */
  unregisterTriggeredAbilities(): void {
    this.triggeredAbilities.clear();
    logger.debug('AbilitySystem: Unregistered all triggered abilities');
  }

  /**
   * Get ability statistics
   */
  getAbilityStats(game: Game): {
    totalAbilities: number;
    activatedAbilities: number;
    triggeredAbilities: number;
    staticAbilities: number;
  } {
    let totalAbilities = 0;
    let activatedAbilities = 0;
    let triggeredAbilities = 0;
    let staticAbilities = 0;

    // Count abilities on cards in play
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        const abilities = this.getCardAbilities(unit);
        totalAbilities += abilities.length;

        for (const ability of abilities) {
          switch (ability.type) {
            case AbilityType.ACTIVATED:
              activatedAbilities++;
              break;
            case AbilityType.TRIGGERED:
              triggeredAbilities++;
              break;
            case AbilityType.STATIC:
              staticAbilities++;
              break;
          }
        }
      }
    }

    return {
      totalAbilities,
      activatedAbilities,
      triggeredAbilities,
      staticAbilities
    };
  }

  /**
   * Handle Deathknell triggers
   */
  async handleDeathknell(game: Game, diedCard: GameCard): Promise<void> {
    logger.info(`AbilitySystem: Checking for Deathknell on ${diedCard.instanceId}`);

    // Get abilities from the card that died
    const abilities = this.getCardAbilities(diedCard);

    for (const ability of abilities) {
      if (ability.type === AbilityType.TRIGGERED && ability.triggers?.includes(AbilityTrigger.DIES)) {
        logger.info(`AbilitySystem: Triggering Deathknell ability ${ability.id}`);

        // Execute the ability (Deathknell happens even if card is in trash)
        await this.effectSystem.executeEffects(
          game,
          ability.effects,
          diedCard.instanceId,
          diedCard.controllerId
        );
      }
    }
  }

  /**
   * Check for "enters play" triggers
   */
  async handleEntersPlay(game: Game, card: GameCard): Promise<void> {
    logger.info(`AbilitySystem: Checking for enters play triggers on ${card.instanceId}`);

    const abilities = this.getCardAbilities(card);

    for (const ability of abilities) {
      if (ability.type === AbilityType.TRIGGERED && ability.triggers?.includes(AbilityTrigger.ENTERS_PLAY)) {
        logger.info(`AbilitySystem: Triggering enters play ability ${ability.id}`);

        await this.triggerAbility(game, ability, card, card.controllerId);
      }
    }
  }
}
