/**
 * Card Helper Functions
 *
 * Utilities for working with Card definitions and GameCard instances.
 */

import type { Card, GameCard, UnitCard, Player } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a GameCard instance from a Card definition.
 *
 * Copies all properties from the Card definition (via BaseCard)
 * and adds game-specific instance properties.
 *
 * @param card - Card definition
 * @param owner - Player who owns this card
 * @param zone - Initial zone for the card
 * @returns GameCard instance ready for use in game
 */
export function createGameCard(
  card: Card,
  owner: Player,
  zone: string = 'hand'
): GameCard {
  const gameCard = {
    // ===== Properties from BaseCard (Card definition) =====
    id: card.id,
    name: card.name,
    energyCost: card.energyCost,
    powerCost: card.powerCost,
    description: card.description,
    flavorText: card.flavorText ?? undefined,
    cardType: card.cardType,
    rarity: card.rarity,
    domains: card.domains,
    keywords: card.keywords,
    imageUrl: card.imageUrl ?? undefined,
    artist: card.artist ?? undefined,
    cardNumber: card.cardNumber ?? undefined,
    tags: card.tags,
    scriptPath: card.scriptPath ?? undefined,

    // ===== GameCard-specific properties =====
    instanceId: uuidv4(),
    cardId: card.id,
    controllerId: owner.id,
    ownerId: owner.id,
    zone,
    position: undefined,
    ready: false, // Cards enter exhausted by default (except Accelerate)
    damage: 0,

    // ===== Temporary state =====
    temporaryModifiers: [],
    counters: [],
  };

  // For units, copy might if present
  if (card.cardType === 'unit' || card.cardType === 'champion') {
    const unitCard = card as UnitCard;
    // @ts-expect-error might is optional on GameCard but required on UnitCard
    gameCard.might = unitCard.might;
  }

  return gameCard as unknown as GameCard;
}

/**
 * Get the effective might of a unit (base might + modifiers).
 *
 * @param unit - Unit card
 * @returns Effective might value
 */
export function getEffectiveMight(unit: GameCard): number {
  // GameCard now has might from BaseCard
  const baseMight = (unit as any).might ?? 0;

  // Apply might modifiers
  const mightBonus = unit.temporaryModifiers
    .filter(mod => mod.type === 'might_bonus')
    .reduce((sum, mod) => sum + mod.value, 0);

  return baseMight + mightBonus;
}

/**
 * Get the effective energy cost of a card (base cost + modifiers).
 *
 * @param card - Card
 * @returns Effective energy cost
 */
export function getEffectiveCost(card: GameCard): number {
  const baseCost = card.energyCost;

  // Apply cost reduction modifiers
  const costReduction = card.temporaryModifiers
    .filter(mod => mod.type === 'cost_reduction')
    .reduce((sum, mod) => sum + mod.value, 0);

  return Math.max(0, baseCost - costReduction);
}

/**
 * Check if a card has a specific keyword.
 *
 * @param card - Card to check
 * @param keyword - Keyword to look for
 * @returns True if card has the keyword
 */
export function hasKeyword(card: GameCard, keyword: string): boolean {
  // Check base keywords
  if (card.keywords.includes(keyword as any)) {
    return true;
  }

  // Check granted keywords from modifiers
  const hasGrantedKeyword = card.temporaryModifiers.some(
    mod => mod.type === 'keyword_grant' && (mod as any).keyword === keyword
  );

  return hasGrantedKeyword;
}

/**
 * Check if a card is a unit (has might).
 *
 * @param card - Card to check
 * @returns True if card is a unit or champion
 */
export function isUnit(card: GameCard): boolean {
  return card.cardType === 'unit' || card.cardType === 'champion';
}

/**
 * Check if a card is in a board zone (base or battlefield).
 *
 * @param card - Card to check
 * @returns True if card is in a board zone
 */
export function isInBoardZone(card: GameCard): boolean {
  return card.zone === 'base' || card.zone.startsWith('battlefield');
}
