/**
 * Local storage utility for managing current player ID
 */

const PLAYER_ID_KEY = 'riftbound_player_id';

export const playerStorage = {
  /**
   * Save the current player ID to localStorage
   */
  setPlayerId(playerId: string): void {
    try {
      localStorage.setItem(PLAYER_ID_KEY, playerId);
    } catch (error) {
      console.error('Failed to save player ID to localStorage:', error);
    }
  },

  /**
   * Get the current player ID from localStorage
   */
  getPlayerId(): string | null {
    try {
      return localStorage.getItem(PLAYER_ID_KEY);
    } catch (error) {
      console.error('Failed to read player ID from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove the current player ID from localStorage
   */
  clearPlayerId(): void {
    try {
      localStorage.removeItem(PLAYER_ID_KEY);
    } catch (error) {
      console.error('Failed to clear player ID from localStorage:', error);
    }
  },
};
