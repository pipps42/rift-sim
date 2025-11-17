import { useState, useEffect } from 'react';
import { gameApi } from '../services/api';
import { playerStorage } from '../utils/playerStorage';

interface LobbyViewProps {
  onGameJoined?: (gameId: string) => void;
}

export function LobbyView({ onGameJoined }: LobbyViewProps) {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch active games
  const fetchGames = async () => {
    try {
      const response = await gameApi.getActiveGames();
      if (response.success && response.data) {
        // Filter only games waiting for players
        const waitingGames = response.data.games.filter(
          (g: any) => g.status === 'waiting_for_players'
        );
        setGames(waitingGames);
      }
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    // Poll for new games every 3 seconds
    const interval = setInterval(fetchGames, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateGame = async () => {
    setCreating(true);
    setError(null);
    try {
      const response = await gameApi.createGame();
      if (response.success && response.data) {
        console.log('Game created:', response.data.gameId);

        // Save player1Id to localStorage
        if (response.data.player1Id) {
          playerStorage.setPlayerId(response.data.player1Id);
          console.log('Saved player ID:', response.data.player1Id);
        }

        // Enter the waiting room
        if (onGameJoined) {
          onGameJoined(response.data.gameId);
        }
      } else {
        // Handle error object from backend (may be string or {message, stack} object)
        const errorMsg = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Failed to create game';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Failed to create game:', err);
      setError('Failed to create game');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    setJoiningGameId(gameId);
    setError(null);
    try {
      const response = await gameApi.joinGame(gameId);
      if (response.success && response.data) {
        console.log('Joined game:', gameId);

        // Save player2Id to localStorage
        if (response.data.player2Id) {
          playerStorage.setPlayerId(response.data.player2Id);
          console.log('Saved player ID:', response.data.player2Id);
        }

        // Navigate to game view
        if (onGameJoined) {
          onGameJoined(gameId);
        }
      } else {
        // Handle error object from backend (may be string or {message, stack} object)
        const errorMsg = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Failed to join game';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Failed to join game:', err);
      setError('Failed to join game');
    } finally {
      setJoiningGameId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Riftbound TCG</h1>
          <p className="text-slate-400">Multiplayer Lobby</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Create game button */}
        <div className="mb-8">
          <button
            onClick={handleCreateGame}
            disabled={creating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            {creating ? 'Creating...' : 'Create New Game'}
          </button>
        </div>

        {/* Games list */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Games</h2>
          {loading ? (
            <div className="text-slate-400">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="p-8 bg-slate-800 border border-slate-700 rounded-lg text-center text-slate-400">
              No games waiting for players. Create a new game!
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game: any) => (
                <div
                  key={game.id}
                  className="p-4 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Game #{game.id.slice(0, 8)}</div>
                    <div className="text-sm text-slate-400">
                      Host: {game.players[0]?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-green-400 mt-1">Waiting for opponent...</div>
                  </div>
                  <button
                    onClick={() => handleJoinGame(game.id)}
                    disabled={joiningGameId === game.id}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-semibold transition-colors"
                  >
                    {joiningGameId === game.id ? 'Joining...' : 'Join Game'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
            <li>Create a new game or join an existing one</li>
            <li>Wait for your opponent (or open in another browser window)</li>
            <li>Game starts automatically when both players are connected</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
