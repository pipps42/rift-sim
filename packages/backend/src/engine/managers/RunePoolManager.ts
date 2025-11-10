import {
  Game,
  Player,
  RunePool,
  PowerPool,
  Domain,
  PowerCost,
  CostPayment,
  Card
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { logger } from '@/utils/logger';

/**
 * Manages Energy and Power resources according to Riftbound rules
 */
export class RunePoolManager {

  /**
   * Channel runes from Rune Deck to the board
   */
  async channelRunes(game: Game, playerId: string, count: number): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    for (let i = 0; i < count; i++) {
      if (player.zones.runeDeck.length === 0) {
        logger.warn(`RunePoolManager: Player ${playerId} has no runes left to channel`);
        break;
      }

      const rune = player.zones.runeDeck.shift();
      if (rune) {
        // Move rune to board (ready state)
        rune.ready = true;
        player.zones.runes.push(rune);

        // Emit rune channeled event
        await eventBus.emit(GameEventFactory.createRuneChanneledEvent(
          game.id,
          playerId,
          rune.cardId
        ));

        logger.debug(`RunePoolManager: Channeled rune ${rune.cardId} for player ${playerId}`);
      }
    }
  }

  /**
   * Add energy to player's rune pool
   */
  async addEnergy(game: Game, playerId: string, amount: number): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    player.runePool.energy += amount;

    logger.debug(`RunePoolManager: Added ${amount} energy to player ${playerId}. Total: ${player.runePool.energy}`);
  }

  /**
   * Add power of specific domain to player's rune pool
   */
  async addPower(game: Game, playerId: string, domain: Domain, amount: number): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Find existing power pool for this domain
    let powerPool = player.runePool.power.find(p => p.domain === domain);

    if (!powerPool) {
      // Create new power pool for this domain
      powerPool = { domain, amount: 0 };
      player.runePool.power.push(powerPool);
    }

    powerPool.amount += amount;

    logger.debug(`RunePoolManager: Added ${amount} ${domain} power to player ${playerId}. Total: ${powerPool.amount}`);
  }

  /**
   * Pay energy cost
   */
  async payEnergyCost(game: Game, playerId: string, amount: number): Promise<boolean> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    if (player.runePool.energy < amount) {
      return false; // Cannot afford
    }

    player.runePool.energy -= amount;

    logger.debug(`RunePoolManager: Player ${playerId} paid ${amount} energy. Remaining: ${player.runePool.energy}`);
    return true;
  }

  /**
   * Pay power costs
   */
  async payPowerCost(game: Game, playerId: string, costs: PowerCost[]): Promise<boolean> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Check if player can afford all costs
    for (const cost of costs) {
      const availablePower = this.getAvailablePower(game, playerId, cost.domain);
      if (availablePower < cost.amount) {
        return false; // Cannot afford
      }
    }

    // Pay all costs
    for (const cost of costs) {
      const powerPool = player.runePool.power.find(p => p.domain === cost.domain);
      if (powerPool) {
        powerPool.amount -= cost.amount;
        logger.debug(`RunePoolManager: Player ${playerId} paid ${cost.amount} ${cost.domain} power. Remaining: ${powerPool.amount}`);
      }
    }

    return true;
  }

  /**
   * Clear player's rune pool
   */
  async clearRunePool(game: Game, playerId: string): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    player.runePool.energy = 0;
    player.runePool.power = [];

    logger.debug(`RunePoolManager: Cleared rune pool for player ${playerId}`);
  }

  /**
   * Check if player can afford a card
   */
  canAffordCard(game: Game, playerId: string, card: Card): boolean {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return false;
    }

    // Check energy cost
    if (player.runePool.energy < card.energyCost) {
      return false;
    }

    // Check power costs
    for (const powerCost of card.powerCost) {
      const availablePower = this.getAvailablePower(game, playerId, powerCost.domain);
      if (availablePower < powerCost.amount) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get available energy for a player
   */
  getAvailableEnergy(game: Game, playerId: string): number {
    const player = game.players.find(p => p.id === playerId);
    return player?.runePool.energy || 0;
  }

  /**
   * Get available power of a specific domain for a player
   */
  getAvailablePower(game: Game, playerId: string, domain: Domain): number {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return 0;
    }

    const powerPool = player.runePool.power.find(p => p.domain === domain);
    return powerPool?.amount || 0;
  }

  /**
   * Recycle a rune to add power (basic rune ability)
   */
  async recycleRune(game: Game, playerId: string, runeId: string): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Find the rune on the board
    const runeIndex = player.zones.runes.findIndex(r => r.instanceId === runeId);
    if (runeIndex === -1) {
      throw new Error(`Rune ${runeId} not found on board for player ${playerId}`);
    }

    const rune = player.zones.runes[runeIndex]!;

    // Remove from board and put at bottom of rune deck
    player.zones.runes.splice(runeIndex, 1);
    player.zones.runeDeck.push(rune);

    // Add power based on rune's domain (placeholder - need actual card data)
    // For now, assume it adds 1 power of its first domain
    // TODO: Implement proper rune abilities when card database is available

    logger.debug(`RunePoolManager: Recycled rune ${runeId} for player ${playerId}`);
  }

  /**
   * Activate basic rune tap ability ([T]: Add [1])
   */
  async tapRuneForEnergy(game: Game, playerId: string, runeId: string): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Find the rune and exhaust it
    const rune = player.zones.runes.find(r => r.instanceId === runeId);
    if (!rune) {
      throw new Error(`Rune ${runeId} not found for player ${playerId}`);
    }

    if (!rune.ready) {
      throw new Error(`Rune ${runeId} is already exhausted`);
    }

    // Exhaust the rune
    rune.ready = false;

    // Add 1 energy
    await this.addEnergy(game, playerId, 1);

    logger.debug(`RunePoolManager: Tapped rune ${runeId} for 1 energy for player ${playerId}`);
  }

  /**
   * Get rune pool summary for display
   */
  getRunePoolSummary(game: Game, playerId: string): {
    energy: number;
    powerByDomain: Record<string, number>;
    readyRunes: number;
    exhaustedRunes: number;
  } {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return {
        energy: 0,
        powerByDomain: {},
        readyRunes: 0,
        exhaustedRunes: 0
      };
    }

    const powerByDomain: Record<string, number> = {};
    player.runePool.power.forEach(p => {
      powerByDomain[p.domain] = p.amount;
    });

    const readyRunes = player.zones.runes.filter(r => r.ready).length;
    const exhaustedRunes = player.zones.runes.filter(r => !r.ready).length;

    return {
      energy: player.runePool.energy,
      powerByDomain,
      readyRunes,
      exhaustedRunes
    };
  }
}