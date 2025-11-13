import clsx from 'clsx';
import { CardImage } from '../card/CardImage';
import { Badge } from '../primitives/Badge';

export interface TrashCard {
  imageUrl: string;
  name: string;
}

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
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <div className="text-xs font-semibold text-slate-300">Trash</div>

      {/* Trash */}
      <div
        className={clsx(
          'relative',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity'
        )}
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
              <div className="absolute -top-2 -right-2">
                <Badge variant="danger" size={size === 'mini' ? 'sm' : 'md'}>
                  {count}
                </Badge>
              </div>
            )}
          </>
        ) : (
          // Empty trash
          <div
            className={clsx(
              'border-2 border-dashed border-slate-600 rounded-lg',
              'flex items-center justify-center',
              'bg-slate-800/30',
              size === 'mini' ? 'w-20 h-28' : 'w-48 h-[16.8rem]'
            )}
          >
            <span className="text-xs text-slate-500">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}
