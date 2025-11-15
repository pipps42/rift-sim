import clsx from 'clsx';
import { CardImage } from '../card/CardImage';
import { Badge } from '../primitives/Badge';
import type { UICard } from '@/types';

// Re-export UICard as TrashCard for backwards compatibility
export type TrashCard = UICard;

export interface TrashZoneProps {
  /**
   * Cards in trash (only last card is shown)
   */
  cards: TrashCard[];
  /**
   * Click handler to open trash viewer
   */
  onClick?: () => void;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'mini' | 'normal';
}

/**
 * TrashZone - Displays trash with last card + counter
 *
 * Features:
 * - Shows last card added to trash
 * - Count badge (top-right)
 * - Clickable to open trash viewer modal
 * - Empty state if no cards
 */
export function TrashZone({ cards, onClick, size = 'normal' }: TrashZoneProps) {
  const count = cards.length;
  const lastCard = count > 0 ? cards[count - 1] : null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
      {/* Label */}
      <div className="text-xs font-semibold text-slate-300 flex-shrink-0">Trash</div>

      {/* Trash */}
      <div
        className={clsx(
          'relative flex-1 flex items-center justify-center overflow-hidden',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity'
        )}
        style={{ aspectRatio: '240/336', minWidth: 0, minHeight: 0, width: 'auto', maxWidth: '100%' }}
        onClick={onClick}
      >
        {lastCard ? (
          <>
            <CardImage
              imageUrl={lastCard.imageUrl}
              cardName={lastCard.name}
              size={size}
            />
            {/* Count badge */}
            {count > 1 && (
              <div className="absolute top-1 right-1">
                <Badge variant="danger" size="sm">
                  {count}
                </Badge>
              </div>
            )}
          </>
        ) : (
          // Empty trash
          <div
            className="w-full h-full border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center bg-slate-800/30"
          >
            <span className="text-xs text-slate-500">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}
