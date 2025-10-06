import {
  Game,
  Target,
  TargetType,
  TargetRequirement,
  TargetRestriction,
  TargetProperty,
  ComparisonOperator,
  GameCard,
  CardType
} from '@/types/game';
import { logger } from '@/utils/logger';

/**
 * Manages targeting validation and selection
 *
 * Targeting Rules:
 * - Targets must be valid when spell/ability is played
 * - Targets must still be valid when resolving
 * - Invalid targets cause spell/ability to fizzle
 * - Optional targets can be skipped
 */
export class TargetingSystem {

  /**
   * Validate targets for a spell or ability
   */
  validateTargets(
    game: Game,
    targets: Target[],
    requirements: TargetRequirement[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check each requirement
    for (const requirement of requirements) {
      const matchingTargets = targets.filter(t => t.type === requirement.targetType);

      // Check count
      if (!requirement.optional && matchingTargets.length < requirement.count) {
        errors.push(
          `Requires ${requirement.count} ${requirement.targetType} target(s), found ${matchingTargets.length}`
        );
        continue;
      }

      if (matchingTargets.length > requirement.count) {
        errors.push(
          `Too many ${requirement.targetType} targets: max ${requirement.count}, found ${matchingTargets.length}`
        );
        continue;
      }

      // Validate each target meets restrictions
      for (const target of matchingTargets) {
        if (requirement.restrictions) {
          const restrictionErrors = this.validateRestrictions(game, target, requirement.restrictions);
          errors.push(...restrictionErrors);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate restrictions for a single target
   */
  private validateRestrictions(
    game: Game,
    target: Target,
    restrictions: TargetRestriction[]
  ): string[] {
    const errors: string[] = [];

    for (const restriction of restrictions) {
      const isValid = this.checkRestriction(game, target, restriction);
      if (!isValid) {
        errors.push(
          `Target does not meet restriction: ${restriction.property} ${restriction.operator} ${restriction.value}`
        );
      }
    }

    return errors;
  }

  /**
   * Check a single restriction
   */
  private checkRestriction(
    game: Game,
    target: Target,
    restriction: TargetRestriction
  ): boolean {
    const card = this.getTargetCard(game, target);
    if (!card) return false;

    const actualValue = this.getPropertyValue(card, restriction.property);
    const expectedValue = restriction.value;

    switch (restriction.operator) {
      case ComparisonOperator.EQUALS:
        return actualValue === expectedValue;

      case ComparisonOperator.NOT_EQUALS:
        return actualValue !== expectedValue;

      case ComparisonOperator.GREATER_THAN:
        return typeof actualValue === 'number' &&
               typeof expectedValue === 'number' &&
               actualValue > expectedValue;

      case ComparisonOperator.LESS_THAN:
        return typeof actualValue === 'number' &&
               typeof expectedValue === 'number' &&
               actualValue < expectedValue;

      case ComparisonOperator.CONTAINS:
        if (Array.isArray(actualValue)) {
          return actualValue.includes(expectedValue);
        }
        return String(actualValue).includes(String(expectedValue));

      default:
        return false;
    }
  }

  /**
   * Get property value from a card
   */
  private getPropertyValue(card: GameCard, property: TargetProperty): any {
    // TODO: Get actual card data
    // For now, return placeholder based on property type
    switch (property) {
      case TargetProperty.CARD_TYPE:
        return 'unit'; // Placeholder
      case TargetProperty.MIGHT:
        return 3; // Placeholder
      case TargetProperty.ENERGY_COST:
        return 2; // Placeholder
      case TargetProperty.DOMAIN:
        return []; // Placeholder
      case TargetProperty.KEYWORD:
        return []; // Placeholder
      case TargetProperty.TAG:
        return []; // Placeholder
      default:
        return null;
    }
  }

  /**
   * Get card from target
   */
  private getTargetCard(game: Game, target: Target): GameCard | undefined {
    if (!target.cardId) return undefined;

    // Search all zones
    for (const battlefield of game.battlefields) {
      const card = battlefield.units.find(u => u.instanceId === target.cardId);
      if (card) return card;
    }

    for (const player of game.players) {
      const zones = [
        player.zones.base,
        player.zones.hand,
        player.zones.championZone
      ];

      for (const zone of zones) {
        const card = zone.find(c => c.instanceId === target.cardId);
        if (card) return card;
      }
    }

    return undefined;
  }

  /**
   * Get valid targets for a requirement
   */
  getValidTargets(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): Target[] {
    const validTargets: Target[] = [];

    switch (requirement.targetType) {
      case TargetType.UNIT:
        validTargets.push(...this.getValidUnitTargets(game, requirement, controllerId));
        break;

      case TargetType.GEAR:
        validTargets.push(...this.getValidGearTargets(game, requirement, controllerId));
        break;

      case TargetType.PLAYER:
        validTargets.push(...this.getValidPlayerTargets(game, requirement));
        break;

      case TargetType.BATTLEFIELD:
        validTargets.push(...this.getValidBattlefieldTargets(game, requirement));
        break;

      case TargetType.CARD_IN_HAND:
        validTargets.push(...this.getValidHandTargets(game, requirement, controllerId));
        break;

      case TargetType.CARD_IN_TRASH:
        validTargets.push(...this.getValidTrashTargets(game, requirement, controllerId));
        break;
    }

    return validTargets;
  }

  /**
   * Get valid unit targets
   */
  private getValidUnitTargets(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): Target[] {
    const targets: Target[] = [];

    // Check battlefields
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        const target: Target = {
          type: TargetType.UNIT,
          cardId: unit.instanceId,
          restrictions: requirement.restrictions || []
        };

        if (!requirement.restrictions || this.validateRestrictions(game, target, requirement.restrictions).length === 0) {
          targets.push(target);
        }
      }
    }

    // Check bases
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        const target: Target = {
          type: TargetType.UNIT,
          cardId: unit.instanceId,
          restrictions: requirement.restrictions || []
        };

        if (!requirement.restrictions || this.validateRestrictions(game, target, requirement.restrictions).length === 0) {
          targets.push(target);
        }
      }
    }

    return targets;
  }

  /**
   * Get valid gear targets
   */
  private getValidGearTargets(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): Target[] {
    // TODO: Implement when gear system is added
    return [];
  }

  /**
   * Get valid player targets
   */
  private getValidPlayerTargets(
    game: Game,
    requirement: TargetRequirement
  ): Target[] {
    return game.players.map(player => ({
      type: TargetType.PLAYER,
      playerId: player.id,
      restrictions: requirement.restrictions || []
    }));
  }

  /**
   * Get valid battlefield targets
   */
  private getValidBattlefieldTargets(
    game: Game,
    requirement: TargetRequirement
  ): Target[] {
    return game.battlefields.map(battlefield => ({
      type: TargetType.BATTLEFIELD,
      battlefieldId: battlefield.id,
      restrictions: requirement.restrictions || []
    }));
  }

  /**
   * Get valid hand targets
   */
  private getValidHandTargets(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): Target[] {
    const targets: Target[] = [];
    const player = game.players.find(p => p.id === controllerId);

    if (!player) return targets;

    for (const card of player.zones.hand) {
      const target: Target = {
        type: TargetType.CARD_IN_HAND,
        cardId: card.instanceId,
        restrictions: requirement.restrictions || []
      };

      if (!requirement.restrictions || this.validateRestrictions(game, target, requirement.restrictions).length === 0) {
        targets.push(target);
      }
    }

    return targets;
  }

  /**
   * Get valid trash targets
   */
  private getValidTrashTargets(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): Target[] {
    const targets: Target[] = [];
    const player = game.players.find(p => p.id === controllerId);

    if (!player) return targets;

    for (const card of player.zones.trash) {
      const target: Target = {
        type: TargetType.CARD_IN_TRASH,
        cardId: card.instanceId,
        restrictions: requirement.restrictions || []
      };

      if (!requirement.restrictions || this.validateRestrictions(game, target, requirement.restrictions).length === 0) {
        targets.push(target);
      }
    }

    return targets;
  }

  /**
   * Check if targets are still valid (for chain resolution)
   */
  areTargetsStillValid(
    game: Game,
    targets: Target[],
    requirements: TargetRequirement[]
  ): boolean {
    // Check each target still exists and meets requirements
    for (const target of targets) {
      if (!this.isTargetStillValid(game, target)) {
        return false;
      }
    }

    // Check requirements are still met
    const validation = this.validateTargets(game, targets, requirements);
    return validation.isValid;
  }

  /**
   * Check if a single target is still valid
   */
  private isTargetStillValid(game: Game, target: Target): boolean {
    switch (target.type) {
      case TargetType.UNIT:
      case TargetType.GEAR:
      case TargetType.CARD_IN_HAND:
      case TargetType.CARD_IN_TRASH:
        // Check card still exists
        const card = this.getTargetCard(game, target);
        return !!card;

      case TargetType.PLAYER:
        // Check player still in game
        return !!game.players.find(p => p.id === target.playerId);

      case TargetType.BATTLEFIELD:
        // Check battlefield still exists
        return !!game.battlefields.find(b => b.id === target.battlefieldId);

      default:
        return false;
    }
  }

  /**
   * Count valid targets for a requirement
   */
  countValidTargets(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): number {
    return this.getValidTargets(game, requirement, controllerId).length;
  }

  /**
   * Check if requirement can be met
   */
  canMeetRequirement(
    game: Game,
    requirement: TargetRequirement,
    controllerId: string
  ): boolean {
    if (requirement.optional) {
      return true; // Optional requirements can always be "met" by not choosing targets
    }

    const validTargetCount = this.countValidTargets(game, requirement, controllerId);
    return validTargetCount >= requirement.count;
  }

  /**
   * Get targeting statistics
   */
  getTargetingStats(game: Game): {
    totalPossibleTargets: number;
    unitTargets: number;
    playerTargets: number;
    battlefieldTargets: number;
  } {
    let unitTargets = 0;

    // Count units on battlefields
    for (const battlefield of game.battlefields) {
      unitTargets += battlefield.units.length;
    }

    // Count units in bases
    for (const player of game.players) {
      unitTargets += player.zones.base.length;
    }

    return {
      totalPossibleTargets: unitTargets + game.players.length + game.battlefields.length,
      unitTargets,
      playerTargets: game.players.length,
      battlefieldTargets: game.battlefields.length
    };
  }
}
