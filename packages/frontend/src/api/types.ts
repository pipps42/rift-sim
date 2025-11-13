/**
 * API Type Definitions
 *
 * Type definitions for API requests and responses.
 * These mirror the backend API types.
 */

// ============================================================================
// Game Types
// ============================================================================

export interface Player {
  id: string;
  name: string;
  championLegend: ChampionLegend;
  zones: PlayerZones;
  runePool: RunePool;
  victoryPoints: number;
  hasPriority: boolean;
}

export interface ChampionLegend {
  id: string;
  name: string;
  description: string;
}

export interface PlayerZones {
  hand: GameCard[];
  mainDeck: GameCard[];
  runeDeck: GameCard[];
  championZone: GameCard[];
  base: GameCard[];
  trash: GameCard[];
  exile: GameCard[];
}

export interface GameCard {
  instanceId: string;
  cardId: string;
  name: string;
  energyCost: number;
  description: string;
  cardType: string;
  zone: string;
  ready: boolean;
  damage: number;
  might?: number;
}

export interface RunePool {
  energy: number;
  power: PowerCost[];
}

export interface PowerCost {
  domain: string;
  amount: number;
}

export interface Game {
  id: string;
  status: string;
  players: Player[];
  currentPlayerIndex: number;
  phase: string;
  turnState: string;
  round: number;
  battlefields: Battlefield[];
  createdAt: string;
  updatedAt: string;
}

export interface Battlefield {
  id: string;
  card: any; // BattlefieldCard type
  units: GameCard[];
  sides: Record<string, GameCard[]>;
  contested: boolean;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface CreateGameRequest {
  player2Id?: string;
}

export interface JoinGameRequest {
  gameId: string;
  playerName: string;
}

export interface StartGameRequest {
  gameId: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateGameResponse {
  game: Game;
  player1Id: string;
  player2Id: string;
  message: string;
}

export interface JoinGameResponse {
  game: Game;
  playerId: string;
}

export interface GameStateResponse {
  game: Game;
}

// ============================================================================
// Error Types
// ============================================================================

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(
    message: string,
    status: number,
    code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}
