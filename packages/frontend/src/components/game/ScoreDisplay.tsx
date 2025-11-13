import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';

export interface ScoreDisplayProps {
  /**
   * Player 1 name
   */
  player1Name: string;
  /**
   * Player 1 score
   */
  player1Score: number;
  /**
   * Player 2 name
   */
  player2Name: string;
  /**
   * Player 2 score
   */
  player2Score: number;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

/**
 * ScoreDisplay - Shows current score (victory points)
 *
 * Format: "Player1 3 - 5 Player2"
 * Goal: First to 8 wins
 */
export function ScoreDisplay({
  player1Name,
  player1Score,
  player2Name,
  player2Score,
  size = 'normal',
}: ScoreDisplayProps) {
  const isCompact = size === 'compact';

  return (
    <div className="flex flex-col items-center gap-1">
      <Text
        variant="caption"
        color="muted"
        size="xs"
      >
        Score (First to 8)
      </Text>
      <div className="flex items-center gap-3">
        {/* Player 1 */}
        <div className="flex flex-col items-end">
          <Text
            variant="caption"
            size="xs"
            color="muted"
          >
            {player1Name}
          </Text>
          <Heading
            level={3}
            size={isCompact ? 'sm' : 'md'}
            color={player1Score >= 8 ? 'primary' : 'default'}
          >
            {player1Score}
          </Heading>
        </div>

        {/* Separator */}
        <Text variant="display" size={isCompact ? 'base' : 'lg'} color="muted">
          -
        </Text>

        {/* Player 2 */}
        <div className="flex flex-col items-start">
          <Text
            variant="caption"
            size="xs"
            color="muted"
          >
            {player2Name}
          </Text>
          <Heading
            level={3}
            size={isCompact ? 'sm' : 'md'}
            color={player2Score >= 8 ? 'primary' : 'default'}
          >
            {player2Score}
          </Heading>
        </div>
      </div>
    </div>
  );
}
