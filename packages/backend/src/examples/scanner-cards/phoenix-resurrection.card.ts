/**
 * Example card: Ashen Phoenix
 * Demonstrates triggered activated ability using CardStateScanner metadata
 *
 * Card text: "When you kill a unit with a spell, you may pay 1 [E] + 1 fury to play me from your trash."
 */

import type { CardScript } from '../../engine/scripting/types/CardScriptTypes';
import type { GameEvent } from '../../types/game';
import { Domain } from '../../types/game';

interface UnitDiedEvent extends GameEvent {
  unit: any;
  killedBy?: {
    damageType: 'combat' | 'effect' | 'spell';
    controllerId: string;
  };
}

export const ashenPhoenix: CardScript = {
  metadata: {
    // Reactive trigger for UI hint
    reactiveTriggers: [
      {
        id: 'spell_kill',
        eventType: 'unit_died',
        description: 'When you kill a unit with a spell',
        condition: (event, ctx) => {
          const deathEvent = event as UnitDiedEvent;
          return (
            deathEvent.killedBy?.damageType === 'spell' &&
            deathEvent.killedBy.controllerId === ctx.owner.id
          );
        },
      },
    ],

    // Activated ability available from trash
    activatedAbilities: [
      {
        id: 'resurrect',
        name: 'Rise from Ashes',
        description: 'Play this from trash when you kill a unit with a spell',
        availableFrom: ['trash'],
        costs: {
          energy: 1,
          power: [{ domain: Domain.FURY, amount: 1 }],
        },
        constraints: [
          {
            id: 'recent_spell_kill',
            description: 'Must have recently killed a unit with a spell',
            check: (ctx) => {
              // Check last event in history
              const lastEvent = ctx.game.history[ctx.game.history.length - 1];
              if (!lastEvent || lastEvent.type !== 'unit_died') {
                return {
                  satisfied: false,
                  reason: 'No recent unit death',
                };
              }

              const deathEvent = lastEvent as UnitDiedEvent;
              if (deathEvent.killedBy?.damageType !== 'spell') {
                return {
                  satisfied: false,
                  reason: 'Unit not killed by spell',
                };
              }

              if (deathEvent.killedBy.controllerId !== ctx.owner.id) {
                return {
                  satisfied: false,
                  reason: 'Not your spell',
                };
              }

              return { satisfied: true };
            },
          },
        ],
        timing: 'instant',
        onActivate: async (ctx) => {
          // Return PlayCardFromTrashAction
          // TODO: Implement this action type
          return [];
        },
      },
    ],
  },

  // Standard onPlay hook for when card is played normally
  onPlay: async (ctx) => {
    // Phoenix effect when played from hand
    console.log('Phoenix rises!');
  },
};
