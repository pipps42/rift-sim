/**
 * Card Scripts Index
 *
 * This file exports all card scripts for the Riftbound TCG.
 * Each card script implements the CardScript interface and defines
 * the card's behavior using the V3 GameAction system.
 */

// SPELLS
export { charm } from './charm.card';
export { disintegrate } from './disintegrate.card';
export { defy } from './defy.card';

// UNITS
export { brazenBuccaneer } from './brazen-buccaneer.card';
export { dariusTrifarian } from './darius-trifarian.card';
export { viDestructive } from './vi-destructive.card';
export { yasuoRemorseful } from './yasuo-remorseful.card';
// Note: Playful Phantom is a vanilla unit with no script (hasScript: false in seed)

// GEAR
export { sealOfRage } from './seal-of-rage.card';
export { zhonyasHourglass } from './zhonyas-hourglass.card';

// LEGENDS
export { yasuoUnforgiven } from './yasuo-unforgiven.card';
export { dariusHandOfNoxus } from './darius-hand-of-noxus.card';

/**
 * Card Implementation Status:
 *
 * ✅ Implemented (11 cards):
 * - Charm (spell)
 * - Disintegrate (spell)
 * - Defy (spell)
 * - Brazen Buccaneer (unit) - Note: requires cost modification system
 * - Darius, Trifarian (unit)
 * - Vi, Destructive (unit)
 * - Yasuo, Remorseful (unit)
 * - Seal of Rage (gear)
 * - Zhonya's Hourglass (gear) - Note: requires replacement effect system
 * - Yasuo, Unforgiven (legend)
 * - Darius, Hand of Noxus (legend)
 *
 * 🟢 No Script Needed (1 card):
 * - Playful Phantom (vanilla unit)
 *
 * Total: 12 cards from plain-text files
 *
 * Additional cards in database:
 * - 6 Basic Runes (using basic-rune.card.ts)
 */
