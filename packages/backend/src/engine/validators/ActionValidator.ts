import {
  Game,
  GameAction,
  ActionType,
  GamePhase,
  TurnState,
  SpellTiming,
  Card,
  SpellCard,
  Keyword
} from '@/types/game';
import { RunePoolManager } from '../managers/RunePoolManager';
import { PriorityManager } from '../managers/PriorityManager';
import { logger } from '@/utils/logger';

/**
 * Validation result for game actions
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates actions and enforces Riftbound game rules
 */
export class ActionValidator {
  private runePoolManager: RunePoolManager;
  private priorityManager: PriorityManager;

  constructor(runePoolManager: RunePoolManager, priorityManager: PriorityManager) {
    this.runePoolManager = runePoolManager;
    this.priorityManager = priorityManager;
  }

  /**
   * Validate any game action
   */
  validateAction(game: Game, action: GameAction): ValidationResult {
    const errors: string[] = [];

    // Check if player can act
    if (!this.priorityManager.canTakeAction(game, action.playerId)) {
      errors.push('Player does not have priority to act');
      return { isValid: false, errors };
    }

    // Validate based on action type
    switch (action.type) {
      case ActionType.PLAY_CARD:
        errors.push(...this.validatePlayCardAction(game, action));
        break;

      case ActionType.ACTIVATE_ABILITY:
        errors.push(...this.validateActivateAbilityAction(game, action));
        break;

      case ActionType.STANDARD_MOVE:
        errors.push(...this.validateStandardMoveAction(game, action));
        break;

      case ActionType.HIDE_CARD:
        errors.push(...this.validateHideCardAction(game, action));
        break;

      case ActionType.PASS_PRIORITY:
        // Pass priority is always valid if player has priority
        break;

      default:
        errors.push(`Unknown action type: ${action.type}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate playing a card
   */
  validatePlayCard(game: Game, playerId: string, cardId: string): ValidationResult {
    const errors: string[] = [];

    // Check player has priority
    if (!this.priorityManager.hasPriority(game, playerId)) {
      errors.push('Player does not have priority');
    }

    // Check phase restrictions
    const phaseError = this.validatePhaseRestrictions(game, ActionType.PLAY_CARD);
    if (phaseError) {
      errors.push(phaseError);
    }

    // TODO: Get actual card from game state
    // For now, we can't validate card-specific rules without card data

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate activating an ability
   */
  validateActivateAbility(game: Game, playerId: string, abilityId: string): ValidationResult {
    const errors: string[] = [];

    // Check player has priority
    if (!this.priorityManager.hasPriority(game, playerId)) {
      errors.push('Player does not have priority');
    }

    // TODO: Validate ability-specific rules when ability system is implemented

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate standard move action
   */
  canStandardMove(game: Game, playerId: string, unitId: string, toBattlefield: string): ValidationResult {
    const errors: string[] = [];

    // Can only move during Action Phase
    if (game.phase !== GamePhase.ACTION) {
      errors.push('Can only move units during Action Phase');
    }

    // Cannot move during Closed State or Showdown
    if (game.turnState !== TurnState.NEUTRAL_OPEN) {
      errors.push('Cannot move units during Closed State or Showdown');
    }

    // Check player has priority
    if (!this.priorityManager.hasPriority(game, playerId)) {
      errors.push('Player does not have priority to move');
    }

    // TODO: Validate specific movement rules:
    // - Unit must be ready (not exhausted)
    // - Valid destination (Base <-> Battlefield, or Battlefield -> Battlefield with Ganking)
    // - Cannot move to battlefield with units from 2+ other players

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Energy and Power costs
   */
  validateEnergyAndPowerCosts(game: Game, playerId: string, card: Card): ValidationResult {
    const errors: string[] = [];

    // Check if player can afford the card
    if (!this.runePoolManager.canAffordCard(game, playerId, card)) {
      errors.push(`Player cannot afford card ${card.name} (Energy: ${card.energyCost}, Power: ${card.powerCost.map(p => `${p.amount}${p.domain}`).join(', ')})`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate spell timing
   */
  validateSpellTiming(game: Game, spell: SpellCard): ValidationResult {
    const errors: string[] = [];

    const timing = spell.spellTiming;

    switch (timing) {
      case SpellTiming.NORMAL:
        // Only during Neutral Open in own turn
        if (game.turnState !== TurnState.NEUTRAL_OPEN) {
          errors.push('Normal timing spells can only be played during Neutral Open state');
        }
        break;

      case SpellTiming.ACTION:
        // During Neutral Open (own turn) or Showdowns
        if (game.turnState === TurnState.NEUTRAL_CLOSED) {
          errors.push('Action timing spells cannot be played during Neutral Closed state');
        }
        break;

      case SpellTiming.REACTION:
        // Can be played anytime
        break;

      default:
        errors.push(`Unknown spell timing: ${timing}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Play Card action (internal)
   */
  private validatePlayCardAction(game: Game, action: GameAction): string[] {
    const errors: string[] = [];

    // Must be in Action Phase (or specific phases for certain cards)
    if (game.phase !== GamePhase.ACTION) {
      errors.push('Can only play cards during Action Phase');
    }

    // TODO: Validate card-specific rules when card database is available
    // - Card must be in hand
    // - Energy/Power costs must be payable
    // - Spell timing must be appropriate
    // - Targets must be valid

    return errors;
  }

  /**
   * Validate Activate Ability action (internal)
   */
  private validateActivateAbilityAction(game: Game, action: GameAction): string[] {
    const errors: string[] = [];

    // Abilities can be activated during Action Phase or based on their timing
    if (game.phase !== GamePhase.ACTION) {
      // Some abilities may have special timing, check that
      // For now, restrict to Action Phase
      errors.push('Can only activate abilities during Action Phase');
    }

    // TODO: Validate ability-specific rules
    // - Ability must be activatable (not already used, correct timing, etc.)
    // - Costs must be payable
    // - Targets must be valid

    return errors;
  }

  /**
   * Validate Standard Move action (internal)
   */
  private validateStandardMoveAction(game: Game, action: GameAction): string[] {
    const errors: string[] = [];

    if (!action.data.cardId || !action.data.battlefieldId) {
      errors.push('Standard move requires unitId and battlefieldId');
      return errors;
    }

    // Use public method for validation
    const result = this.canStandardMove(
      game,
      action.playerId,
      action.data.cardId,
      action.data.battlefieldId
    );

    return result.errors;
  }

  /**
   * Validate Hide Card action (internal)
   */
  private validateHideCardAction(game: Game, action: GameAction): string[] {
    const errors: string[] = [];

    // Can only hide during Action Phase
    if (game.phase !== GamePhase.ACTION) {
      errors.push('Can only hide cards during Action Phase');
    }

    // Cannot hide during Closed State or Showdown
    if (game.turnState !== TurnState.NEUTRAL_OPEN) {
      errors.push('Cannot hide cards during Closed State or Showdown');
    }

    // TODO: Validate card has Hidden keyword and other hide restrictions

    return errors;
  }

  /**
   * Validate phase restrictions for an action
   */
  private validatePhaseRestrictions(game: Game, actionType: ActionType): string | null {
    // Most discretionary actions are only allowed during Action Phase
    const discretionaryActions = [
      ActionType.PLAY_CARD,
      ActionType.ACTIVATE_ABILITY,
      ActionType.STANDARD_MOVE,
      ActionType.HIDE_CARD
    ];

    if (discretionaryActions.includes(actionType)) {
      if (game.phase !== GamePhase.ACTION) {
        return `${actionType} can only be performed during Action Phase`;
      }
    }

    return null;
  }

  /**
   * Check if player has priority
   */
  validatePlayerHasPriority(game: Game, playerId: string): ValidationResult {
    const hasPriority = this.priorityManager.hasPriority(game, playerId);

    return {
      isValid: hasPriority,
      errors: hasPriority ? [] : ['Player does not have priority']
    };
  }

  /**
   * Get validation errors as formatted string
   */
  formatErrors(errors: string[]): string {
    return errors.join('; ');
  }
}
