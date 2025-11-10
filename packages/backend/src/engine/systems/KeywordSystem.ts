import {
  Game,
  GameCard,
  Keyword,
  CombatUnit
} from '@/types/game';
import { logger } from '@/utils/logger';

/**
 * Manages keyword mechanics and their effects
 *
 * Keywords:
 * - Accelerate: enters ready instead of exhausted
 * - Assault: +X Might when attacking
 * - Deflect: redirect damage
 * - Ganking: can move battlefield to battlefield
 * - Shield: +X Might when defending
 * - Tank: must receive lethal damage before other units
 * - Temporary: goes to trash at end of turn
 * - Vision: can see hidden information
 * - Deathknell: triggered when unit dies
 * - Hidden: can be placed facedown
 */
export class KeywordSystem {

  /**
   * Check if card has a keyword
   */
  hasKeyword(card: GameCard, keyword: Keyword): boolean {
    // TODO: Get actual keywords from card definition
    // For now, check temporary modifiers
    return false;
  }

  /**
   * Get all keywords on a card
   */
  getKeywords(card: GameCard): Keyword[] {
    // TODO: Get actual keywords from card definition
    return [];
  }

  /**
   * Apply Accelerate keyword
   * Unit enters ready instead of exhausted
   */
  applyAccelerate(card: GameCard): void {
    if (this.hasKeyword(card, Keyword.ACCELERATE)) {
      card.ready = true;
      logger.debug(`KeywordSystem: Applied Accelerate to ${card.instanceId} - enters ready`);
    }
  }

  /**
   * Apply Assault keyword
   * +X Might when attacking
   */
  applyAssault(combatUnit: CombatUnit, assaultValue: number = 2): void {
    if (combatUnit.hasAssaultBonus) {
      combatUnit.might += assaultValue;
      logger.debug(`KeywordSystem: Applied Assault +${assaultValue} to combat unit`);
    }
  }

  /**
   * Apply Shield keyword
   * +X Might when defending
   */
  applyShield(combatUnit: CombatUnit, shieldValue: number = 2): void {
    if (combatUnit.hasShieldBonus) {
      combatUnit.might += shieldValue;
      logger.debug(`KeywordSystem: Applied Shield +${shieldValue} to combat unit`);
    }
  }

  /**
   * Check if unit can use Ganking
   */
  canUseGanking(card: GameCard): boolean {
    return this.hasKeyword(card, Keyword.GANKING);
  }

  /**
   * Check if unit has Tank keyword
   */
  isTank(card: GameCard): boolean {
    return this.hasKeyword(card, Keyword.TANK);
  }

  /**
   * Check if card has Hidden keyword
   */
  canBeHidden(card: GameCard): boolean {
    return this.hasKeyword(card, Keyword.HIDDEN);
  }

  /**
   * Check if card is Temporary
   */
  isTemporary(card: GameCard): boolean {
    return this.hasKeyword(card, Keyword.TEMPORARY);
  }

  /**
   * Check if unit has Vision
   */
  hasVision(card: GameCard): boolean {
    return this.hasKeyword(card, Keyword.VISION);
  }

  /**
   * Apply Deflect keyword
   * Redirect damage to another target
   */
  applyDeflect(
    game: Game,
    card: GameCard,
    damage: number,
    deflectTarget?: string
  ): { deflected: boolean; newTarget: string | undefined; remainingDamage: number } {
    if (!this.hasKeyword(card, Keyword.DEFLECT)) {
      return { deflected: false, newTarget: undefined, remainingDamage: damage };
    }

    // Deflect redirects damage to another unit
    logger.info(`KeywordSystem: ${card.instanceId} deflecting ${damage} damage`);

    // TODO: Implement deflect target selection
    const finalTarget = deflectTarget !== undefined ? deflectTarget : undefined;

    return {
      deflected: true,
      newTarget: finalTarget,
      remainingDamage: 0
    };
  }

  /**
   * Get keyword value (for keywords with numeric values like Assault 2, Shield 3)
   */
  getKeywordValue(card: GameCard, keyword: Keyword): number {
    // TODO: Get actual keyword value from card definition
    // For now, return default values
    switch (keyword) {
      case Keyword.ASSAULT:
        return 2;
      case Keyword.SHIELD:
        return 2;
      default:
        return 0;
    }
  }

  /**
   * Add keyword to card temporarily
   */
  addKeywordTemporarily(card: GameCard, keyword: Keyword, duration: string): void {
    // This would add a temporary modifier with keyword grant
    logger.debug(`KeywordSystem: Adding ${keyword} to ${card.instanceId} until ${duration}`);
    // TODO: Implement via temporary modifiers
  }

  /**
   * Remove keyword from card
   */
  removeKeyword(card: GameCard, keyword: Keyword): void {
    logger.debug(`KeywordSystem: Removing ${keyword} from ${card.instanceId}`);
    // TODO: Implement via temporary modifiers
  }

  /**
   * Get all units with a specific keyword in game
   */
  getUnitsWithKeyword(game: Game, keyword: Keyword): GameCard[] {
    const units: GameCard[] = [];

    // Check battlefields
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        if (this.hasKeyword(unit, keyword)) {
          units.push(unit);
        }
      }
    }

    // Check bases
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        if (this.hasKeyword(unit, keyword)) {
          units.push(unit);
        }
      }
    }

    return units;
  }

  /**
   * Check if player can see hidden cards (Vision)
   */
  canSeeHiddenCards(game: Game, playerId: string): boolean {
    // Check if player has any units with Vision
    const visionUnits = this.getUnitsWithKeyword(game, Keyword.VISION);
    return visionUnits.some(unit => unit.controllerId === playerId);
  }

  /**
   * Get combat-relevant keywords for a unit
   */
  getCombatKeywords(card: GameCard): Keyword[] {
    const combatKeywords = [
      Keyword.ASSAULT,
      Keyword.SHIELD,
      Keyword.TANK,
      Keyword.DEFLECT
    ];

    return this.getKeywords(card).filter(keyword =>
      combatKeywords.includes(keyword)
    );
  }

  /**
   * Get movement-relevant keywords for a unit
   */
  getMovementKeywords(card: GameCard): Keyword[] {
    const movementKeywords = [
      Keyword.ACCELERATE,
      Keyword.GANKING
    ];

    return this.getKeywords(card).filter(keyword =>
      movementKeywords.includes(keyword)
    );
  }

  /**
   * Check if keyword affects combat
   */
  isKeywordRelevantForCombat(keyword: Keyword): boolean {
    const combatKeywords = [
      Keyword.ASSAULT,
      Keyword.SHIELD,
      Keyword.TANK,
      Keyword.DEFLECT
    ];

    return combatKeywords.includes(keyword);
  }

  /**
   * Check if keyword affects movement
   */
  isKeywordRelevantForMovement(keyword: Keyword): boolean {
    const movementKeywords = [
      Keyword.ACCELERATE,
      Keyword.GANKING
    ];

    return movementKeywords.includes(keyword);
  }

  /**
   * Apply all relevant keywords for entering play
   */
  applyEnteringPlayKeywords(card: GameCard): void {
    // Apply Accelerate if present
    this.applyAccelerate(card);

    // Other enter-play keywords would be applied here
    logger.debug(`KeywordSystem: Applied entering play keywords for ${card.instanceId}`);
  }

  /**
   * Get keyword description
   */
  getKeywordDescription(keyword: Keyword): string {
    switch (keyword) {
      case Keyword.ACCELERATE:
        return 'Enters ready instead of exhausted';
      case Keyword.ASSAULT:
        return 'Gets +X Might when attacking';
      case Keyword.DEFLECT:
        return 'Redirect damage to another target';
      case Keyword.GANKING:
        return 'Can move from battlefield to battlefield';
      case Keyword.SHIELD:
        return 'Gets +X Might when defending';
      case Keyword.TANK:
        return 'Must receive lethal damage before other units';
      case Keyword.TEMPORARY:
        return 'Goes to trash at end of turn';
      case Keyword.VISION:
        return 'Can see hidden information';
      case Keyword.DEATHKNELL:
        return 'Triggered when this unit dies';
      case Keyword.HIDDEN:
        return 'Can be placed facedown at battlefields';
      case Keyword.ACTION:
        return 'Can be played during Showdowns';
      case Keyword.REACTION:
        return 'Can be played anytime, even during Closed State';
      case Keyword.LEGION:
        return 'Affects multiple targets';
      default:
        return 'Unknown keyword';
    }
  }

  /**
   * Get keyword statistics
   */
  getKeywordStats(game: Game): {
    totalKeywords: number;
    keywordCounts: Record<Keyword, number>;
    unitsWithKeywords: number;
  } {
    const keywordCounts: Record<Keyword, number> = {} as Record<Keyword, number>;
    let totalKeywords = 0;
    let unitsWithKeywords = 0;

    // Count keywords on battlefields
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        const keywords = this.getKeywords(unit);
        if (keywords.length > 0) {
          unitsWithKeywords++;
          totalKeywords += keywords.length;

          for (const keyword of keywords) {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
          }
        }
      }
    }

    // Count keywords in bases
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        const keywords = this.getKeywords(unit);
        if (keywords.length > 0) {
          unitsWithKeywords++;
          totalKeywords += keywords.length;

          for (const keyword of keywords) {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
          }
        }
      }
    }

    return {
      totalKeywords,
      keywordCounts,
      unitsWithKeywords
    };
  }
}
