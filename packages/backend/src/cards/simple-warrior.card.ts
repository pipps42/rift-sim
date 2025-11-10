import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';

/**
 * Simple Warrior
 * Unit - Common - Fury
 * Cost: 2 energy
 * Might: 2
 *
 * Description: A basic warrior unit for early game presence.
 *
 * Tags: Noxus, Warrior
 *
 * Implementation:
 * - Vanilla unit with no special effects
 * - Good for early game plays and testing rune system
 * - No card script needed (no hooks)
 */
const simpleWarrior: CardScript = {
  // No hooks needed for vanilla units
};

export default simpleWarrior;
