/**
 * CastSpellAction - Casts a spell by adding it to the Chain.
 *
 * Handles:
 * - Creating ChainItem for the spell
 * - Adding to game.chain
 * - Changing turn state to Closed
 * - Timing validation (Default/Action/Reaction)
 *
 * @module engine/actions/concrete/CastSpellAction
 */

import { GameAction } from '../base/GameAction';
import type {
  Game,
  Player,
  GameCard,
  GameEvent,
  ChainItem,
  ChainItemType,
  SpellTiming,
  TurnState,
} from '../../../types/game';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  GameActionType,
} from '../../../types/actions';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';

export interface CastSpellActionData {
  /** Spell card to cast */
  spell: GameCard;

  /** Targets for the spell (if any) */
  targets?: any[];
}

/**
 * Action that casts a spell by adding it to the Chain.
 *
 * The spell will be resolved later when the Chain resolves.
 * Resolution happens via CardScriptRuntime executing the spell's onPlay hook.
 */
export class CastSpellAction extends GameAction<CastSpellActionData> {
  public readonly type: GameActionType = 'cast_spell' as GameActionType;

  constructor(
    controller: Player,
    data: CastSpellActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { spell, targets } = this.data;

    // Validate spell is in player's hand
    const hand = this.controller.zones.hand || [];
    const spellInHand = hand.find((c: any) => c.instanceId === spell.instanceId);

    if (!spellInHand) {
      return this.validationFailure('Spell not in hand', {
        spellId: spell.instanceId,
      });
    }

    // Validate spell is actually a spell card
    if (spell.cardType !== 'spell' as any) {
      return this.validationFailure('Card is not a spell', {
        cardType: spell.cardType,
      });
    }

    // Validate timing based on spell keywords
    const timingValid = this.validateSpellTiming(game, spell);
    if (!timingValid.valid) {
      return timingValid;
    }

    // Validate targets
    const targetsValid = this.validateTargets(game, spell, targets);
    if (!targetsValid.valid) {
      return targetsValid;
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { spell, targets } = this.data;

    try {
      // Create ChainItem for the spell
      const spellTiming = this.getSpellTiming(spell);
      const chainItem: ChainItem = {
        id: uuidv4(),
        type: 'spell' as ChainItemType,
        sourceCardId: spell.cardId,
        sourceCard: spell, // Reference to actual card for counter spells
        controllerId: this.controller.id,
        targets: this.convertTargets(targets || []),
        effects: [], // Empty - effects will be executed via CardScriptRuntime
        spellTiming,
        timestamp: new Date(),
        resolved: false,
      };

      // Add to chain
      game.chain = game.chain || [];
      game.chain.push(chainItem);

      // Change turn state to Closed (Chain is now active)
      const wasOpen = game.turnState === ('neutral_open' as TurnState) || game.turnState === ('showdown_open' as TurnState);
      if (wasOpen) {
        game.turnState = game.turnState === ('neutral_open' as TurnState)
          ? ('neutral_closed' as TurnState)
          : ('showdown_closed' as TurnState);

        logger.debug(`CastSpellAction: Turn state changed to ${game.turnState}`);
      }

      logger.info(`CastSpellAction: Spell ${spell.name} added to chain. Chain depth: ${game.chain.length}`);

      return this.executionSuccess([], {
        spellId: spell.instanceId,
        chainItemId: chainItem.id,
        chainDepth: game.chain.length,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  /**
   * Validate spell timing based on keywords and turn state.
   */
  private validateSpellTiming(game: Game, spell: GameCard): ActionValidationResult {
    const turnState = game.turnState as TurnState;
    const spellTiming = this.getSpellTiming(spell);
    const currentPlayer = game.players[game.currentPlayerIndex];
    const isActivePlayer = currentPlayer?.id === this.controller.id;

    // NORMAL timing: Only Neutral Open in own turn
    if (spellTiming === ('normal' as SpellTiming)) {
      if (turnState !== ('neutral_open' as TurnState)) {
        return this.validationFailure(
          'Normal spells can only be cast during Neutral Open state',
          { spellTiming, turnState }
        );
      }
      if (!isActivePlayer) {
        return this.validationFailure(
          'Normal spells can only be cast during your own turn',
          { spellTiming }
        );
      }
    }

    // ACTION timing: Neutral Open (own turn) OR Showdown states
    if (spellTiming === ('action' as SpellTiming)) {
      if (turnState === ('neutral_closed' as TurnState)) {
        return this.validationFailure(
          'Action spells cannot be cast during Neutral Closed state without Reaction',
          { spellTiming, turnState }
        );
      }
      if (turnState === ('neutral_open' as TurnState) && !isActivePlayer) {
        return this.validationFailure(
          'Action spells can only be cast during your turn in Neutral Open',
          { spellTiming }
        );
      }
    }

    // REACTION timing: Always allowed (no restrictions)

    return this.validationSuccess();
  }

  /**
   * Get spell timing from keywords.
   */
  private getSpellTiming(spell: GameCard): SpellTiming {
    const keywords = (spell as any).keywords || [];

    if (keywords.includes('Reaction')) {
      return 'reaction' as SpellTiming;
    }
    if (keywords.includes('Action')) {
      return 'action' as SpellTiming;
    }
    return 'normal' as SpellTiming;
  }

  /**
   * Validate targets are legal.
   */
  private validateTargets(
    game: Game,
    spell: GameCard,
    targets?: any[]
  ): ActionValidationResult {
    // TODO: Implement target validation based on card script metadata
    // For now, accept any targets
    return this.validationSuccess();
  }

  /**
   * Convert target data to Target interface format.
   */
  private convertTargets(targets: any[]): any[] {
    // TODO: Convert to proper Target format
    // For now, return as-is
    return targets.map(t => ({
      type: t.type || 'unit',
      cardId: t.cardId,
      playerId: t.playerId,
      battlefieldId: t.battlefieldId,
      restrictions: [],
    }));
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'spell_cast' as any,
      timestamp: this.timestamp,
      data: {
        spell: this.data.spell.instanceId,
        spellCardId: (this.data.spell as any).cardId,
        controller: this.controller.id,
        targets: this.data.targets,
      },
    };
  }

  clone(): CastSpellAction {
    const cloned = new CastSpellAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    const spellName = (this.data.spell as any).name || 'Spell';
    return `${this.controller.name} casts ${spellName}`;
  }
}
