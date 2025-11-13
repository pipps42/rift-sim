import { memo } from 'react';
import clsx from 'clsx';
import { CardImage } from './CardImage';

export interface MiniCardProps {
  /**
   * Card image URL
   */
  imageUrl: string;
  /**
   * Card name
   */
  name: string;
  /**
   * Card is revealed (vs card back)
   * @default true
   */
  isRevealed?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * MiniCard - Compact card version for chain stack, deck lists, etc.
 *
 * Simplified version of GameCard without:
 * - Modifications overlay
 * - Keyword badges
 * - Tooltip
 * - Hover magnification
 *
 * Fixed size: ~80x112px
 */
export const MiniCard = memo(function MiniCard({
  imageUrl,
  name,
  isRevealed = true,
  onClick,
  className,
}: MiniCardProps) {
  return (
    <div
      className={clsx(
        'inline-block',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      <CardImage
        imageUrl={imageUrl}
        cardName={name}
        isRevealed={isRevealed}
        size="mini"
      />
    </div>
  );
});
