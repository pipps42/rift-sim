/**
 * API client for Riftbound backend
 * Provides typed methods for all game API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GameData {
  game: any; // Game state from backend (serialized)
}

interface CreateGameResponse {
  gameId: string;
  game: any;
  player1Id: string;
  message: string;
}

interface JoinGameResponse {
  game: any;
  player1Id: string;
  player2Id: string;
  message: string;
}

export class GameApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all active games
   * GET /games
   */
  async getActiveGames(): Promise<ApiResponse<{ games: any[] }>> {
    const response = await fetch(`${this.baseUrl}/games`, {
      credentials: 'include', // Send cookies
    });
    return response.json();
  }

  /**
   * Create a new game lobby (waiting for player 2)
   * POST /games
   */
  async createGame(): Promise<ApiResponse<CreateGameResponse>> {
    const response = await fetch(`${this.baseUrl}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
    });
    return response.json();
  }

  /**
   * Join an existing game lobby
   * POST /games/:gameId/join
   */
  async joinGame(gameId: string): Promise<ApiResponse<JoinGameResponse>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
    });
    return response.json();
  }

  /**
   * Get game state by ID
   * GET /games/:gameId
   */
  async getGame(gameId: string): Promise<ApiResponse<GameData>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}`, {
      credentials: 'include', // Send cookies
    });
    return response.json();
  }

  /**
   * Play a card
   * POST /games/:gameId/actions/play-card
   */
  async playCard(
    gameId: string,
    cardInstanceId: string,
    targets?: any[]
  ): Promise<ApiResponse<GameData>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/actions/play-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ cardInstanceId, targets }),
    });
    return response.json();
  }

  /**
   * Move a unit to another battlefield
   * POST /games/:gameId/actions/move-unit
   */
  async moveUnit(
    gameId: string,
    unitInstanceId: string,
    toBattlefieldId: string
  ): Promise<ApiResponse<GameData>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/actions/move-unit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ unitInstanceId, toBattlefieldId }),
    });
    return response.json();
  }

  /**
   * Activate a card ability
   * POST /games/:gameId/actions/activate-ability
   */
  async activateAbility(
    gameId: string,
    cardInstanceId: string,
    abilityId: string,
    targets?: any[]
  ): Promise<ApiResponse<GameData>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/actions/activate-ability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ cardInstanceId, abilityId, targets }),
    });
    return response.json();
  }

  /**
   * Pass priority to opponent
   * POST /games/:gameId/actions/pass-priority
   */
  async passPriority(gameId: string): Promise<ApiResponse<GameData>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/actions/pass-priority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
    });
    return response.json();
  }

  /**
   * Get playable cards for current player
   * GET /games/:gameId/playable-cards
   */
  async getPlayableCards(gameId: string): Promise<ApiResponse<{ playableCards: any[] }>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/playable-cards`, {
      credentials: 'include', // Send cookies
    });
    return response.json();
  }

  /**
   * Get activatable abilities for current player
   * GET /games/:gameId/activatable-abilities
   */
  async getActivatableAbilities(gameId: string): Promise<ApiResponse<{ activatableCards: any[] }>> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/activatable-abilities`, {
      credentials: 'include', // Send cookies
    });
    return response.json();
  }
}

/**
 * Default API client instance
 */
export const gameApi = new GameApiClient();
