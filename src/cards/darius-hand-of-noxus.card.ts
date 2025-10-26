import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';
import { ExhaustCardAction } from '../engine/actions/concrete/ExhaustCardAction';

/**
 * Darius, Hand of Noxus
 * Legend - Rare - Fury
 * Cost: 0 energy
 *
 * tap REACTION, LEGION - ADD 1
 * (Abilities that add resources can't be reacted to. Get the effect if you've played a card this turn.)
 *
 * Implementation:
 * - Activated tap ability with REACTION timing
 * - LEGION condition: Only works if owner has played a card this turn
 * - Effect: ADD 1 (adds 1 energy to energy pool)
 * - Cannot be reacted to (opponents can't respond)
 *
 * Keywords:
 * - REACTION: Can be activated on opponent's turn or in response to spells
 * - LEGION: Conditional on having played a card this turn (represents army support)
 */
export const dariusHandOfNoxus: CardScript = {
  onEntersPlay: async (ctx: CardContext) => {
    const { self, owner } = ctx;

    // Register the tap ability
    const selfAny = self as any;
    if (!selfAny.activatedAbilities) {
      selfAny.activatedAbilities = [];
    }

    selfAny.activatedAbilities.push({
      id: 'darius-legion-add',
      name: 'Legion - ADD 1',
      description: 'tap REACTION, LEGION - ADD 1',
      isTapAbility: true,
      isReaction: true,
      canBeReactedTo: false, // Resource-adding abilities can't be reacted to
      cost: 'Tap Darius',
      effect: 'ADD 1 energy',
      requiresLegion: true,
      canActivate: (game: any, owner: any) => {
        // Can activate if:
        // 1. Darius is ready (not exhausted)
        // 2. LEGION condition is met (played a card this turn)
        if (!self.ready) {
          return false;
        }

        // Check LEGION condition: has owner played a card this turn?
        const gameAny = game as any;
        if (!gameAny.cardsPlayedThisTurn) {
          return false;
        }

        const turnKey = `${game.currentTurn}-${owner.id}`;
        const cardsPlayedCount = gameAny.cardsPlayedThisTurn[turnKey] || 0;

        // LEGION requires at least 1 card played this turn
        return cardsPlayedCount >= 1;
      },
      activate: async (game: any, owner: any, actions: any) => {
        // Tap Darius
        const exhaustAction = new ExhaustCardAction(owner, { card: self }, self);
        await actions.execute(exhaustAction, game);

        // ADD 1 energy
        const ownerAny = owner as any;
        ownerAny.energy = (ownerAny.energy || 0) + 1;

        console.log(`[Darius, Hand of Noxus] LEGION activated. Added 1 energy. New total: ${ownerAny.energy}`);
      },
    });
  },

  /**
   * Implementation notes:
   *
   * 1. LEGION keyword:
   *    - LEGION effects only work if you've played a card this turn
   *    - This represents Darius leading his army/legion
   *    - Encourages aggressive, proactive gameplay
   *    - Tracks via game.cardsPlayedThisTurn counter
   *
   * 2. Resource ramping:
   *    - "ADD 1" adds 1 energy to the pool
   *    - This is powerful as it provides ramp/acceleration
   *    - Balanced by requiring LEGION condition and tap cost
   *
   * 3. REACTION with no response:
   *    - Can be activated on opponent's turn (REACTION)
   *    - But opponent can't respond to it (resource abilities restriction)
   *    - This allows for surprise plays with the extra energy
   *
   * 4. Synergy with aggressive decks:
   *    - Works best in decks that play multiple cards per turn
   *    - Provides extra energy for followup plays
   *    - Pairs well with low-cost aggressive units
   *
   * 5. Comparison with Seal of Rage:
   *    - Seal of Rage: tap to ADD fury power (domain power)
   *    - Darius: tap to ADD 1 energy (with LEGION condition)
   *    - Darius is more flexible (energy works for anything) but conditional
   *    - Seal provides domain power (more restrictive) but unconditional
   */
};
