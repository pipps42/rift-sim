/**
 * Playful Phantom
 *
 * Type: Unit
 * Domain: Calm
 * Cost: 5 Energy
 * Might: 5
 *
 * A simple vanilla unit with no special abilities.
 * Perfect for testing basic card functionality.
 */

const cardScript = {
  id: 'PLAYFUL_PHANTOM',
  name: 'Playful Phantom',
  type: 'unit',
  cost: 5,
  rarity: 'common',
  description: 'A playful spirit from the Shadow Isles',
  stats: {
    attack: 5,
    health: 5,
  },

  // Vanilla unit - no hooks or special abilities
  // This card serves as a baseline for testing
};

// Export for isolated-vm (globalThis pattern)
globalThis.cardScript = cardScript;
