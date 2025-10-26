/**
 * Example card: Stealthy Scout
 * Demonstrates HIDDEN keyword implementation using CardStateScanner metadata
 *
 * Card text: "Unit with HIDDEN - Pay 2 [E]: Hide this unit on a battlefield you control"
 */

import type { CardScript } from '../../engine/scripting/types/CardScriptTypes';

export const stealthyScout: CardScript = {
  metadata: {
    activatedAbilities: [
      {
        id: 'hidden',
        name: 'Hide',
        description: 'Place this unit facedown on a battlefield you control',
        availableFrom: ['hand'],
        costs: {
          energy: 2,
        },
        constraints: [
          {
            id: 'control_battlefield',
            description: 'Must control a battlefield',
            check: (ctx) => {
              const controlled = ctx.game.battlefields.filter(
                bf => bf.controller === ctx.owner.id
              );
              if (controlled.length === 0) {
                return {
                  satisfied: false,
                  reason: "You don't control any battlefield",
                };
              }
              return { satisfied: true };
            },
          },
        ],
        timing: 'sorcery',
        onActivate: async (ctx) => {
          // Note: In full implementation, UI would prompt for battlefield selection
          // For now, select first controlled battlefield
          const targetBf = ctx.game.battlefields.find(
            bf => bf.controller === ctx.owner.id
          );

          if (!targetBf) {
            throw new Error('No controlled battlefield found');
          }

          // Return MoveCardAction to place card facedown
          // TODO: Implement MoveCardAction with facedown support
          return [];
        },
      },
    ],
  },
};
