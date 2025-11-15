import { useState, memo } from 'react';
import clsx from 'clsx';
import { CardImage } from './CardImage';
import { CardOverlay } from './CardOverlay';
import { CardBadge } from './CardBadge';
import { CardTooltip } from './CardTooltip';
import type { CardModification } from './CardTooltip';

export interface GameCardProps {
  /**
   * Card image URL
   */
  imageUrl: string;
  /**
   * Card name
   */
  name: string;
  /**
   * Card is exhausted (tapped)
   * @default false
   */
  isExhausted?: boolean;
  /**
   * Card is revealed (vs card back)
   * @default true
   */
  isRevealed?: boolean;
  /**
   * Original energy cost
   */
  originalCost?: number;
  /**
   * Modified cost (if different)
   */
  modifiedCost?: number;
  /**
   * Original might (for units)
   */
  originalMight?: number;
  /**
   * Modified might (if different)
   */
  modifiedMight?: number;
  /**
   * Added keywords
   */
  addedKeywords?: string[];
  /**
   * List of active modifications (for tooltip)
   */
  modifications?: CardModification[];
  /**
   * Card is playable (shows green glow)
   * @default false
   */
  isPlayable?: boolean;
  /**
   * Card is targeted (shows blue glow)
   * @default false
   */
  isTargeted?: boolean;
  /**
   * Card is selected (shows yellow border)
   * @default false
   */
  isSelected?: boolean;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'mini' | 'normal' | 'large';
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
 * GameCard - Complete card component with all visual states
 *
 * Features:
 * - Image rendering (with exhausted state)
 * - Cost/might overlay for modifications
 * - Keyword badges
 * - Hover magnification
 * - Detailed tooltip on hover
 * - Visual states: playable, targeted, selected
 *
 * Performance: Memoized to prevent unnecessary re-renders
 */
export const GameCard = memo(function GameCard({
  imageUrl,
  name,
  isExhausted = false,
  isRevealed = true,
  originalCost,
  modifiedCost,
  originalMight,
  modifiedMight,
  addedKeywords = [],
  modifications = [],
  isPlayable = false,
  isTargeted = false,
  isSelected = false,
  size = 'normal',
  onClick,
  className,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const hasModifications =
    modifications.length > 0 ||
    (modifiedCost !== undefined && modifiedCost !== originalCost) ||
    (modifiedMight !== undefined && modifiedMight !== originalMight);

  return (
    <div
      className={clsx(
        'relative w-full h-full',
        'transition-all duration-200',
        // Hover: magnify
        isHovered && !isExhausted && 'scale-110 z-20',
        // Clickable cursor
        onClick && 'cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Main card container with visual states */}
      <div
        className={clsx(
          'relative',
          // Glow states
          isPlayable && 'ring-2 ring-green-500 shadow-lg shadow-green-500/50',
          isTargeted && 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/50',
          isSelected && 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50',
          // Hover shadow enhancement
          isHovered && !isExhausted && 'card-shadow-hover'
        )}
      >
        {/* Card image */}
        <CardImage
          imageUrl={imageUrl}
          cardName={name}
          isExhausted={isExhausted}
          isRevealed={isRevealed}
          size={size}
        />

        {/* Overlay for cost/might modifications */}
        {isRevealed && (
          <CardOverlay
            originalCost={originalCost}
            modifiedCost={modifiedCost}
            originalMight={originalMight}
            modifiedMight={modifiedMight}
            size={size}
          />
        )}

        {/* Keyword badges (to the right of card) */}
        {isRevealed && addedKeywords.length > 0 && (
          <CardBadge keywords={addedKeywords} size={size} />
        )}
      </div>

      {/* Tooltip (shown on hover if modifications exist) */}
      {isRevealed && hasModifications && (
        <CardTooltip modifications={modifications} visible={isHovered} />
      )}
    </div>
  );
});
