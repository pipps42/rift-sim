import type { Game, GameCard, Player } from '@/types/game.js';

/**
 * Serialized game state without methods, circular refs, or non-serializable objects
 */
export interface SerializedGame {
  id: string;
  players: SerializedPlayer[];
  currentPlayerIndex: 0 | 1;
  phase: string;
  turnState: string;
  round: number;
  currentTurn: number;
  winner?: string;
  status: string;
  battlefields: unknown[];
  chain: unknown[];
  combatState?: unknown;
  showdownState?: unknown;
  history: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SerializedPlayer {
  id: string;
  name: string;
  score: number;
  championLegend: unknown;
  chosenChampion?: unknown;
  zones: {
    base: SerializedCard[];
    runes: SerializedCard[];
    hand: SerializedCard[];
    mainDeck: SerializedCard[];
    runeDeck: SerializedCard[];
    championZone: SerializedCard[];
    trash: SerializedCard[];
    banishment: SerializedCard[];
  };
  runePool: {
    energy: number;
    power: { domain: string; amount: number }[];
  };
  hasPlayedCard: boolean;
  turnsPassed: number;
}

export interface SerializedCard {
  instanceId: string;
  cardId: string;
  name: string;
  cardType: string;
  zone: string;
  controllerId: string;
  ownerId: string;
  ready: boolean;
  damage: number;
  energyCost: number;
  powerCost: { domain: string; amount: number }[];
  // Card-specific properties
  might?: number;
  armor?: number;
  keywords?: string[];
  domains?: string[];
  // Add other properties as needed
}

/**
 * GameSerializer converts Game objects to plain JSON
 * Removes methods, circular references, and non-serializable objects
 */
export class GameSerializer {
  /**
   * Serialize a Game object to plain JSON
   */
  static toJSON(game: Game): SerializedGame {
    const serialized: SerializedGame = {
      id: game.id,
      players: game.players.map((p) => this.serializePlayer(p)),
      currentPlayerIndex: game.currentPlayerIndex,
      phase: game.phase,
      turnState: game.turnState,
      round: game.round,
      currentTurn: game.currentTurn,
      status: game.status,
      battlefields: game.battlefields,
      chain: game.chain,
      history: game.history,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };

    // Explicitly set optional properties if present
    if (game.winner !== undefined) {
      serialized.winner = game.winner;
    }
    if (game.combatState !== undefined) {
      serialized.combatState = game.combatState;
    }
    if (game.showdownState !== undefined) {
      serialized.showdownState = game.showdownState;
    }

    return serialized;
  }

  /**
   * Serialize a Player object
   */
  private static serializePlayer(player: Player): SerializedPlayer {
    return {
      id: player.id,
      name: player.name,
      score: player.score,
      championLegend: player.championLegend,
      chosenChampion: player.chosenChampion,
      zones: {
        base: player.zones.base.map((c) => this.serializeCard(c)),
        runes: player.zones.runes.map((c) => this.serializeCard(c)),
        hand: player.zones.hand.map((c) => this.serializeCard(c)),
        mainDeck: player.zones.mainDeck.map((c) => this.serializeCard(c)),
        runeDeck: player.zones.runeDeck.map((c) => this.serializeCard(c)),
        championZone: player.zones.championZone.map((c) => this.serializeCard(c)),
        trash: player.zones.trash.map((c) => this.serializeCard(c)),
        banishment: player.zones.banishment.map((c) => this.serializeCard(c)),
      },
      runePool: {
        energy: player.runePool.energy,
        power: player.runePool.power,
      },
      hasPlayedCard: player.hasPlayedCard,
      turnsPassed: player.turnsPassed,
    };
  }

  /**
   * Serialize a GameCard object
   */
  private static serializeCard(card: GameCard): SerializedCard {
    const serialized: SerializedCard = {
      instanceId: card.instanceId,
      cardId: card.cardId,
      name: card.name,
      cardType: card.cardType,
      zone: card.zone,
      controllerId: card.controllerId,
      ownerId: card.ownerId,
      ready: card.ready,
      damage: card.damage,
      energyCost: card.energyCost,
      powerCost: card.powerCost,
    };

    // Add optional card-specific properties if present
    const might = (card as { might?: number }).might;
    if (might !== undefined) {
      serialized.might = might;
    }

    const armor = (card as { armor?: number }).armor;
    if (armor !== undefined) {
      serialized.armor = armor;
    }

    if (card.keywords !== undefined) {
      serialized.keywords = card.keywords;
    }

    if (card.domains !== undefined) {
      serialized.domains = card.domains;
    }

    return serialized;
  }
}
