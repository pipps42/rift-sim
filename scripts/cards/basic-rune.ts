/**
 * Basic Rune Template
 *
 * All basic runes share the same two abilities:
 * 1. [T]: Add [1] energy (tap ability)
 * 2. Recycle this: Add [Domain] power (sacrifice ability)
 *
 * This script is used for all 6 basic runes:
 * - Fury Rune
 * - Calm Rune
 * - Mind Rune
 * - Body Rune
 * - Chaos Rune
 * - Order Rune
 */

const cardScript = {
  id: 'BASIC_RUNE',
  name: 'Basic Rune',
  type: 'artifact',
  cost: 0,
  rarity: 'common',
  description: 'Basic rune with tap and recycle abilities',

  /**
   * Activated Ability: [T]: Add [1] energy
   *
   * When the rune is tapped, add 1 energy to the player's rune pool.
   */
  onTap: async (context) => {
    const { self, owner } = context;

    // Check if rune is ready (not already tapped)
    if (!self.ready) {
      throw new Error('Rune is already exhausted');
    }

    // Tap the rune
    self.ready = false;

    // Add 1 energy to player's rune pool
    owner.runePool.energy += 1;

    return {
      success: true,
      message: `${self.name} tapped for 1 energy`,
    };
  },

  /**
   * Activated Ability: Recycle this - Add [Domain] power
   *
   * Sacrifice the rune to add 1 power of its domain to the player's rune pool.
   */
  onRecycle: async (context) => {
    const { self, owner } = context;

    // Get the rune's domain (from card definition)
    // Note: In a real implementation, this would be passed in context
    const domain = self.domains?.[0];

    if (!domain) {
      throw new Error('Rune has no domain defined');
    }

    // Move rune from board to bottom of rune deck (recycle)
    const runeIndex = owner.zones.runes.findIndex((r) => r.instanceId === self.instanceId);
    if (runeIndex === -1) {
      throw new Error('Rune not found on board');
    }

    // Remove from board
    owner.zones.runes.splice(runeIndex, 1);

    // Add to bottom of rune deck
    owner.zones.runeDeck.push(self);

    // Add 1 power of the rune's domain
    let powerPool = owner.runePool.power.find((p) => p.domain === domain);

    if (!powerPool) {
      // Create new power pool for this domain
      powerPool = { domain, amount: 0 };
      owner.runePool.power.push(powerPool);
    }

    powerPool.amount += 1;

    return {
      success: true,
      message: `${self.name} recycled for 1 ${domain} power`,
    };
  },
};

// Export for isolated-vm (globalThis pattern)
globalThis.cardScript = cardScript;
