import { Text } from '../primitives/Text';

export interface TurnIndicatorProps {
  /**
   * Current turn number
   */
  turnNumber: number;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

/**
 * TurnIndicator - Displays current turn number
 */
export function TurnIndicator({
  turnNumber,
  size = 'normal',
}: TurnIndicatorProps) {
  const isCompact = size === 'compact';

  return (
    <div className="flex items-center gap-2">
      <Text
        variant={isCompact ? 'caption' : 'label'}
        color="muted"
        size={isCompact ? 'xs' : 'sm'}
      >
        Turn:
      </Text>
      <Text
        variant={isCompact ? 'body' : 'display'}
        size={isCompact ? 'sm' : 'base'}
        weight="bold"
      >
        {turnNumber}
      </Text>
    </div>
  );
}
