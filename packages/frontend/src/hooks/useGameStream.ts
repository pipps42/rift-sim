import { useEffect, useState, useRef } from 'react';

/**
 * Hook to stream real-time game state updates via Server-Sent Events
 *
 * @param gameId - The game ID to stream
 * @param enabled - Whether the stream is enabled (default: true)
 * @returns Current game state and connection status
 */
export function useGameStream(gameId: string | null, enabled: boolean = true) {
  const [gameState, setGameState] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!gameId || !enabled) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const sseUrl = `${apiUrl}/games/${gameId}/events`;

    console.log('[useGameStream] Connecting to SSE:', sseUrl);

    // Create EventSource connection
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[useGameStream] Connected');
      setIsConnected(true);
      setError(null);
    };

    eventSource.addEventListener('game-state', (event: MessageEvent) => {
      console.log('[useGameStream] Received game-state event');
      try {
        const data = JSON.parse(event.data);
        setGameState(data.game);
      } catch (err) {
        console.error('[useGameStream] Failed to parse game state:', err);
        setError('Failed to parse game state');
      }
    });

    eventSource.onerror = (err) => {
      console.error('[useGameStream] SSE error:', err);
      setIsConnected(false);
      setError('Connection lost. Retrying...');
      // EventSource auto-reconnects by default
    };

    // Cleanup on unmount or when gameId changes
    return () => {
      console.log('[useGameStream] Disconnecting from SSE');
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [gameId, enabled]);

  return {
    gameState,
    isConnected,
    error,
  };
}
