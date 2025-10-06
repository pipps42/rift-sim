import {
  Deck,
  DeckValidationError,
  ValidationErrorType,
  LegendCard,
  Card,
  CardType,
  Domain
} from '@/types/game';
import { logger } from '@/utils/logger';

/**
 * Validates Riftbound decks according to official rules
 */
export class DeckValidator {

  /**
   * Main deck validation function
   */
  async validateDeck(deck: Deck): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: DeckValidationError[] = [];

    // Basic structure validation
    errors.push(...this.validateDeckStructure(deck));

    // Domain Identity validation (requires card data)
    // errors.push(...await this.validateDomainIdentity(deck));

    // Signature cards validation
    // errors.push(...await this.validateSignatureCards(deck));

    // Card quantity validation
    errors.push(...this.validateCardQuantities(deck));

    const isValid = errors.length === 0;
    const errorMessages = errors.map(e => e.message);

    if (!isValid) {
      logger.warn(`DeckValidator: Deck ${deck.id} validation failed:`, errorMessages);
    } else {
      logger.debug(`DeckValidator: Deck ${deck.id} is valid`);
    }

    return {
      isValid,
      errors: errorMessages
    };
  }

  /**
   * Validate basic deck structure (sizes, required components)
   */
  private validateDeckStructure(deck: Deck): DeckValidationError[] {
    const errors: DeckValidationError[] = [];

    // Main deck size validation (minimum 40 cards)
    const mainDeckSize = deck.mainDeck.reduce((total, card) => total + card.quantity, 0);
    if (mainDeckSize < 40) {
      errors.push({
        type: ValidationErrorType.INVALID_MAIN_DECK_SIZE,
        message: `Main deck must contain at least 40 cards, found ${mainDeckSize}`
      });
    }

    // Rune deck size validation (exactly 12 cards)
    const runeDeckSize = deck.runeDeck.reduce((total, card) => total + card.quantity, 0);
    if (runeDeckSize !== 12) {
      errors.push({
        type: ValidationErrorType.INVALID_RUNE_DECK_SIZE,
        message: `Rune deck must contain exactly 12 cards, found ${runeDeckSize}`
      });
    }

    // Battlefield count validation (exactly 3)
    if (deck.battlefields.length !== 3) {
      errors.push({
        type: ValidationErrorType.WRONG_BATTLEFIELD_COUNT,
        message: `Must have exactly 3 battlefields, found ${deck.battlefields.length}`
      });
    }

    // Champion Legend presence
    if (!deck.championLegend) {
      errors.push({
        type: ValidationErrorType.MISSING_CHOSEN_CHAMPION,
        message: 'Champion Legend is required'
      });
    }

    // Chosen Champion presence
    if (!deck.chosenChampion) {
      errors.push({
        type: ValidationErrorType.MISSING_CHOSEN_CHAMPION,
        message: 'Chosen Champion is required'
      });
    }

    return errors;
  }

  /**
   * Validate card quantities (max 3 copies per name)
   */
  private validateCardQuantities(deck: Deck): DeckValidationError[] {
    const errors: DeckValidationError[] = [];

    // Check main deck quantities
    for (const deckCard of deck.mainDeck) {
      if (deckCard.quantity > 3) {
        errors.push({
          type: ValidationErrorType.TOO_MANY_COPIES,
          message: `Too many copies of card ${deckCard.cardId}: found ${deckCard.quantity}, max 3 allowed`,
          cardId: deckCard.cardId
        });
      }
    }

    // Check rune deck quantities
    for (const deckCard of deck.runeDeck) {
      if (deckCard.quantity > 3) {
        errors.push({
          type: ValidationErrorType.TOO_MANY_COPIES,
          message: `Too many copies of rune ${deckCard.cardId}: found ${deckCard.quantity}, max 3 allowed`,
          cardId: deckCard.cardId
        });
      }
    }

    return errors;
  }

  /**
   * Validate Domain Identity compliance
   * NOTE: This requires access to actual card data to check domains
   */
  private async validateDomainIdentity(deck: Deck): Promise<DeckValidationError[]> {
    const errors: DeckValidationError[] = [];

    // TODO: Implement when card database is available
    // This will check:
    // 1. Champion Legend defines the allowed domains
    // 2. All cards in main deck respect domain identity rules
    // 3. Single domain cards can be in matching domain decks
    // 4. Multi-domain cards require ALL domains to be present

    logger.debug('DeckValidator: Domain Identity validation not yet implemented');

    return errors;
  }

  /**
   * Validate Signature cards limit (max 3 total)
   */
  private async validateSignatureCards(deck: Deck): Promise<DeckValidationError[]> {
    const errors: DeckValidationError[] = [];

    // TODO: Implement when card database is available
    // This will check that no more than 3 Signature cards total are in the deck

    logger.debug('DeckValidator: Signature cards validation not yet implemented');

    return errors;
  }

  /**
   * Quick validation for basic structure only
   */
  async quickValidate(deck: Deck): Promise<boolean> {
    const structureErrors = this.validateDeckStructure(deck);
    const quantityErrors = this.validateCardQuantities(deck);

    return structureErrors.length === 0 && quantityErrors.length === 0;
  }

  /**
   * Validate a single card can be added to a deck
   */
  canAddCardToDeck(deck: Deck, cardId: string): {
    canAdd: boolean;
    reason?: string;
  } {
    // Check if adding this card would exceed quantity limit
    const existingCard = deck.mainDeck.find(c => c.cardId === cardId);
    if (existingCard && existingCard.quantity >= 3) {
      return {
        canAdd: false,
        reason: 'Maximum 3 copies per card allowed'
      };
    }

    // TODO: Add domain identity check when card database is available

    return { canAdd: true };
  }

  /**
   * Get deck statistics
   */
  getDeckStats(deck: Deck): {
    mainDeckSize: number;
    runeDeckSize: number;
    battlefieldCount: number;
    uniqueCards: number;
    averageEnergyCost: number;
  } {
    const mainDeckSize = deck.mainDeck.reduce((total, card) => total + card.quantity, 0);
    const runeDeckSize = deck.runeDeck.reduce((total, card) => total + card.quantity, 0);
    const uniqueCards = deck.mainDeck.length;

    // TODO: Calculate average energy cost when card database is available
    const averageEnergyCost = 0;

    return {
      mainDeckSize,
      runeDeckSize,
      battlefieldCount: deck.battlefields.length,
      uniqueCards,
      averageEnergyCost
    };
  }
}