import clsx from 'clsx';
import { CardBack } from '../card/CardBack';
import { Badge } from '../primitives/Badge';

export interface DeckZoneProps {
  /**
   * Number of cards in deck
   */
  count: number;
  /**
   * Deck type (for label)
   */
  type: 'main' | 'rune';
  /**
   * Click handler to open deck viewer
   */
  onClick?: () => void;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'mini' | 'normal';
}

/**
 * DeckZone - Displays deck with card back + counter
 *
 * Features:
 * - Card back image
 * - Count badge (top-right)
 * - Clickable to open deck viewer modal
 */
export function DeckZone({
  count,
  type,
  onClick,
  size = 'normal',
}: DeckZoneProps) {
  const label = type === 'main' ? 'Main Deck' : 'Rune Deck';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <div className="text-xs font-semibold text-slate-300">{label}</div>

      {/* Deck */}
      <div
        className={clsx(
          'relative',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity'
        )}
        onClick={onClick}
      >
        <CardBack size={size} />

        {/* Count badge */}
        <div className="absolute -top-2 -right-2">
          <Badge variant="primary" size={size === 'mini' ? 'sm' : 'md'}>
            {count}
          </Badge>
        </div>
      </div>
    </div>
  );
}
