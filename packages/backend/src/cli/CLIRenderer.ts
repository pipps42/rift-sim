/**
 * CLIRenderer - Renders game state to console
 *
 * Displays:
 * - Player info (score, energy, power, hand size)
 * - Battlefield zone with units
 * - Base zones with units/gear
 * - Current phase and turn state
 */

import { Game, Player, GameCard, Battlefield, GamePhase, TurnState } from '@/types/game';
import chalk from 'chalk';

export class CLIRenderer {
  /**
   * Render complete game state
   */
  render(game: Game): void {
    console.clear();
    this.renderHeader();
    this.renderPhaseInfo(game);
    this.renderPlayers(game);
    this.renderBattlefield(game);
    this.renderChain(game);
  }

  /**
   * Render game header
   */
  private renderHeader(): void {
    console.log(chalk.bold.cyan('═'.repeat(80)));
    console.log(chalk.bold.cyan('               RIFTBOUND SIMULATOR - CLI GAME               '));
    console.log(chalk.bold.cyan('═'.repeat(80)));
    console.log();
  }

  /**
   * Render current phase and turn info
   */
  private renderPhaseInfo(game: Game): void {
    const currentPlayer = game.players[game.currentPlayerIndex];
    const phaseColor = this.getPhaseColor(game.phase);
    const stateColor = this.getTurnStateColor(game.turnState);

    console.log(chalk.bold(`Turn ${game.round} - ${currentPlayer?.name || 'Unknown'}'s turn`));
    console.log(phaseColor(`Phase: ${game.phase}`));
    console.log(stateColor(`State: ${game.turnState}`));
    console.log();
  }

  /**
   * Render both players' info
   */
  private renderPlayers(game: Game): void {
    const currentPlayerIndex = game.currentPlayerIndex;

    game.players.forEach((player, index) => {
      const isActive = index === currentPlayerIndex;
      const prefix = isActive ? chalk.bold.green('► ') : '  ';

      console.log(prefix + this.renderPlayerInfo(player, isActive));
    });
    console.log();
  }

  /**
   * Render single player info line
   */
  private renderPlayerInfo(player: Player, isActive: boolean): string {
    const nameColor = isActive ? chalk.bold.green : chalk.white;
    const scoreColor = player.score >= 7 ? chalk.bold.yellow : chalk.white;

    // Energy and Power
    const energy = player.runePool.energy;
    const powerStr = player.runePool.power.length > 0
      ? player.runePool.power.map(p => `${p.amount}${this.getDomainSymbol(p.domain)}`).join(' ')
      : 'none';

    // Hand size
    const handSize = player.zones.hand.length;

    // Base units/gear count
    const baseCount = player.zones.base.length;

    // Runes count
    const readyRunes = player.zones.runes.filter(r => r.ready).length;
    const exhaustedRunes = player.zones.runes.filter(r => !r.ready).length;
    const runesStr = `${readyRunes}/${exhaustedRunes + readyRunes}`;

    return `${nameColor(player.name)} | Score: ${scoreColor(player.score)}/8 | Energy: ${energy} | Power: ${powerStr} | Runes: ${runesStr} | Hand: ${handSize} | Base: ${baseCount}`;
  }

  /**
   * Render battlefield zone
   */
  private renderBattlefield(game: Game): void {
    console.log(chalk.bold('═'.repeat(80)));
    console.log(chalk.bold('BATTLEFIELD ZONE'));
    console.log(chalk.bold('═'.repeat(80)));

    if (game.battlefields.length === 0) {
      console.log(chalk.gray('  No battlefields in play'));
      console.log();
      return;
    }

    game.battlefields.forEach((bf, index) => {
      this.renderSingleBattlefield(game, bf, index + 1);
    });
    console.log();
  }

  /**
   * Render a single battlefield
   */
  private renderSingleBattlefield(game: Game, battlefield: Battlefield, number: number): void {
    const controller = battlefield.controller
      ? game.players.find(p => p.id === battlefield.controller)
      : null;

    const controlStatus = controller
      ? chalk.green(`Controlled by ${controller.name}`)
      : battlefield.contested
      ? chalk.yellow('CONTESTED')
      : chalk.gray('Uncontrolled');

    console.log(chalk.bold(`[${number}] ${battlefield.card.name}`) + ` - ${controlStatus}`);

    // Show units at battlefield
    if (battlefield.units.length === 0) {
      console.log(chalk.gray('    Empty'));
    } else {
      // Group units by controller
      const unitsByPlayer = new Map<string, GameCard[]>();
      battlefield.units.forEach(unit => {
        const controllerId = unit.controllerId;
        if (!unitsByPlayer.has(controllerId)) {
          unitsByPlayer.set(controllerId, []);
        }
        unitsByPlayer.get(controllerId)!.push(unit);
      });

      unitsByPlayer.forEach((units, controllerId) => {
        const player = game.players.find(p => p.id === controllerId);
        console.log(chalk.bold(`    ${player?.name || 'Unknown'}'s units:`));
        units.forEach(unit => {
          console.log(`      ${this.renderCard(unit)}`);
        });
      });
    }
    console.log();
  }

  /**
   * Render chain if active
   */
  private renderChain(game: Game): void {
    if (game.chain.length === 0) return;

    console.log(chalk.bold('═'.repeat(80)));
    console.log(chalk.bold.magenta('CHAIN (Stack)'));
    console.log(chalk.bold('═'.repeat(80)));

    game.chain.slice().reverse().forEach((item, index) => {
      const actualIndex = game.chain.length - 1 - index;
      const card = this.findCardById(game, item.sourceCardId || '');
      console.log(`  [${actualIndex}] ${card?.name || item.sourceCardId || 'Unknown'}`);
    });
    console.log();
  }

  /**
   * Render a single card
   */
  renderCard(card: GameCard, includeZone: boolean = false): string {
    const name = chalk.bold(card.name);
    const cost = card.energyCost > 0 ? chalk.cyan(`[${card.energyCost}E]`) : '';
    const might = card.might !== undefined ? chalk.red(`${card.damage}/${card.might}`) : '';
    const ready = card.ready ? chalk.green('✓') : chalk.gray('✗');
    const zone = includeZone ? chalk.gray(`[${card.zone}]`) : '';

    let parts = [name];
    if (cost) parts.push(cost);
    if (might) parts.push(might);
    parts.push(ready);
    if (zone) parts.push(zone);

    return parts.join(' ');
  }

  /**
   * Render player's hand
   */
  renderHand(player: Player): void {
    console.log(chalk.bold('Your Hand:'));
    if (player.zones.hand.length === 0) {
      console.log(chalk.gray('  Empty'));
      return;
    }

    player.zones.hand.forEach((card, index) => {
      console.log(`  [${index + 1}] ${this.renderCard(card)}`);
    });
  }

  /**
   * Render player's base
   */
  renderBase(player: Player): void {
    console.log(chalk.bold('Your Base:'));
    if (player.zones.base.length === 0) {
      console.log(chalk.gray('  Empty'));
      return;
    }

    player.zones.base.forEach((card, index) => {
      console.log(`  [${index + 1}] ${this.renderCard(card)}`);
    });
  }

  /**
   * Render player's runes
   */
  renderRunes(player: Player): void {
    console.log(chalk.bold('Your Runes:'));
    console.log(chalk.cyan(`Current Energy Pool: ${player.runePool.energy}`));

    if (player.runePool.power.length > 0) {
      const powerStr = player.runePool.power.map(p => `${p.amount}${this.getDomainSymbol(p.domain)}`).join(' ');
      console.log(chalk.cyan(`Current Power Pool: ${powerStr}`));
    } else {
      console.log(chalk.gray('Current Power Pool: none'));
    }

    console.log();

    if (player.zones.runes.length === 0) {
      console.log(chalk.gray('  No runes on board'));
      return;
    }

    console.log(chalk.bold('Runes on Board:'));
    player.zones.runes.forEach((rune, index) => {
      const domains = rune.domains?.map(d => this.getDomainSymbol(d)).join('') || '';
      const status = rune.ready ? chalk.green('Ready') : chalk.gray('Exhausted');
      console.log(`  [${index + 1}] ${rune.name} [${domains}] - ${status}`);
    });

    console.log();
    console.log(chalk.gray('Tip: Use "tap <index>" to tap a ready rune for +1 energy'));
  }

  /**
   * Render available actions menu
   */
  renderActionsMenu(actions: string[]): void {
    console.log(chalk.bold('\nAvailable Actions:'));
    actions.forEach(action => {
      console.log(`  ${action}`);
    });
  }

  /**
   * Display error message
   */
  renderError(message: string): void {
    console.log(chalk.bold.red(`\n✗ Error: ${message}\n`));
  }

  /**
   * Display success message
   */
  renderSuccess(message: string): void {
    console.log(chalk.bold.green(`\n✓ ${message}\n`));
  }

  /**
   * Display info message
   */
  renderInfo(message: string): void {
    console.log(chalk.bold.cyan(`\nℹ ${message}\n`));
  }

  /**
   * Render combat state
   */
  renderCombatState(game: Game): void {
    if (!game.combatState) return;

    const battlefield = game.battlefields.find(b => b.id === game.combatState!.battlefield);
    if (!battlefield) return;

    console.log(chalk.bold.red('\n⚔️  COMBAT IN PROGRESS ⚔️\n'));
    console.log(chalk.bold(`Battlefield: ${battlefield.card.name}`));

    const attackingPlayer = game.players.find(p => p.id === game.combatState!.attackingPlayer);
    const defendingPlayer = game.players.find(p => p.id === game.combatState!.defendingPlayer);

    console.log(chalk.bold.red(`\nAttackers (${attackingPlayer?.name}):`));
    game.combatState.attackingUnits.forEach(unit => {
      const card = this.findCardById(game, unit.cardId);
      const assault = unit.keywords.includes('ASSAULT' as any) ? chalk.yellow(' [ASSAULT]') : '';
      console.log(`  ${card?.name || unit.cardId} - Might: ${unit.might}${assault}`);
    });
    console.log(chalk.red(`Total Attacking Might: ${game.combatState.totalAttackingMight}`));

    console.log(chalk.bold.blue(`\nDefenders (${defendingPlayer?.name}):`));
    game.combatState.defendingUnits.forEach(unit => {
      const card = this.findCardById(game, unit.cardId);
      const shield = unit.keywords.includes('SHIELD' as any) ? chalk.yellow(' [SHIELD]') : '';
      const tank = unit.keywords.includes('TANK' as any) ? chalk.yellow(' [TANK]') : '';
      console.log(`  ${card?.name || unit.cardId} - Might: ${unit.might}${shield}${tank}`);
    });
    console.log(chalk.blue(`Total Defending Might: ${game.combatState.totalDefendingMight}`));

    console.log();
  }

  /**
   * Render damage distribution
   */
  renderDamageDistribution(damageDistribution: any[]): void {
    console.log(chalk.bold.yellow('\nDamage Distribution:'));
    damageDistribution.forEach(dmg => {
      const lethal = dmg.isLethalDamage ? chalk.red(' [LETHAL]') : '';
      console.log(`  ${dmg.targetCardId}: ${dmg.damage} damage${lethal}`);
    });
    console.log();
  }

  // ===================================================================
  // HELPER METHODS
  // ===================================================================

  private getPhaseColor(phase: GamePhase): (text: string) => string {
    switch (phase) {
      case GamePhase.AWAKEN: return chalk.yellow;
      case GamePhase.BEGINNING: return chalk.cyan;
      case GamePhase.CHANNEL: return chalk.magenta;
      case GamePhase.DRAW: return chalk.blue;
      case GamePhase.ACTION: return chalk.green;
      case GamePhase.ENDING: return chalk.yellow;
      case GamePhase.EXPIRATION: return chalk.gray;
      case GamePhase.CLEANUP: return chalk.gray;
      default: return chalk.white;
    }
  }

  private getTurnStateColor(state: TurnState): (text: string) => string {
    switch (state) {
      case TurnState.NEUTRAL_OPEN: return chalk.green;
      case TurnState.NEUTRAL_CLOSED: return chalk.yellow;
      case TurnState.SHOWDOWN_OPEN: return chalk.red;
      case TurnState.SHOWDOWN_CLOSED: return chalk.magenta;
      default: return chalk.white;
    }
  }

  private getDomainSymbol(domain: string): string {
    const symbols: Record<string, string> = {
      fury: 'F',
      calm: 'C',
      mind: 'M',
      body: 'B',
      chaos: 'X',
      order: 'O',
      universal: 'U'
    };
    return symbols[domain.toLowerCase()] || domain[0]?.toUpperCase() || '?';
  }

  private findCardById(game: Game, cardId: string): GameCard | undefined {
    for (const player of game.players) {
      const allCards = [
        ...player.zones.hand,
        ...player.zones.base,
        ...player.zones.championZone,
        ...player.zones.runes,
        ...player.zones.trash,
        ...player.zones.banishment
      ];

      const found = allCards.find(c => c.cardId === cardId || c.instanceId === cardId);
      if (found) return found;
    }

    // Check battlefields
    for (const bf of game.battlefields) {
      const found = bf.units.find(u => u.cardId === cardId || u.instanceId === cardId);
      if (found) return found;
    }

    return undefined;
  }
}
