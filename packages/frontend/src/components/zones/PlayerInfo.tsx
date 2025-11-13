import { User } from 'lucide-react';
import { Flex } from '../primitives/Flex';
import { Text } from '../primitives/Text';
import { Badge } from '../primitives/Badge';

export interface PlayerInfoProps {
  /**
   * Player name
   */
  name: string;
  /**
   * Player score (victory points)
   */
  score: number;
  /**
   * Avatar URL (optional)
   */
  avatarUrl?: string;
  /**
   * Whether this player has priority
   * @default false
   */
  hasPriority?: boolean;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'compact' | 'normal';
}

/**
 * PlayerInfo - Displays player information
 *
 * Shows:
 * - Avatar (or default icon)
 * - Player name
 * - Score (victory points)
 * - Priority indicator (if active)
 */
export function PlayerInfo({
  name,
  score,
  avatarUrl,
  hasPriority = false,
  size = 'normal',
}: PlayerInfoProps) {
  const isCompact = size === 'compact';

  return (
    <Flex
      gap={isCompact ? 2 : 3}
      align="center"
      className="bg-slate-800 rounded-lg px-3 py-2 border border-slate-700"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className={`rounded-full ${isCompact ? 'w-8 h-8' : 'w-12 h-12'}`}
          />
        ) : (
          <div
            className={`bg-slate-700 rounded-full flex items-center justify-center ${
              isCompact ? 'w-8 h-8' : 'w-12 h-12'
            }`}
          >
            <User className={`text-slate-400 ${isCompact ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </div>
        )}
      </div>

      {/* Name & Score */}
      <Flex direction="col" gap={1} className="flex-1">
        <Flex gap={2} align="center">
          <Text
            variant={isCompact ? 'label' : 'display'}
            size={isCompact ? 'sm' : 'base'}
            weight="semibold"
          >
            {name}
          </Text>
          {hasPriority && (
            <Badge variant="primary" size="sm">
              Priority
            </Badge>
          )}
        </Flex>
        <Text variant="caption" color="muted" size="xs">
          Score: {score}
        </Text>
      </Flex>
    </Flex>
  );
}
