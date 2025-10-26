import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';
import { ExhaustCardAction } from '../engine/actions/concrete/ExhaustCardAction';

/**
 * Seal of Rage
 * Gear - Epic - Fury
 * Cost: 0 energy + 1 fury power
 *
 * tap: REACTION - ADD fury. (Abilities that add resources can't be reacted to.)
 *
 * Implementation:
 * - Provides an activated tap ability
 * - When activated, exhausts itself (tap = exhaust in Riftbound)
 * - Adds 1 fury power to the owner's power pool
 * - REACTION keyword means it can be used during opponent's turn
 * - The "(can't be reacted to)" clause means opponents can't respond with their own reactions
 *
 * Note: Tap abilities in Riftbound require:
 * 1. The card to be ready (not exhausted)
 * 2. Appropriate timing window
 * 3. For REACTION abilities, can be activated on opponent's turn
 */
export const sealOfRage: CardScript = {
  onEntersPlay: async (ctx: CardContext) => {
    const { self } = ctx;

    // Register the tap ability
    const selfAny = self as any;
    if (!selfAny.activatedAbilities) {
      selfAny.activatedAbilities = [];
    }

    selfAny.activatedAbilities.push({
      id: 'seal-tap-add-fury',
      name: 'Add Fury Power',
      description: 'tap: REACTION - ADD fury.',
      isTapAbility: true,
      isReaction: true,
      canBeReactedTo: false, // Special rule for resource-adding abilities
      cost: 'Tap this gear',
      effect: 'ADD fury',
      canActivate: (game: any, owner: any) => {
        // Can activate if the gear is ready (not exhausted)
        return self.ready === true;
      },
      activate: async (game: any, owner: any, actions: any) => {
        // Exhaust the gear (tap it)
        const exhaustAction = new ExhaustCardAction(owner, { card: self }, self);
        await actions.execute(exhaustAction, game);

        // Add 1 fury power to owner's power pool
        const ownerAny = owner as any;
        if (!ownerAny.powerPool) {
          ownerAny.powerPool = {};
        }
        if (!ownerAny.powerPool.fury) {
          ownerAny.powerPool.fury = 0;
        }
        ownerAny.powerPool.fury += 1;

        // Log the power addition
        console.log(`[Seal of Rage] Added 1 fury power to ${owner.name}'s pool. New total: ${ownerAny.powerPool.fury}`);
      },
    });
  },

  /**
   * Alternative declarative approach:
   * If the system supports a dedicated tap ability registration:
   */
  // tapAbility: {
  //   isReaction: true,
  //   canBeReactedTo: false,
  //   canActivate: (ctx) => ctx.self.ready === true,
  //   onActivate: async (ctx) => {
  //     // Tap the gear
  //     await ctx.actions.exhaust(ctx.self);
  //
  //     // Add fury power
  //     ctx.owner.powerPool.fury = (ctx.owner.powerPool.fury || 0) + 1;
  //   },
  // },
};
