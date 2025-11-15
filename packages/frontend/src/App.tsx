import { useState } from 'react'
import './App.css'
import { createGame, listGames, ApiError } from './api'
import type { Game } from './api/types'
import { GameBoardExample } from './examples/GameBoardExample'

type View = 'api-test' | 'game-board';

function App() {
  const [currentView, setCurrentView] = useState<View>('game-board');
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdGameId, setCreatedGameId] = useState<string | null>(null)

  // Test API: List all games
  const handleListGames = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await listGames()
      setGames(response.games)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message} (Status: ${err.status})`)
      } else {
        setError('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // Test API: Create a new game
  const handleCreateGame = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await createGame() // Creates game with AI opponent
      setCreatedGameId(response.game.id)
      setGames([response.game])
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message} (Status: ${err.status})`)
      } else {
        setError('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // If game-board view, render fullscreen without header
  if (currentView === 'game-board') {
    return (
      <GameBoardExample
        showBackButton={true}
        onBack={() => setCurrentView('api-test')}
      />
    );
  }

  return (
    <div className="app">
      <h1>Riftbound TCG</h1>
      <p>Card game simulator - Frontend</p>

      {/* View Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentView('game-board')}
          style={{
            fontWeight: currentView === 'game-board' ? 'bold' : 'normal',
            backgroundColor: currentView === 'game-board' ? '#646cff' : '#1a1a1a',
          }}
        >
          Game Board
        </button>
        <button
          onClick={() => setCurrentView('api-test')}
          style={{
            fontWeight: currentView === 'api-test' ? 'bold' : 'normal',
            backgroundColor: currentView === 'api-test' ? '#646cff' : '#1a1a1a',
          }}
        >
          API Test
        </button>
      </div>

      {/* API Test View */}
      {currentView === 'api-test' && (
        <div className="card">
          <h2>API Test</h2>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={handleListGames} disabled={loading}>
              {loading ? 'Loading...' : 'List Games'}
            </button>
            <button onClick={handleCreateGame} disabled={loading}>
              {loading ? 'Loading...' : 'Create Game'}
            </button>
          </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            Error: {error}
          </div>
        )}

        {createdGameId && (
          <div style={{ color: 'green', marginBottom: '10px' }}>
            Game created! ID: {createdGameId}
          </div>
        )}

        {games.length > 0 && (
          <div>
            <h3>Games ({games.length})</h3>
            <ul style={{ textAlign: 'left' }}>
              {games.map((game) => (
                <li key={game.id}>
                  <strong>ID:</strong> {game.id} |
                  <strong> Status:</strong> {game.status} |
                  <strong> Players:</strong> {game.players.length}/2
                </li>
              ))}
            </ul>
          </div>
        )}

        <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#888' }}>
          Make sure the backend is running on http://localhost:3000
        </p>
      </div>
      )}
    </div>
  )
}

export default App
