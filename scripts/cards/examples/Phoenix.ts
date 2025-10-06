/**
 * Phoenix - Example Unit with Triggers
 *
 * A legendary creature that resurrects itself when killed.
 * Demonstrates: trigger system, passive effects, complex state tracking
 */

export const cardScript = {
  // ============================================================================
  // Card Metadata
  // ============================================================================

  id: 'PHOENIX_001',
  name: 'Phoenix',
  type: 'unit' as const,
  cost: 5,
  rarity: 'legendary' as const,

  // Unit stats
  stats: {
    attack: 4,
    health: 3,
  },

  description: 'Flying. When this unit dies, return it to play at the end of the turn with 1 health (once per game).',
  keywords: ['flying', 'temporary'],
  tags: ['phoenix', 'fire', 'mythical'],

  // ============================================================================
  // Passive Effects
  // ============================================================================

  passiveEffects: [
    {
      description: 'Phoenix has flying',
      targets: { custom: (entity) => entity.id === self.id },
      addKeywords: ['flying'],
    },
  ],

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================

  /**
   * When Phoenix enters play
   */
  onPlay: (context) => {
    log.info(`${self.name} rises from the ashes!`);

    // Deal 1 damage to all enemy units (fiery entrance)
    const enemies = battlefield.getEntities({
      type: 'unit',
      owner: 'opponent',
    });

    if (enemies.length > 0) {
      log.info('Phoenix unleashes a wave of fire!');
      for (const enemy of enemies) {
        battlefield.dealDamage(enemy.id, 1, self.id);
      }
    }

    // Add custom counter to track if we've resurrected
    if (eventData && eventData.isResurrection) {
      log.info('This Phoenix has already been resurrected once');
    }
  },

  /**
   * When Phoenix dies
   */
  onDeath: (context) => {
    log.info(`${self.name} is consumed by flames!`);

    // Check if we've already resurrected (would be tracked in game state)
    // For this example, we'll check if Phoenix has a special counter
    const hasResurrected = eventData?.hasResurrected || false;

    if (!hasResurrected) {
      log.info('Phoenix will be reborn at end of turn!');

      // Schedule resurrection for end of turn
      // This would typically add a delayed trigger to the game state
      chain.addEffect({
        type: 'CREATE_TOKEN',
        value: 1,
        description: `Resurrect ${self.name} with 1 health`,
      });

      // Note: In a real implementation, we'd need to track the resurrection
      // state in the game's persistent data
    } else {
      log.info('Phoenix cannot be reborn again this game');
    }
  },

  /**
   * At the start of each turn
   */
  onTurnStart: (context) => {
    // Phoenix regenerates 1 health each turn while alive
    if (gameState.activePlayer === owner.id) {
      log.info(`${self.name} regenerates 1 health`);
      battlefield.heal(self.id, 1);
    }
  },

  /**
   * When Phoenix attacks
   */
  onAttack: (context, defender) => {
    log.info(`${self.name} attacks with blazing wings!`);

    // Add burning status to defender
    battlefield.addStatus(defender.id, 'burning', 2);

    // Phoenix deals bonus damage to units with burning status
    const defenderEntity = battlefield.getEntity(defender.id);
    if (defenderEntity && defenderEntity.status.includes('burning')) {
      log.info('Phoenix deals bonus damage to burning target!');
      battlefield.dealDamage(defender.id, 2, self.id);
    }
  },

  // ============================================================================
  // Trigger System
  // ============================================================================

  triggers: [
    {
      // Trigger when any unit dies
      event: 'UNIT_DIED',
      condition: (context) => {
        // Only trigger if it's an enemy unit
        if (!eventData || !eventData.deadUnit) return false;
        return eventData.deadUnit.owner !== owner.id;
      },
      handler: (context) => {
        log.info(`${self.name} grows stronger from death!`);

        // Gain +1/+1 when an enemy dies
        battlefield.modifyStats(self.id, {
          attack: 1,
          health: 1,
        });
      },
    },
    {
      // Trigger when a spell is cast
      event: 'SPELL_CAST',
      condition: (context) => {
        // Only fire spells
        if (!eventData || !eventData.spell) return false;
        const spell = eventData.spell;
        return spell.tags && spell.tags.includes('fire');
      },
      handler: (context) => {
        log.info(`${self.name} is empowered by fire magic!`);

        // Ready Phoenix (can attack again)
        battlefield.removeStatus(self.id, 'exhausted');
      },
    },
  ],

  // ============================================================================
  // Activated Abilities
  // ============================================================================

  activatedAbilities: [
    {
      name: 'Flames of Rebirth',
      description: 'Sacrifice Phoenix to deal 3 damage to all enemy units',
      cost: 0, // No mana cost, but requires sacrifice

      canUse: (context) => {
        // Can only use if we have enemies to damage
        const enemies = battlefield.getEntities({
          type: 'unit',
          owner: 'opponent',
        });
        return enemies.length > 0;
      },

      effect: (context) => {
        log.info(`${self.name} sacrifices itself in a blaze of glory!`);

        // Deal damage to all enemies
        const enemies = battlefield.getEntities({
          type: 'unit',
          owner: 'opponent',
        });

        for (const enemy of enemies) {
          battlefield.dealDamage(enemy.id, 3, self.id);
        }

        // Destroy self
        battlefield.destroy(self.id);
      },
    },
  ],
};
