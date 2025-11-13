import { Deck, DeckCard } from '@/types/game.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates simple test decks for quick game creation
 * These are minimal decks that satisfy game rules (40 main + 12 runes + 3 battlefields)
 */
export class TestDecks {
  /**
   * Create a basic test deck for a player
   * Uses hardcoded card IDs that should be generic/universal cards
   */
  static createBasicDeck(playerId: string, playerName: string): Deck {
    const deckId = uuidv4();

    // Create main deck (40 cards: 39 units + 1 champion)
    const mainDeck: DeckCard[] = [];

    // Add 38 basic units (19 pairs of different units)
    for (let i = 0; i < 19; i++) {
      mainDeck.push({
        cardId: `test-unit-${i % 10}`, // 10 different basic units, cycling through them
        quantity: 2,
      });
    }

    // Add 1 more single unit to reach 39 units (38 + 1 = 39)
    mainDeck.push({
      cardId: `test-unit-9`,
      quantity: 1,
    });

    // Add the chosen champion as the 40th card
    mainDeck.push({
      cardId: 'test-champion-1',
      quantity: 1,
    });

    // Create rune deck (exactly 12 cards)
    const runeDeck: DeckCard[] = [];
    for (let i = 0; i < 12; i++) {
      runeDeck.push({
        cardId: `test-rune-${i % 6}`, // 6 different runes, 2 copies each
        quantity: 1,
      });
    }

    // Create 3 battlefields
    const battlefields = [
      'test-battlefield-1',
      'test-battlefield-2',
      'test-battlefield-3',
    ];

    return {
      id: deckId,
      name: `${playerName}'s Test Deck`,
      playerId: playerId,
      championLegend: 'test-legend-1',
      chosenChampion: 'test-champion-1',
      mainDeck,
      runeDeck,
      battlefields,
      isValid: false, // Will be validated by DeckValidator
      validationErrors: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

}
