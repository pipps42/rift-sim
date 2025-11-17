import { useState, useMemo } from 'react';
import { GameBoard } from '../components/composite/GameBoard';
import { useGameStream } from '../hooks/useGameStream';
import { gameApi } from '../services/api';
import { playerStorage } from '../utils/playerStorage';

interface GameViewProps {
  gameId: string;
  onLeave?: () => void;
}

/**
 * GameView - Real game board connected to backend
 * Uses SSE for real-time updates and provides action buttons
 */
export function GameView({ gameId, onLeave }: GameViewProps) {
  const { gameState, isConnected, error } = useGameStream(gameId);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Reorder players so current user is always "player" (index 0) and opponent is "opponent" (index 1)
  // IMPORTANT: This must be called before any early returns (Rules of Hooks)
  const { currentPlayer, opponentPlayer, currentPlayerIndex, opponentPlayerIndex } = useMemo(() => {
    // If gameState is not ready, return null values
    if (!gameState || !gameState.players || gameState.players.length < 2) {
      return {
        currentPlayer: null,
        opponentPlayer: null,
        currentPlayerIndex: 0,
        opponentPlayerIndex: 1,
      };
    }

    const myPlayerId = playerStorage.getPlayerId();

    // Find which player is the current user
    const player1 = gameState.players[0];
    const player2 = gameState.players[1];

    let currentIdx = 0;
    let opponentIdx = 1;
    let current = player1;
    let opponent = player2;

    // If we have a saved playerId and it matches player2, swap the perspective
    if (myPlayerId && player2 && player2.id === myPlayerId) {
      currentIdx = 1;
      opponentIdx = 0;
      current = player2;
      opponent = player1;
    }

    console.log('Player perspective:', {
      myPlayerId,
      currentPlayerName: current?.name,
      opponentPlayerName: opponent?.name,
      currentPlayerIndex: currentIdx,
    });

    return {
      currentPlayer: current,
      opponentPlayer: opponent,
      currentPlayerIndex: currentIdx,
      opponentPlayerIndex: opponentIdx,
    };
  }, [gameState]);

  // Handle play card action
  const handlePlayCard = async () => {
    if (!selectedCardId) {
      setActionError('No card selected');
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const response = await gameApi.playCard(gameId, selectedCardId);
      if (!response.success) {
        const errorMsg = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Failed to play card';
        setActionError(errorMsg);
      } else {
        setSelectedCardId(null); // Clear selection on success
      }
    } catch (err) {
      setActionError('Failed to play card');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle pass priority
  const handlePassPriority = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const response = await gameApi.passPriority(gameId);
      if (!response.success) {
        const errorMsg = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Failed to pass priority';
        setActionError(errorMsg);
      }
    } catch (err) {
      setActionError('Failed to pass priority');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-2xl mb-4">
            {isConnected ? 'Loading game state...' : 'Connecting to game...'}
          </div>
          {error && <div className="text-red-400">{error}</div>}
        </div>
      </div>
    );
  }

  // Waiting for players state
  if (gameState.status === 'waiting_for_players') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-2xl mb-4">Waiting for opponent to join...</div>
          <div className="text-slate-400 mb-6">Game ID: {gameId.slice(0, 8)}</div>
          <div className="animate-pulse text-6xl mb-6">⏳</div>
          <div className="text-sm text-slate-500">Share this link with your opponent</div>
          {onLeave && (
            <button
              onClick={onLeave}
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
            >
              Cancel & Leave
            </button>
          )}
        </div>
      </div>
    );
  }

  // Transform backend game state to GameBoard props format
  // This is a simplified mapper - you'll need to expand this based on your backend state structure
  const gameBoardData = {
    player: {
      player: {
        name: currentPlayer?.name || 'Player 1',
        score: currentPlayer?.score || 0,
        hasPriority: gameState.currentPlayerIndex === currentPlayerIndex,
      },
      handCards: (currentPlayer?.zones?.hand || []).map((card: any) => ({
        instanceId: card.instanceId,
        imageUrl: card.imageUrl || 'https://placehold.co/240x336',
        name: card.name,
        isPlayable: true, // You would check this against playable cards from backend
      })),
      mainDeckCount: currentPlayer?.zones?.mainDeck?.length || 0,
      runeDeckCount: currentPlayer?.zones?.runeDeck?.length || 0,
      runes: (currentPlayer?.zones?.runes || []).map((rune: any) => ({
        instanceId: rune.instanceId,
        imageUrl: rune.imageUrl || 'https://placehold.co/240x336',
        name: rune.name,
        domain: rune.domains?.[0] || 'UNIVERSAL',
        ready: rune.ready,
      })),
      runePool: {
        energy: currentPlayer?.runePool?.energy || 0,
        powerCosts: currentPlayer?.runePool?.power || [],
      },
      gears: [], // Gears are merged into base in PlayerZones
      trashCards: (currentPlayer?.zones?.trash || []).map((card: any) => ({
        instanceId: card.instanceId,
        imageUrl: card.imageUrl || 'https://placehold.co/240x336',
        name: card.name,
      })),
      baseUnits: (currentPlayer?.zones?.base || []).map((unit: any) => ({
        instanceId: unit.instanceId,
        imageUrl: unit.imageUrl || 'https://placehold.co/240x336',
        name: unit.name,
        damage: unit.damage || 0,
        ready: unit.ready,
      })),
      legend: {
        instanceId: currentPlayer?.championLegend?.id || 'legend-1',
        imageUrl: currentPlayer?.championLegend?.imageUrl || 'https://placehold.co/240x336',
        name: currentPlayer?.championLegend?.name || 'Legend',
      },
      chosenChampion: {
        instanceId: currentPlayer?.chosenChampion?.id || 'champion-1',
        imageUrl: currentPlayer?.chosenChampion?.imageUrl || 'https://placehold.co/240x336',
        name: currentPlayer?.chosenChampion?.name || 'Champion',
        inZone: true, // Check if champion is in zone or played
      },
    },
    opponent: {
      player: {
        name: opponentPlayer?.name || 'Opponent',
        score: opponentPlayer?.score || 0,
        hasPriority: gameState.currentPlayerIndex === opponentPlayerIndex,
      },
      handCards: (opponentPlayer?.zones?.hand || []).map((card: any, index: number) => ({
        instanceId: card.instanceId || `opp-${index}`,
        imageUrl: '', // Hidden for opponent
        name: '',
      })),
      mainDeckCount: opponentPlayer?.zones?.mainDeck?.length || 0,
      runeDeckCount: opponentPlayer?.zones?.runeDeck?.length || 0,
      runes: (opponentPlayer?.zones?.runes || []).map((rune: any) => ({
        instanceId: rune.instanceId,
        imageUrl: rune.imageUrl || 'https://placehold.co/240x336',
        name: rune.name,
        domain: rune.domains?.[0] || 'UNIVERSAL',
        ready: rune.ready,
      })),
      runePool: {
        energy: opponentPlayer?.runePool?.energy || 0,
        powerCosts: opponentPlayer?.runePool?.power || [],
      },
      gears: [],
      trashCards: (opponentPlayer?.zones?.trash || []).map((card: any) => ({
        instanceId: card.instanceId,
        imageUrl: card.imageUrl || 'https://placehold.co/240x336',
        name: card.name,
      })),
      baseUnits: (opponentPlayer?.zones?.base || []).map((unit: any) => ({
        instanceId: unit.instanceId,
        imageUrl: unit.imageUrl || 'https://placehold.co/240x336',
        name: unit.name,
        damage: unit.damage || 0,
        ready: unit.ready,
      })),
      legend: {
        instanceId: opponentPlayer?.championLegend?.id || 'legend-2',
        imageUrl: opponentPlayer?.championLegend?.imageUrl || 'https://placehold.co/240x336',
        name: opponentPlayer?.championLegend?.name || 'Legend',
      },
      chosenChampion: {
        instanceId: opponentPlayer?.chosenChampion?.id || 'champion-2',
        imageUrl: opponentPlayer?.chosenChampion?.imageUrl || 'https://placehold.co/240x336',
        name: opponentPlayer?.chosenChampion?.name || 'Champion',
        inZone: true,
      },
    },
    battlefieldCenter: {
      battlefields: (() => {
        const bfs = (gameState.battlefields || []).map((bf: any) => ({
          id: bf.id,
          imageUrl: bf.card?.imageUrl || 'https://placehold.co/384x224',
          name: bf.card?.name || 'Battlefield',
          isContested: bf.contested,
          playerUnits: (bf.sides?.[currentPlayer?.id] || []).map((unit: any) => ({
            instanceId: unit.instanceId,
            imageUrl: unit.imageUrl || 'https://placehold.co/240x336',
            name: unit.name,
            damage: unit.damage || 0,
            ready: unit.ready,
            originalMight: unit.might,
          })),
          opponentUnits: (bf.sides?.[opponentPlayer?.id] || []).map((unit: any) => ({
            instanceId: unit.instanceId,
            imageUrl: unit.imageUrl || 'https://placehold.co/240x336',
            name: unit.name,
            damage: unit.damage || 0,
            ready: unit.ready,
            originalMight: unit.might,
          })),
        }));

        // Ensure exactly 2 battlefields (fill with placeholders if needed)
        while (bfs.length < 2) {
          bfs.push({
            id: `placeholder-${bfs.length}`,
            imageUrl: 'https://placehold.co/384x224',
            name: 'Battlefield',
            isContested: false,
            playerUnits: [],
            opponentUnits: [],
          });
        }

        return bfs.slice(0, 2) as [any, any];
      })(),
      gameInfo: {
        player1: {
          name: gameState.players[0]?.name || 'Player 1',
          score: gameState.players[0]?.score || 0,
        },
        player2: {
          name: gameState.players[1]?.name || 'Player 2',
          score: gameState.players[1]?.score || 0,
        },
        currentPhase: gameState.phase?.toUpperCase() || 'ACTION',
        turnNumber: gameState.currentTurn || 1,
        roundNumber: gameState.round || 1,
        priorityPlayer: gameState.players[gameState.currentPlayerIndex]?.name || 'Unknown',
      },
      chainItems: (gameState.chain || []).map((item: any) => ({
        id: item.id,
        cardImageUrl: 'https://placehold.co/80x112',
        cardName: item.sourceCard?.name || 'Unknown',
        type: item.type,
        controller: item.controllerId,
      })),
    },
  };

  return (
    <div className="relative">
      {/* Connection status */}
      {!isConnected && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-600 text-white px-4 py-2 rounded-lg">
          Reconnecting...
        </div>
      )}

      {/* Error banner */}
      {(error || actionError) && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg max-w-md">
          {error || actionError}
        </div>
      )}

      {/* Action panel */}
      <div className="fixed top-2 right-2 z-50 bg-slate-800 border border-slate-700 rounded-lg p-3 space-y-2">
        <div className="text-xs text-slate-400 mb-2">Actions</div>

        <button
          onClick={handlePlayCard}
          disabled={!selectedCardId || actionLoading}
          className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-colors"
        >
          Play Card
        </button>

        <button
          onClick={handlePassPriority}
          disabled={actionLoading}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-colors"
        >
          Pass Priority
        </button>

        {onLeave && (
          <button
            onClick={onLeave}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition-colors"
          >
            Leave Game
          </button>
        )}

        {selectedCardId && (
          <div className="text-xs text-green-400 pt-2 border-t border-slate-700">
            Card selected: {selectedCardId.slice(0, 8)}
          </div>
        )}
      </div>

      {/* Game board */}
      <GameBoard
        {...gameBoardData}
        onCardClick={(cardId) => {
          console.log('Card clicked:', cardId);
          setSelectedCardId(cardId);
        }}
      />
    </div>
  );
}
