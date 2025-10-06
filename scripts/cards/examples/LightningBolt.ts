/**
 * Lightning Bolt - Example Spell Card
 *
 * A fast damage spell with a chance to stun.
 * Demonstrates: spell effects, random API, chain manipulation
 */

export const cardScript = {
  // ============================================================================
  // Card Metadata
  // ============================================================================

  id: 'LIGHTNING_BOLT_001',
  name: 'Lightning Bolt',
  type: 'spell' as const,
  cost: 2,
  rarity: 'common' as const,

  description: 'Deal 3 damage to target unit. 50% chance to stun the target for 1 turn.',
  keywords: ['action'], // Can be played during showdowns
  tags: ['lightning', 'air', 'damage'],

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================

  /**
   * When spell is played
   */
  onPlay: (context) => {
    log.info(`${owner.name} casts ${self.name}!`);

    // Must have a target
    if (!targets || targets.length === 0) {
      log.error('Lightning Bolt requires a target!');
      return;
    }

    const target = targets[0];
    log.info(`Lightning strikes ${target.name}!`);

    // Deal base damage
    battlefield.dealDamage(target.id, 3, self.id);
    log.info(`Dealt 3 damage to ${target.name}`);

    // 50% chance to stun
    if (random.chance(0.5)) {
      log.info(`${target.name} is stunned by the lightning!`);
      battlefield.addStatus(target.id, 'stunned', 1);

      // Add a chain effect for visual feedback
      chain.addEffect({
        type: 'STUN',
        value: 1,
        targetIds: [target.id],
        description: `${target.name} is stunned!`,
      });
    } else {
      log.info(`${target.name} resists the stun effect`);
    }

    // Chain lightning: if we kill the target, bounce to another enemy
    if (target.health <= 3) {
      log.info('Chain Lightning! Looking for another target...');

      const otherEnemies = battlefield.getEntities({
        type: 'unit',
        owner: 'opponent',
        custom: (entity) => entity.id !== target.id,
      });

      if (otherEnemies.length > 0) {
        // Pick random enemy to bounce to
        const bounceTarget = random.pick(otherEnemies);
        log.info(`Lightning bounces to ${bounceTarget.name}!`);
        battlefield.dealDamage(bounceTarget.id, 1, self.id);
      }
    }
  },

  // ============================================================================
  // Target Validation
  // ============================================================================

  /**
   * Can only target units
   */
  canTarget: (context, target) => {
    return target.type === 'unit';
  },

  /**
   * Spell can be played if we have a valid target
   */
  canPlay: (context) => {
    // Check if there are any enemy units to target
    const enemies = battlefield.getEntities({
      type: 'unit',
      owner: 'opponent',
    });

    if (enemies.length === 0) {
      log.debug('No valid targets for Lightning Bolt');
      return false;
    }

    return true;
  },
};
