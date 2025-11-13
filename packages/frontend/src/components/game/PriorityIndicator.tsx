import { Badge } from '../primitives/Badge';
import { Text } from '../primitives/Text';

export interface PriorityIndicatorProps {
  /**
   * Player name who has priority
   */
  playerName: string;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

/**
 * PriorityIndicator - Shows which player has priority
 */
export function PriorityIndicator({
  playerName,
  size = 'normal',
}: PriorityIndicatorProps) {
  const isCompact = size === 'compact';

  return (
    <div className="flex items-center gap-2">
      <Text
        variant={isCompact ? 'caption' : 'label'}
        color="muted"
        size={isCompact ? 'xs' : 'sm'}
      >
        Priority:
      </Text>
      <Badge variant="success" size={isCompact ? 'sm' : 'md'}>
        {playerName}
      </Badge>
    </div>
  );
}
