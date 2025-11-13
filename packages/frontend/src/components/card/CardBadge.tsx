import clsx from 'clsx';
import { Badge } from '../primitives/Badge';

export interface CardBadgeProps {
  /**
   * Keywords to display as badges
   */
  keywords: string[];
  /**
   * Badge position relative to card
   * @default 'right'
   */
  position?: 'left' | 'right';
  /**
   * Card size (for spacing)
   * @default 'normal'
   */
  size?: 'mini' | 'normal' | 'large';
}

const positionClasses = {
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

/**
 * CardBadge - Displays keyword badges alongside card
 *
 * Used for keywords added/removed by effects
 * Positioned to the right (or left) of the card
 */
export function CardBadge({
  keywords,
  position = 'right',
  size = 'normal',
}: CardBadgeProps) {
  if (keywords.length === 0) {
    return null;
  }

  const badgeSize = size === 'mini' ? 'sm' : 'md';

  return (
    <div
      className={clsx(
        'absolute top-0 flex flex-col gap-1',
        positionClasses[position]
      )}
    >
      {keywords.map((keyword, index) => (
        <Badge key={`${keyword}-${index}`} variant="primary" size={badgeSize}>
          {keyword}
        </Badge>
      ))}
    </div>
  );
}
