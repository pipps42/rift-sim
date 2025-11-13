# API Client

API client module for communicating with the Riftbound backend.

## Structure

```
api/
├── client.ts     # Base HTTP client (fetch wrapper)
├── games.ts      # Game-related API methods
├── types.ts      # TypeScript type definitions
└── index.ts      # Module exports
```

## Usage

### Import

```typescript
import { createGame, listGames, ApiError } from '@/api';
```

### Create a Game

```typescript
try {
  const response = await createGame('Player Name');
  console.log('Game created:', response.game.id);
  console.log('Player ID:', response.playerId);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message} (${error.status})`);
  }
}
```

### List Games

```typescript
const response = await listGames();
console.log('Active games:', response.games);
```

### Join a Game

```typescript
const response = await joinGame(gameId, 'Player 2');
console.log('Joined game:', response.game.id);
```

### Get Game State

```typescript
const response = await getGame(gameId);
console.log('Current game state:', response.game);
```

## Error Handling

The API client throws `ApiError` instances on failure:

```typescript
try {
  await createGame('Player');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Status: ${error.status}`);
    console.error(`Message: ${error.message}`);
    console.error(`Code: ${error.code}`);
  }
}
```

## Configuration

Set the backend URL via environment variable:

```env
VITE_API_URL=http://localhost:3000/api
```

In development, the Vite proxy automatically forwards `/api` requests to `http://localhost:3000`.

## Type Safety

All API methods are fully typed with TypeScript:

- Request types: `CreateGameRequest`, `JoinGameRequest`, etc.
- Response types: `CreateGameResponse`, `GameStateResponse`, etc.
- Domain types: `Game`, `Player`, `GameCard`, etc.
