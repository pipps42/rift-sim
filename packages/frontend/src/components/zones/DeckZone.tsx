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
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
      {/* Label */}
      <div className="text-xs font-semibold text-slate-300 flex-shrink-0">{label}</div>

      {/* Deck */}
      <div
        className={clsx(
          'relative flex-1 flex items-center justify-center overflow-hidden',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity'
        )}
        style={{ aspectRatio: '240/336', minWidth: 0, minHeight: 0, width: 'auto', maxWidth: '100%' }}
        onClick={onClick}
      >
        <CardBack size={size} />

        {/* Count badge */}
        <div className="absolute top-1 right-1">
          <Badge variant="primary" size="sm">
            {count}
          </Badge>
        </div>
      </div>
    </div>
  );
}
