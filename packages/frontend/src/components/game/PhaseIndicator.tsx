import { Badge } from '../primitives/Badge';
import { Text } from '../primitives/Text';

export type GamePhase =
  | 'AWAKEN'
  | 'BEGINNING'
  | 'CHANNEL'
  | 'DRAW'
  | 'ACTION'
  | 'ENDING'
  | 'EXPIRATION'
  | 'CLEANUP';

export interface PhaseIndicatorProps {
  /**
   * Current game phase
   */
  currentPhase: GamePhase;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

const phaseLabels: Record<GamePhase, string> = {
  AWAKEN: 'Awaken',
  BEGINNING: 'Beginning',
  CHANNEL: 'Channel',
  DRAW: 'Draw',
  ACTION: 'Action',
  ENDING: 'Ending',
  EXPIRATION: 'Expiration',
  CLEANUP: 'Cleanup',
};

/**
 * PhaseIndicator - Displays current game phase
 *
 * Shows:
 * - Phase name with badge
 * - 8 possible phases
 */
export function PhaseIndicator({
  currentPhase,
  size = 'normal',
}: PhaseIndicatorProps) {
  const isCompact = size === 'compact';

  return (
    <div className="flex items-center gap-2">
      <Text
        variant={isCompact ? 'caption' : 'label'}
        color="muted"
        size={isCompact ? 'xs' : 'sm'}
      >
        Phase:
      </Text>
      <Badge variant="primary" size={isCompact ? 'sm' : 'md'}>
        {phaseLabels[currentPhase]}
      </Badge>
    </div>
  );
}
