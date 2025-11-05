/**
 * TargetingSystem - Manages target selection and validation
 *
 * Responsibilities:
 * - Find all valid targets for a card/ability based on requirements
 * - Validate selected targets against requirements and restrictions
 * - Resolve target IDs to actual game objects (GameCard, Player, Battlefield, ChainItem)
 * - Support multiple target types and complex restrictions
 *
 * Design Pattern: Metadata-Driven
 * - Cards declare target requirements in metadata
 * - User selects targets BEFORE script execution
 * - Scripts receive validated targets in ctx.targets
 * - No async waiting inside scripts
 */

import type {
  Game,
  GameCard,
  Player,
  Battlefield,
  ChainItem,
  Target,
  TargetType,
  TargetRequirement,
  TargetRestriction,
  TargetProperty,
  ComparisonOperator,
} from '../../types/game';

// ============================================================================
// TYPES
// ============================================================================

/**
 * A valid target that can be selected by the player
 */
export interface ValidTarget {
  type: TargetType;
  id: string;
  displayName: string;
  description?: string;
  object: GameCard | Player | Battlefield | ChainItem;
}

/**
 * A target that has been resolved from ID to actual game object
 */
export interface ResolvedTarget {
  original: Target;
  resolved: GameCard | Player | Battlefield | ChainItem;
}

/**
 * Result of target validation
 */
export interface TargetValidationResult {
  valid: boolean;
  errors?: TargetValidationError[];
}

/**
 * Specific validation error
 */
export interface TargetValidationError {
  type: 'missing_required' | 'invalid_type' | 'restriction_failed' | 'too_many' | 'too_few';
  message: string;
  requirement?: TargetRequirement;
  target?: Target;
}

// ============================================================================
// TARGETING SYSTEM
// ============================================================================

export class TargetingSystem {
  /**
   * Find all valid targets for a card/ability based on requirements
   *
   * @param game - Current game state
   * @param playerId - Player who is targeting
   * @param requirements - Target requirements from card metadata
   * @returns Array of valid targets that can be selected
   */
  getValidTargets(
    game: Game,
    playerId: string,
    requirements: TargetRequirement[]
  ): ValidTarget[] {
    const validTargets: ValidTarget[] = [];

    for (const requirement of requirements) {
      const targets = this.getValidTargetsForRequirement(game, playerId, requirement);
      validTargets.push(...targets);
    }

    return validTargets;
  }

  /**
   * Get valid targets for a single requirement
   */
  private getValidTargetsForRequirement(
    game: Game,
    playerId: string,
    requirement: TargetRequirement
  ): ValidTarget[] {
    switch (requirement.targetType) {
      case 'unit':
      case 'gear':
      case 'card_in_hand':
      case 'card_in_trash':
        return this.getValidCardTargets(game, playerId, requirement);

      case 'player':
        return this.getValidPlayerTargets(game, playerId, requirement);

      case 'battlefield':
        return this.getValidBattlefieldTargets(game, playerId, requirement);

      // Special case: ChainItem (for counter spells)
      default:
        // Check if it's a chain item (not in enum yet, handled as string)
        if (requirement.targetType === ('chain_item' as TargetType)) {
          return this.getValidChainItemTargets(game, playerId, requirement);
        }
        return [];
    }
  }

  /**
   * Get valid card targets (units, gear, cards in hand/trash)
   */
  private getValidCardTargets(
    game: Game,
    playerId: string,
    requirement: TargetRequirement
  ): ValidTarget[] {
    const validTargets: ValidTarget[] = [];
    const cards = this.getAllCardsInGame(game, requirement.targetType);

    for (const card of cards) {
      if (this.canTargetCard(game, card, requirement.restrictions || [])) {
        validTargets.push({
          type: requirement.targetType,
          id: card.instanceId,
          displayName: card.name,
          description: this.getCardDescription(card),
          object: card,
        });
      }
    }

    return validTargets;
  }

  /**
   * Get valid player targets
   */
  private getValidPlayerTargets(
    game: Game,
    playerId: string,
    requirement: TargetRequirement
  ): ValidTarget[] {
    const validTargets: ValidTarget[] = [];

    for (const player of game.players) {
      if (this.canTargetPlayer(game, player, requirement.restrictions || [])) {
        validTargets.push({
          type: 'player' as TargetType,
          id: player.id,
          displayName: player.name,
          description: `Score: ${player.score}`,
          object: player,
        });
      }
    }

    return validTargets;
  }

  /**
   * Get valid battlefield targets
   */
  private getValidBattlefieldTargets(
    game: Game,
    playerId: string,
    requirement: TargetRequirement
  ): ValidTarget[] {
    const validTargets: ValidTarget[] = [];

    for (const battlefield of game.battlefields) {
      if (this.canTargetBattlefield(game, battlefield, requirement.restrictions || [])) {
        validTargets.push({
          type: 'battlefield' as TargetType,
          id: battlefield.id,
          displayName: battlefield.card.name || `Battlefield ${battlefield.id}`,
          description: `Controller: ${battlefield.controller || 'None'}`,
          object: battlefield,
        });
      }
    }

    return validTargets;
  }

  /**
   * Get valid chain item targets (for counter spells)
   */
  private getValidChainItemTargets(
    game: Game,
    playerId: string,
    requirement: TargetRequirement
  ): ValidTarget[] {
    const validTargets: ValidTarget[] = [];

    for (const chainItem of game.chain) {
      // Skip resolved items
      if (chainItem.resolved) continue;

      if (this.canTargetChainItem(game, chainItem, requirement.restrictions || [])) {
        validTargets.push({
          type: 'chain_item' as TargetType,
          id: chainItem.id,
          displayName: chainItem.sourceCard?.name || 'Spell/Ability',
          description: `Type: ${chainItem.type}`,
          object: chainItem,
        });
      }
    }

    return validTargets;
  }

  /**
   * Validate selected targets against requirements
   *
   * @param game - Current game state
   * @param playerId - Player who selected targets
   * @param requirements - Target requirements from card metadata
   * @param selectedTargets - Targets selected by player
   * @returns Validation result with errors if invalid
   */
  validateTargets(
    game: Game,
    playerId: string,
    requirements: TargetRequirement[],
    selectedTargets: Target[]
  ): TargetValidationResult {
    const errors: TargetValidationError[] = [];

    // Group targets by type
    const targetsByType = new Map<TargetType, Target[]>();
    for (const target of selectedTargets) {
      const existing = targetsByType.get(target.type) || [];
      existing.push(target);
      targetsByType.set(target.type, existing);
    }

    // First, check for targets with types that don't match any requirement
    const validTargetTypes = new Set(requirements.map(r => r.targetType));
    for (const target of selectedTargets) {
      if (!validTargetTypes.has(target.type)) {
        const matchingRequirement = requirements[0]; // Use first requirement as reference
        if (matchingRequirement) {
          errors.push({
            type: 'invalid_type',
            message: `Invalid target type: expected one of [${Array.from(validTargetTypes).join(', ')}], got ${target.type}`,
            requirement: matchingRequirement,
            target,
          });
        }
      }
    }

    // If we found invalid types, return early (don't check for missing targets)
    if (errors.length > 0) {
      return {
        valid: false,
        errors,
      };
    }

    // Validate each requirement
    for (const requirement of requirements) {
      const targetsForType = targetsByType.get(requirement.targetType) || [];

      // Check count
      if (!requirement.optional && targetsForType.length === 0) {
        errors.push({
          type: 'missing_required',
          message: `Missing required target of type ${requirement.targetType}`,
          requirement,
        });
        continue;
      }

      if (targetsForType.length > requirement.count) {
        errors.push({
          type: 'too_many',
          message: `Too many targets: expected ${requirement.count}, got ${targetsForType.length}`,
          requirement,
        });
        continue;
      }

      if (!requirement.optional && targetsForType.length < requirement.count) {
        errors.push({
          type: 'too_few',
          message: `Too few targets: expected ${requirement.count}, got ${targetsForType.length}`,
          requirement,
        });
        continue;
      }

      // Validate each target
      for (const target of targetsForType) {
        const validationError = this.validateSingleTarget(game, target, requirement);
        if (validationError) {
          errors.push(validationError);
        }
      }
    }

    if (errors.length === 0) {
      return {
        valid: true,
      };
    }

    return {
      valid: false,
      errors,
    };
  }

  /**
   * Validate a single target against a requirement
   */
  private validateSingleTarget(
    game: Game,
    target: Target,
    requirement: TargetRequirement
  ): TargetValidationError | null {
    // Type mismatch
    if (target.type !== requirement.targetType) {
      return {
        type: 'invalid_type',
        message: `Invalid target type: expected ${requirement.targetType}, got ${target.type}`,
        requirement,
        target,
      };
    }

    // Resolve target to check restrictions
    const resolved = this.resolveSingleTarget(game, target);
    if (!resolved) {
      return {
        type: 'restriction_failed',
        message: `Target not found: ${target.cardId || target.playerId || target.battlefieldId}`,
        requirement,
        target,
      };
    }

    // Check restrictions
    const restrictions = requirement.restrictions || [];
    const canTarget = this.checkRestrictions(resolved.resolved, restrictions);

    if (!canTarget) {
      return {
        type: 'restriction_failed',
        message: `Target does not meet restrictions`,
        requirement,
        target,
      };
    }

    return null;
  }

  /**
   * Resolve target IDs to actual game objects
   *
   * @param game - Current game state
   * @param targets - Targets with IDs to resolve
   * @returns Array of resolved targets
   */
  resolveTargets(game: Game, targets: Target[]): ResolvedTarget[] {
    const resolved: ResolvedTarget[] = [];

    for (const target of targets) {
      const resolvedTarget = this.resolveSingleTarget(game, target);
      if (resolvedTarget) {
        resolved.push(resolvedTarget);
      }
    }

    return resolved;
  }

  /**
   * Resolve a single target ID to game object
   */
  private resolveSingleTarget(game: Game, target: Target): ResolvedTarget | null {
    let resolved: GameCard | Player | Battlefield | ChainItem | null = null;

    switch (target.type) {
      case 'unit':
      case 'gear':
      case 'card_in_hand':
      case 'card_in_trash':
        if (target.cardId) {
          resolved = this.findCardById(game, target.cardId);
        }
        break;

      case 'player':
        if (target.playerId) {
          resolved = game.players.find(p => p.id === target.playerId) || null;
        }
        break;

      case 'battlefield':
        if (target.battlefieldId) {
          resolved = game.battlefields.find(bf => bf.id === target.battlefieldId) || null;
        }
        break;

      default:
        // Chain item
        if (target.type === ('chain_item' as TargetType)) {
          resolved = game.chain.find(item => item.id === target.cardId) || null;
        }
    }

    if (!resolved) return null;

    return {
      original: target,
      resolved,
    };
  }

  // ============================================================================
  // RESTRICTION CHECKING
  // ============================================================================

  /**
   * Check if a card can be targeted
   */
  canTargetCard(
    game: Game,
    targetCard: GameCard,
    restrictions: TargetRestriction[]
  ): boolean {
    return this.checkRestrictions(targetCard, restrictions);
  }

  /**
   * Check if a player can be targeted
   */
  canTargetPlayer(
    game: Game,
    targetPlayer: Player,
    restrictions: TargetRestriction[]
  ): boolean {
    return this.checkRestrictions(targetPlayer, restrictions);
  }

  /**
   * Check if a battlefield can be targeted
   */
  canTargetBattlefield(
    game: Game,
    battlefield: Battlefield,
    restrictions: TargetRestriction[]
  ): boolean {
    return this.checkRestrictions(battlefield, restrictions);
  }

  /**
   * Check if a chain item can be targeted
   */
  canTargetChainItem(
    game: Game,
    chainItem: ChainItem,
    restrictions: TargetRestriction[]
  ): boolean {
    // For chain items, check restrictions on the source card
    if (chainItem.sourceCard) {
      return this.checkRestrictions(chainItem.sourceCard, restrictions);
    }
    return restrictions.length === 0; // No restrictions = always valid
  }

  /**
   * Check all restrictions against a target object
   */
  private checkRestrictions(
    target: GameCard | Player | Battlefield | ChainItem,
    restrictions: TargetRestriction[]
  ): boolean {
    for (const restriction of restrictions) {
      if (!this.checkSingleRestriction(target, restriction)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check a single restriction
   */
  private checkSingleRestriction(
    target: GameCard | Player | Battlefield | ChainItem,
    restriction: TargetRestriction
  ): boolean {
    const value = this.getPropertyValue(target, restriction.property);
    const expected = restriction.value;

    switch (restriction.operator) {
      case 'equals':
        return value === expected;

      case 'not_equals':
        return value !== expected;

      case 'greater_than':
        return typeof value === 'number' && value > expected;

      case 'less_than':
        return typeof value === 'number' && value < expected;

      case 'contains':
        if (Array.isArray(value)) {
          return value.includes(expected);
        }
        if (typeof value === 'string') {
          return value.includes(expected);
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Get property value from target object
   */
  private getPropertyValue(
    target: GameCard | Player | Battlefield | ChainItem,
    property: TargetProperty
  ): any {
    // GameCard properties
    if ('cardType' in target) {
      switch (property) {
        case 'card_type':
          return target.cardType;
        case 'might':
          return target.might;
        case 'energy_cost':
          return target.energyCost;
        case 'domain':
          return target.domains;
        case 'keyword':
          return target.keywords;
        case 'tag':
          return target.tags;
        default:
          return undefined;
      }
    }

    // Player properties
    if ('score' in target && 'runePool' in target) {
      // Could add player-specific properties here
      return undefined;
    }

    // Battlefield properties
    if ('controller' in target && 'units' in target) {
      // Could add battlefield-specific properties here
      return undefined;
    }

    // ChainItem - check sourceCard
    if ('sourceCard' in target && target.sourceCard) {
      return this.getPropertyValue(target.sourceCard, property);
    }

    return undefined;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get all cards in game matching target type
   */
  private getAllCardsInGame(game: Game, targetType: TargetType): GameCard[] {
    const cards: GameCard[] = [];

    for (const player of game.players) {
      // Hand
      if (targetType === 'card_in_hand') {
        cards.push(...player.zones.hand);
      }

      // Trash
      if (targetType === 'card_in_trash') {
        cards.push(...player.zones.trash);
      }

      // Units and Gear on battlefield
      if (targetType === 'unit' || targetType === 'gear') {
        cards.push(...player.zones.base);
      }
    }

    // Units on battlefields
    if (targetType === 'unit') {
      for (const battlefield of game.battlefields) {
        cards.push(...battlefield.units);
      }
    }

    return cards;
  }

  /**
   * Find a card by instance ID anywhere in the game
   */
  private findCardById(game: Game, instanceId: string): GameCard | null {
    for (const player of game.players) {
      // Check all zones
      const zones = [
        player.zones.hand,
        player.zones.base,
        player.zones.trash,
        player.zones.banishment || [],
        player.zones.mainDeck,
        player.zones.runeDeck,
      ];

      for (const zone of zones) {
        const card = zone.find(c => c.instanceId === instanceId);
        if (card) return card;
      }
    }

    // Check battlefields
    for (const battlefield of game.battlefields) {
      const card = battlefield.units.find(u => u.instanceId === instanceId);
      if (card) return card;
    }

    return null;
  }

  /**
   * Get card description for display
   */
  private getCardDescription(card: GameCard): string {
    const parts: string[] = [];

    if (card.might !== undefined) {
      parts.push(`${card.might} Might`);
    }

    if (card.energyCost) {
      parts.push(`${card.energyCost} Energy`);
    }

    if (card.zone) {
      parts.push(`Zone: ${card.zone}`);
    }

    return parts.join(' • ');
  }
}
