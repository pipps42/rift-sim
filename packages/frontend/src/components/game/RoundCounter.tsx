import { Text } from '../primitives/Text';

export interface RoundCounterProps {
  /**
   * Current round number
   */
  roundNumber: number;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

/**
 * RoundCounter - Displays current round number
 */
export function RoundCounter({
  roundNumber,
  size = 'normal',
}: RoundCounterProps) {
  const isCompact = size === 'compact';

  return (
    <div className="flex items-center gap-2">
      <Text
        variant={isCompact ? 'caption' : 'label'}
        color="muted"
        size={isCompact ? 'xs' : 'sm'}
      >
        Round:
      </Text>
      <Text
        variant={isCompact ? 'body' : 'display'}
        size={isCompact ? 'sm' : 'base'}
        weight="bold"
      >
        {roundNumber}
      </Text>
    </div>
  );
}
