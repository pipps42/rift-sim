/**
 * CLIInputHandler - Handles user input and command parsing
 *
 * Supported commands:
 * - help: show available commands
 * - hand: show current player's hand
 * - base: show current player's base
 * - play <index>: play card from hand
 * - move <index> <battlefield>: move unit to battlefield
 * - pass: pass priority/end action phase
 * - quit: exit game
 */

import * as readline from 'readline';
import { GameCard, Player, Game } from '@/types/game';

export interface Command {
  action: string;
  args: string[];
}

export interface CommandResult {
  success: boolean;
  message?: string;
  data?: any;
}

export class CLIInputHandler {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Prompt user for input
   */
  async prompt(message: string = '> '): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(message, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Parse user input into command
   */
  parseCommand(input: string): Command {
    const parts = input.trim().split(/\s+/);
    const action = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1);

    return { action, args };
  }

  /**
   * Validate play command
   */
  validatePlayCommand(cmd: Command, player: Player): CommandResult {
    if (cmd.args.length === 0) {
      return {
        success: false,
        message: 'Usage: play <card_index> [target_index]'
      };
    }

    const cardIndex = parseInt(cmd.args[0] || '') - 1;
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= player.zones.hand.length) {
      return {
        success: false,
        message: `Invalid card index. You have ${player.zones.hand.length} cards in hand.`
      };
    }

    const card = player.zones.hand[cardIndex];
    if (!card) {
      return {
        success: false,
        message: 'Card not found.'
      };
    }

    return {
      success: true,
      data: { card, cardIndex }
    };
  }

  /**
   * Validate move command
   */
  validateMoveCommand(cmd: Command, player: Player, game: Game): CommandResult {
    if (cmd.args.length < 2) {
      return {
        success: false,
        message: 'Usage: move <unit_index> <battlefield_index>'
      };
    }

    const unitIndex = parseInt(cmd.args[0] || '') - 1;
    const battlefieldIndex = parseInt(cmd.args[1] || '') - 1;

    // Validate unit index
    if (isNaN(unitIndex) || unitIndex < 0 || unitIndex >= player.zones.base.length) {
      return {
        success: false,
        message: `Invalid unit index. You have ${player.zones.base.length} units in base.`
      };
    }

    const unit = player.zones.base[unitIndex];
    if (!unit) {
      return {
        success: false,
        message: 'Unit not found.'
      };
    }

    if (unit.cardType !== 'unit') {
      return {
        success: false,
        message: 'Only units can move to battlefields.'
      };
    }

    if (!unit.ready) {
      return {
        success: false,
        message: 'Unit must be ready to move (not exhausted).'
      };
    }

    // Validate battlefield index
    if (isNaN(battlefieldIndex) || battlefieldIndex < 0 || battlefieldIndex >= game.battlefields.length) {
      return {
        success: false,
        message: `Invalid battlefield index. There are ${game.battlefields.length} battlefields.`
      };
    }

    const battlefield = game.battlefields[battlefieldIndex];
    if (!battlefield) {
      return {
        success: false,
        message: 'Battlefield not found.'
      };
    }

    return {
      success: true,
      data: { unit, unitIndex, battlefield, battlefieldIndex }
    };
  }

  /**
   * Validate target selection
   */
  validateTarget(targetIndex: number, game: Game): CommandResult {
    // For now, just validate it's a number
    // Later we'll implement proper target selection
    if (isNaN(targetIndex) || targetIndex < 0) {
      return {
        success: false,
        message: 'Invalid target index.'
      };
    }

    return { success: true };
  }

  /**
   * Get all possible targets in game
   */
  getAllTargets(game: Game): GameCard[] {
    const targets: GameCard[] = [];

    // Add all units on battlefields
    for (const bf of game.battlefields) {
      targets.push(...bf.units);
    }

    // Add all cards in base
    for (const player of game.players) {
      targets.push(...player.zones.base);
      targets.push(...player.zones.championZone);
    }

    return targets;
  }

  /**
   * Close readline interface
   */
  close(): void {
    this.rl.close();
  }

  /**
   * Wait for user to press enter
   */
  async waitForEnter(message: string = '\nPress Enter to continue...'): Promise<void> {
    await this.prompt(message);
  }

  /**
   * Select a target from list of available targets
   */
  async selectTarget(availableTargets: GameCard[], message: string = 'Select target:'): Promise<GameCard | null> {
    if (availableTargets.length === 0) {
      return null;
    }

    console.log(`\n${message}`);
    availableTargets.forEach((target, index) => {
      const owner = target.controllerId;
      const might = target.might !== undefined ? ` ${target.damage}/${target.might}` : '';
      console.log(`  [${index + 1}] ${target.name}${might} (${owner})`);
    });
    console.log('  [0] Cancel');

    const input = await this.prompt('Target: ');
    const index = parseInt(input) - 1;

    if (input === '0' || isNaN(index) || index < 0 || index >= availableTargets.length) {
      return null;
    }

    return availableTargets[index] || null;
  }

  /**
   * Select multiple targets from list
   */
  async selectMultipleTargets(
    availableTargets: GameCard[],
    count: number,
    message: string = 'Select targets:'
  ): Promise<GameCard[]> {
    const selected: GameCard[] = [];

    for (let i = 0; i < count; i++) {
      const target = await this.selectTarget(
        availableTargets.filter(t => !selected.includes(t)),
        `${message} (${i + 1}/${count})`
      );

      if (!target) break;
      selected.push(target);
    }

    return selected;
  }

  /**
   * Prompt for chain response (play spell/ability in response)
   */
  async promptForChainResponse(playerName: string): Promise<boolean> {
    const input = await this.prompt(`${playerName}, respond to chain? (y/n): `);
    return input.toLowerCase() === 'y' || input.toLowerCase() === 'yes';
  }

  /**
   * Distribute damage among targets
   */
  async distributeDamage(totalDamage: number, targets: GameCard[]): Promise<Map<string, number>> {
    const distribution = new Map<string, number>();
    let remainingDamage = totalDamage;

    console.log(`\nDistribute ${totalDamage} damage among targets:`);

    for (const target of targets) {
      if (remainingDamage <= 0) break;

      const lethalDamage = (target.might || 0) - target.damage;
      const maxDamage = Math.min(remainingDamage, lethalDamage + 10); // Allow overkill

      console.log(`\n${target.name} - ${target.damage}/${target.might || 0} (lethal: ${lethalDamage})`);
      console.log(`Remaining damage: ${remainingDamage}`);

      const input = await this.prompt(`Assign damage to ${target.name} (0-${maxDamage}): `);
      const damage = parseInt(input);

      if (!isNaN(damage) && damage >= 0 && damage <= maxDamage) {
        distribution.set(target.instanceId, damage);
        remainingDamage -= damage;
      }
    }

    if (remainingDamage > 0) {
      console.log(`\nWarning: ${remainingDamage} damage not assigned (will be wasted)`);
      await this.waitForEnter();
    }

    return distribution;
  }

  /**
   * Confirm an action
   */
  async confirm(message: string): Promise<boolean> {
    const input = await this.prompt(`${message} (y/n): `);
    return input.toLowerCase() === 'y' || input.toLowerCase() === 'yes';
  }
}
