import { Stack } from '../primitives/Stack';
import { ScoreDisplay } from './ScoreDisplay';
import { PhaseIndicator, GamePhase } from './PhaseIndicator';
import { TurnIndicator } from './TurnIndicator';
import { RoundCounter } from './RoundCounter';
import { PriorityIndicator } from './PriorityIndicator';

export interface GameInfoPanelProps {
  /**
   * Player 1 info
   */
  player1: {
    name: string;
    score: number;
  };
  /**
   * Player 2 info
   */
  player2: {
    name: string;
    score: number;
  };
  /**
   * Current game phase
   */
  currentPhase: GamePhase;
  /**
   * Current turn number
   */
  turnNumber: number;
  /**
   * Current round number
   */
  roundNumber: number;
  /**
   * Player name with priority
   */
  priorityPlayer: string;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

/**
 * GameInfoPanel - Compact panel with all game state info
 *
 * Contains:
 * - Score (Player 1 vs Player 2)
 * - Phase indicator
 * - Turn number
 * - Round number
 * - Priority indicator
 *
 * Positioned in center-left or center-right of screen
 */
export function GameInfoPanel({
  player1,
  player2,
  currentPhase,
  turnNumber,
  roundNumber,
  priorityPlayer,
  size = 'normal',
}: GameInfoPanelProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg min-w-[200px]">
      <Stack spacing={4}>
        {/* Score (top) */}
        <ScoreDisplay
          player1Name={player1.name}
          player1Score={player1.score}
          player2Name={player2.name}
          player2Score={player2.score}
          size={size}
        />

        {/* Divider */}
        <div className="border-t border-slate-600" />

        {/* Game state indicators */}
        <Stack spacing={2}>
          <PhaseIndicator currentPhase={currentPhase} size={size} />
          <TurnIndicator turnNumber={turnNumber} size={size} />
          <RoundCounter roundNumber={roundNumber} size={size} />
          <PriorityIndicator playerName={priorityPlayer} size={size} />
        </Stack>
      </Stack>
    </div>
  );
}
