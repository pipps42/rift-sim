/**
 * Card Factory
 *
 * Loads card definitions from database and integrates with Card Scripting System.
 * Merges static card data (DB) with dynamic behavior (scripts).
 */

import type { PrismaClient, CardDefinition } from '../generated/prisma';
import { CardScriptRuntime } from '../engine/scripting/CardScriptRuntime';
import type { Card } from '../types/game';
import { CardType as GameCardType, Rarity as GameRarity, Domain, AbilityType, AbilityTiming } from '../types/game';

export class CardFactory {
  private prisma: PrismaClient;
  private scriptRuntime: CardScriptRuntime;
  private cardCache: Map<string, Card> = new Map();

  constructor(prisma: PrismaClient, scriptRuntime: CardScriptRuntime) {
    this.prisma = prisma;
    this.scriptRuntime = scriptRuntime;
  }

  /**
   * Initialize factory and load all cards into cache.
   */
  async initialize(): Promise<void> {
    console.log('[CardFactory] Initializing...');

    // Load all card definitions from database
    const definitions = await this.prisma.cardDefinition.findMany();

    console.log(`[CardFactory] Loaded ${definitions.length} card definitions from database`);

    // Convert to game cards and cache
    for (const def of definitions) {
      const card = this.definitionToCard(def);
      this.cardCache.set(card.id, card);
    }

    console.log(`[CardFactory] Cached ${this.cardCache.size} cards`);
  }

  /**
   * Get a card by ID.
   */
  getCard(cardId: string): Card | undefined {
    return this.cardCache.get(cardId);
  }

  /**
   * Get all cards.
   */
  getAllCards(): Card[] {
    return Array.from(this.cardCache.values());
  }

  /**
   * Get cards by type.
   */
  getCardsByType(cardType: GameCardType): Card[] {
    return this.getAllCards().filter((card) => card.cardType === cardType);
  }

  /**
   * Get cards by rarity.
   */
  getCardsByRarity(rarity: GameRarity): Card[] {
    return this.getAllCards().filter((card) => card.rarity === rarity);
  }

  /**
   * Get cards by domain.
   */
  getCardsByDomain(domain: Domain): Card[] {
    return this.getAllCards().filter((card) => card.domains.includes(domain));
  }

  /**
   * Get cards with scripts.
   */
  getScriptedCards(): Card[] {
    return this.getAllCards().filter((card) => {
      // Check if script exists in runtime
      const loader = this.scriptRuntime.getLoader();
      return loader.hasScript(card.id);
    });
  }

  /**
   * Reload all cards from database.
   */
  async reload(): Promise<void> {
    this.cardCache.clear();
    await this.initialize();
    console.log('[CardFactory] Reloaded all cards');
  }

  /**
   * Reload a specific card from database.
   */
  async reloadCard(cardId: string): Promise<Card | undefined> {
    const definition = await this.prisma.cardDefinition.findUnique({
      where: { id: cardId },
    });

    if (!definition) {
      console.warn(`[CardFactory] Card not found: ${cardId}`);
      return undefined;
    }

    const card = this.definitionToCard(definition);
    this.cardCache.set(card.id, card);

    console.log(`[CardFactory] Reloaded card: ${card.name}`);
    return card;
  }

  /**
   * Convert Prisma CardDefinition to Game Card.
   */
  private definitionToCard(def: CardDefinition): Card {
    // Parse JSON fields
    const powerCosts = this.parseJson(def.powerCosts, []);
    const domains = this.parseJson(def.domains, []);
    const keywords = this.parseJson(def.keywords, []);
    const tags = this.parseJson(def.tags, []);
    const subtypes = this.parseJson(def.subtypes, []);

    // Base card properties
    const baseCard: any = {
      id: def.id,
      name: def.name,
      energyCost: def.energyCost,
      powerCost: powerCosts,
      description: def.description,
      cardType: this.mapCardType(def.cardType),
      rarity: this.mapRarity(def.rarity),
      domains: domains,
      keywords: keywords.map(k => this.mapKeyword(k)),
      tags: tags,
    };

    // Add optional properties only if they exist
    if (def.flavorText) baseCard.flavorText = def.flavorText;
    if (def.imageUrl) baseCard.imageUrl = def.imageUrl;
    if (def.artist) baseCard.artist = def.artist;
    if (def.cardNumber) baseCard.cardNumber = def.cardNumber;

    // Type-specific properties
    switch (def.cardType) {
      case 'UNIT':
        return {
          ...baseCard,
          cardType: GameCardType.UNIT,
          might: def.might || 0,
          subtypes: subtypes,
          abilities: [], // Abilities come from scripts
        };

      case 'SPELL':
        return {
          ...baseCard,
          cardType: GameCardType.SPELL,
          spellTiming: this.inferSpellTiming(keywords),
          targetRequirements: [], // From scripts
          effects: [], // From scripts
        };

      case 'GEAR':
        return {
          ...baseCard,
          cardType: GameCardType.GEAR,
          gearType: this.inferGearType(tags),
          abilities: [],
        };

      case 'RUNE':
        return {
          ...baseCard,
          cardType: GameCardType.RUNE,
          isBasicRune: def.isBasicRune,
          abilities: [],
        };

      case 'BATTLEFIELD':
        return {
          ...baseCard,
          cardType: GameCardType.BATTLEFIELD,
          battlefieldAbilities: [],
          scoreValue: this.inferScoreValue(def.description),
        };

      case 'LEGEND':
        return {
          ...baseCard,
          cardType: GameCardType.LEGEND,
          domainIdentity: domains,
          championTag: tags[0] || '',
          legendaryAbility: {
            id: `${def.id}_legendary`,
            name: 'Legendary Ability',
            description: def.description,
            type: AbilityType.ACTIVATED,
            timing: AbilityTiming.NORMAL,
            effects: [],
          },
        };

      default:
        // Fallback to unit
        return {
          ...baseCard,
          cardType: GameCardType.UNIT,
          might: 0,
          subtypes: [],
          abilities: [],
        };
    }
  }

  /**
   * Parse JSON field safely.
   */
  private parseJson<T>(jsonString: any, defaultValue: T): T {
    if (typeof jsonString === 'string') {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.warn('[CardFactory] Failed to parse JSON:', jsonString);
        return defaultValue;
      }
    }
    return jsonString || defaultValue;
  }

  /**
   * Map Prisma CardType to Game CardType.
   */
  private mapCardType(type: string): GameCardType {
    switch (type) {
      case 'UNIT': return GameCardType.UNIT;
      case 'SPELL': return GameCardType.SPELL;
      case 'GEAR': return GameCardType.GEAR;
      case 'RUNE': return GameCardType.RUNE;
      case 'BATTLEFIELD': return GameCardType.BATTLEFIELD;
      case 'LEGEND': return GameCardType.LEGEND;
      case 'CHAMPION': return GameCardType.CHAMPION;
      case 'SIGNATURE': return GameCardType.SIGNATURE;
      case 'TOKEN': return GameCardType.TOKEN;
      default: return GameCardType.UNIT;
    }
  }

  /**
   * Map Prisma Rarity to Game Rarity.
   */
  private mapRarity(rarity: string): GameRarity {
    switch (rarity) {
      case 'COMMON': return GameRarity.COMMON;
      case 'UNCOMMON': return GameRarity.UNCOMMON;
      case 'RARE': return GameRarity.RARE;
      case 'MYTHIC': return GameRarity.MYTHIC;
      default: return GameRarity.COMMON;
    }
  }

  /**
   * Map keyword string to Keyword enum.
   */
  private mapKeyword(keyword: string | undefined): any {
    if (!keyword) return '';

    // Map common keywords
    const keywordMap: Record<string, string> = {
      'accelerate': 'ACCELERATE',
      'assault': 'ASSAULT',
      'deflect': 'DEFLECT',
      'ganking': 'GANKING',
      'shield': 'SHIELD',
      'tank': 'TANK',
      'temporary': 'TEMPORARY',
      'vision': 'VISION',
      'action': 'ACTION',
      'reaction': 'REACTION',
      'legion': 'LEGION',
      'deathknell': 'DEATHKNELL',
      'hidden': 'HIDDEN',
      'flying': 'ACCELERATE', // Map to existing keyword as placeholder
    };

    return keywordMap[keyword.toLowerCase()] || keyword;
  }

  /**
   * Infer spell timing from keywords.
   */
  private inferSpellTiming(keywords: string[]): any {
    if (keywords.includes('reaction')) return 'REACTION';
    if (keywords.includes('action')) return 'ACTION';
    return 'NORMAL';
  }

  /**
   * Infer gear type from tags.
   */
  private inferGearType(tags: string[]): any {
    if (tags.includes('weapon')) return 'WEAPON';
    if (tags.includes('armor')) return 'ARMOR';
    if (tags.includes('accessory')) return 'ACCESSORY';
    return 'ARTIFACT';
  }

  /**
   * Infer score value from battlefield description.
   */
  private inferScoreValue(description: string): number {
    // Look for "Score X" pattern
    const match = description.match(/score (\d+)/i);
    return match && match[1] ? parseInt(match[1], 10) : 1;
  }

  /**
   * Get statistics.
   */
  getStats(): {
    totalCards: number;
    cardsByType: Record<string, number>;
    cardsByRarity: Record<string, number>;
    scriptedCards: number;
  } {
    const cards = this.getAllCards();

    const cardsByType: Record<string, number> = {};
    const cardsByRarity: Record<string, number> = {};

    for (const card of cards) {
      cardsByType[card.cardType] = (cardsByType[card.cardType] || 0) + 1;
      cardsByRarity[card.rarity] = (cardsByRarity[card.rarity] || 0) + 1;
    }

    return {
      totalCards: cards.length,
      cardsByType,
      cardsByRarity,
      scriptedCards: this.getScriptedCards().length,
    };
  }
}

/**
 * Create and initialize CardFactory.
 */
export async function createCardFactory(
  prisma: PrismaClient,
  scriptRuntime: CardScriptRuntime
): Promise<CardFactory> {
  const factory = new CardFactory(prisma, scriptRuntime);
  await factory.initialize();
  return factory;
}
