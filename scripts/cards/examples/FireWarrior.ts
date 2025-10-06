/**
 * Fire Warrior - Example Unit Card
 *
 * A basic unit that deals damage when played.
 * Demonstrates: onPlay hook, battlefield API usage
 */

export const cardScript = {
  // ============================================================================
  // Card Metadata
  // ============================================================================

  id: 'FIRE_WARRIOR_001',
  name: 'Fire Warrior',
  type: 'unit' as const,
  cost: 3,
  rarity: 'common' as const,

  // Unit stats
  stats: {
    attack: 3,
    health: 3,
  },

  description: 'When this unit enters play, deal 2 damage to target enemy unit.',
  keywords: ['assault'],
  tags: ['warrior', 'fire'],

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================

  /**
   * When played: Deal damage to target
   */
  onPlay: (context) => {
    log.info(`${self.name} enters the battlefield!`);

    // Check if we have a target
    if (targets && targets.length > 0) {
      const target = targets[0];
      log.info(`Dealing 2 damage to ${target.name}`);
      battlefield.dealDamage(target.id, 2, self.id);
    } else {
      log.warn('No target selected for Fire Warrior ability');
    }
  },

  /**
   * When this unit attacks
   */
  onAttack: (context, defender) => {
    log.info(`${self.name} attacks ${defender.name}!`);

    // Fire Warriors burn their enemies
    battlefield.addStatus(defender.id, 'burning', 2);
    log.info(`${defender.name} is now burning!`);
  },

  /**
   * When this unit dies
   */
  onDeath: (context) => {
    log.info(`${self.name} has fallen in battle!`);

    // Final strike: deal 1 damage to all enemy units
    const enemies = battlefield.getEntities({
      type: 'unit',
      owner: 'opponent',
    });

    if (enemies.length > 0) {
      log.info('Final Strike! Dealing 1 damage to all enemy units');
      for (const enemy of enemies) {
        battlefield.dealDamage(enemy.id, 1, self.id);
      }
    }
  },

  // ============================================================================
  // Target Validation
  // ============================================================================

  /**
   * Fire Warrior can only target enemy units
   */
  canTarget: (context, target) => {
    // Must be a unit
    if (target.type !== 'unit') {
      return false;
    }

    // Must be an enemy
    if (target.owner === owner.id) {
      return false;
    }

    return true;
  },
};
