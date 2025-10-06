/**
 * Archmage - Example Complex Card
 *
 * A powerful spellcaster with multiple abilities and complex interactions.
 * Demonstrates: multiple abilities, stat tracking, conditional effects, area effects
 */

export const cardScript = {
  // ============================================================================
  // Card Metadata
  // ============================================================================

  id: 'ARCHMAGE_001',
  name: 'Archmage of the Storm',
  type: 'unit' as const,
  cost: 6,
  rarity: 'epic' as const,

  // Unit stats
  stats: {
    attack: 2,
    health: 5,
  },

  description:
    'Whenever you cast a spell, gain +1/+1. ' +
    'When played, draw a card for each spell cast this turn. ' +
    'Activated: Discard a card to deal 2 damage to all enemy units.',

  keywords: ['vision'], // Can see hidden cards
  tags: ['mage', 'storm', 'spellcaster'],

  // ============================================================================
  // Passive Effects
  // ============================================================================

  passiveEffects: [
    {
      description: 'Allied spells cost 1 less',
      targets: {
        type: 'spell',
        owner: 'self',
      },
      statMods: {
        attack: 0, // Not applicable to spells
        health: 0,
      },
      condition: (context) => {
        // Only while Archmage is on the battlefield
        return true;
      },
    },
  ],

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================

  /**
   * When Archmage enters play
   */
  onPlay: (context) => {
    log.info(`${self.name} takes the field!`);

    // Count spells cast this turn (would be tracked in game state)
    const spellsCastThisTurn = eventData?.spellsCastThisTurn || 0;

    if (spellsCastThisTurn > 0) {
      log.info(`Drawing ${spellsCastThisTurn} cards from spells cast this turn`);

      // Add draw effect to chain for each spell
      for (let i = 0; i < spellsCastThisTurn; i++) {
        chain.addEffect({
          type: 'DRAW_CARDS',
          value: 1,
          description: 'Draw a card',
        });
      }
    }

    // Create a storm aura around Archmage
    log.info('Storm aura created!');
  },

  /**
   * When Archmage dies
   */
  onDeath: (context) => {
    log.info(`${self.name} falls, but leaves behind a storm...`);

    // Final spell: Lightning Storm
    const enemyUnits = battlefield.getEntities({
      type: 'unit',
      owner: 'opponent',
    });

    if (enemyUnits.length > 0) {
      log.info('Lightning Storm triggered!');

      // Deal damage based on Archmage's final attack
      const damage = self.stats?.attack || 2;

      for (const enemy of enemyUnits) {
        battlefield.dealDamage(enemy.id, damage, self.id);
      }
    }
  },

  /**
   * At the start of turn
   */
  onTurnStart: (context) => {
    if (gameState.activePlayer === owner.id) {
      log.info(`${self.name}'s storm powers intensify`);

      // Refresh ability uses (if we're tracking that)
      // In a real implementation, we'd reset cooldowns here
    }
  },

  /**
   * At the end of turn
   */
  onTurnEnd: (context) => {
    if (gameState.activePlayer === owner.id) {
      // Check how many spells were cast this turn
      const spellsCast = eventData?.spellsCastThisTurn || 0;

      if (spellsCast >= 3) {
        log.info(`${self.name} unleashes arcane power!`);

        // Buff Archmage significantly
        battlefield.modifyStats(self.id, {
          attack: 2,
          health: 2,
        });

        log.info(`${self.name} gains +2/+2!`);
      }
    }
  },

  // ============================================================================
  // Trigger System
  // ============================================================================

  triggers: [
    {
      // Main trigger: Whenever you cast a spell
      event: 'SPELL_CAST',
      condition: (context) => {
        // Only trigger on owner's spells
        if (!eventData || !eventData.spell) return false;
        return eventData.spell.owner === owner.id;
      },
      handler: (context) => {
        const spellName = eventData?.spell?.name || 'a spell';
        log.info(`${self.name} channels ${spellName}!`);

        // Gain +1/+1
        battlefield.modifyStats(self.id, {
          attack: 1,
          health: 1,
        });

        log.info(`${self.name} gains +1/+1`);

        // 25% chance to draw a card
        if (random.chance(0.25)) {
          log.info('Arcane Insight! Drawing a card...');
          chain.addEffect({
            type: 'DRAW_CARDS',
            value: 1,
            description: 'Draw a card',
          });
        }
      },
    },
    {
      // Trigger when any unit takes damage
      event: 'DAMAGE_DEALT',
      condition: (context) => {
        // Only trigger if the damage source is a spell
        if (!eventData || !eventData.source) return false;
        return eventData.isSpellDamage === true;
      },
      handler: (context) => {
        log.info(`${self.name} amplifies spell damage!`);

        // Deal 1 additional damage to the target
        if (eventData && eventData.target) {
          battlefield.dealDamage(eventData.target.id, 1, self.id);
        }
      },
    },
  ],

  // ============================================================================
  // Activated Abilities
  // ============================================================================

  activatedAbilities: [
    {
      name: 'Arcane Blast',
      description: 'Deal 2 damage to all enemy units',
      cost: 0, // No mana cost
      cooldown: 0, // Can be used multiple times per turn

      canUse: (context) => {
        // Check if owner has cards to discard
        const handSize = owner.zones?.hand?.length || 0;
        return handSize > 0;
      },

      effect: (context) => {
        log.info(`${self.name} unleashes Arcane Blast!`);

        // Add discard effect
        chain.addEffect({
          type: 'DISCARD_CARDS',
          value: 1,
          description: 'Discard a card',
        });

        // Deal damage to all enemies
        const enemies = battlefield.getEntities({
          type: 'unit',
          owner: 'opponent',
        });

        for (const enemy of enemies) {
          battlefield.dealDamage(enemy.id, 2, self.id);
        }

        log.info(`Dealt 2 damage to ${enemies.length} enemy units`);
      },
    },
    {
      name: 'Time Warp',
      description: 'Ready all your exhausted units',
      cost: 3, // Costs 3 mana

      canUse: (context) => {
        // Must have enough mana
        if (owner.runePool.energy < 3) {
          return false;
        }

        // Must have exhausted allies
        const exhaustedAllies = battlefield.getEntities({
          type: 'unit',
          owner: 'self',
          custom: (entity) => !entity.canMove || !entity.canAttack,
        });

        return exhaustedAllies.length > 0;
      },

      effect: (context) => {
        log.info(`${self.name} warps time itself!`);

        // Find all exhausted allied units
        const exhaustedAllies = battlefield.getEntities({
          type: 'unit',
          owner: 'self',
          custom: (entity) => !entity.canMove || !entity.canAttack,
        });

        // Ready each one
        for (const ally of exhaustedAllies) {
          battlefield.removeStatus(ally.id, 'exhausted');
          log.info(`${ally.name} is ready again!`);
        }

        log.info(`Readied ${exhaustedAllies.length} units`);
      },
    },
    {
      name: 'Polymorph',
      description: 'Transform target unit into a 1/1 Sheep',
      cost: 2, // Costs 2 mana

      targetRequirement: {
        count: 1,
        filter: {
          type: 'unit',
        },
      },

      canUse: (context) => {
        return owner.runePool.energy >= 2;
      },

      effect: (context) => {
        if (!targets || targets.length === 0) {
          log.error('Polymorph requires a target!');
          return;
        }

        const target = targets[0];
        log.info(`${self.name} transforms ${target.name} into a sheep!`);

        // Transform the target (would need a SHEEP token card defined)
        battlefield.transform(target.id, 'SHEEP_TOKEN');

        log.info('Baaaa! 🐑');
      },
    },
  ],

  // ============================================================================
  // Custom Validation
  // ============================================================================

  /**
   * Archmage can be played if you have at least 1 spell in hand
   */
  canPlay: (context) => {
    // Check hand for spells (would need access to full hand data)
    // For this example, always return true
    return true;
  },
};
