/**
 * Game API
 *
 * API methods for game creation, joining, and state management.
 */

import { apiClient } from './client';
import type {
  CreateGameRequest,
  CreateGameResponse,
  JoinGameRequest,
  JoinGameResponse,
  StartGameRequest,
  GameStateResponse,
  Game,
} from './types';

/**
 * Game API endpoints
 */
export const gamesApi = {
  /**
   * Create a new game
   *
   * POST /api/v1/games
   * @param player2Id Optional second player ID (creates AI opponent if not provided)
   */
  async createGame(player2Id?: string): Promise<CreateGameResponse> {
    const request: CreateGameRequest = { player2Id };
    return apiClient.post<CreateGameResponse>('/v1/games', request);
  },

  /**
   * Join an existing game
   *
   * POST /api/v1/games/:gameId/join
   */
  async joinGame(gameId: string, playerName: string): Promise<JoinGameResponse> {
    const request: JoinGameRequest = { gameId, playerName };
    return apiClient.post<JoinGameResponse>(`/v1/games/${gameId}/join`, request);
  },

  /**
   * Start a game (begin setup phase)
   *
   * POST /api/v1/games/:gameId/start
   */
  async startGame(gameId: string): Promise<GameStateResponse> {
    const request: StartGameRequest = { gameId };
    return apiClient.post<GameStateResponse>(`/v1/games/${gameId}/start`, request);
  },

  /**
   * Get current game state
   *
   * GET /api/v1/games/:gameId
   */
  async getGame(gameId: string): Promise<GameStateResponse> {
    return apiClient.get<GameStateResponse>(`/v1/games/${gameId}`);
  },

  /**
   * Get player's hand
   *
   * GET /api/v1/games/:gameId/players/:playerId/hand
   */
  async getPlayerHand(gameId: string, playerId: string): Promise<any> {
    return apiClient.get(`/v1/games/${gameId}/players/${playerId}/hand`);
  },

  /**
   * Get list of all active games
   *
   * GET /api/v1/games
   */
  async listGames(): Promise<{ games: Game[] }> {
    return apiClient.get<{ games: Game[] }>('/v1/games');
  },
};

/**
 * Export individual methods for convenience
 */
export const {
  createGame,
  joinGame,
  startGame,
  getGame,
  getPlayerHand,
  listGames,
} = gamesApi;
