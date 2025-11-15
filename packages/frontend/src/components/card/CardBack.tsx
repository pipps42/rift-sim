import clsx from 'clsx';

export interface CardBackProps {
  /**
   * Card back image URL
   * @default '/assets/card-back.webp'
   */
  imageUrl?: string;
  /**
   * Size variant
   * @default 'normal'
   */
  size?: 'mini' | 'normal' | 'large';
  /**
   * Additional className
   */
  className?: string;
}

// Card sizes scale to fit container while maintaining aspect ratio
const sizeClasses = {
  mini: 'w-full h-full',
  normal: 'w-full h-full',
  large: 'w-full h-full',
};

/**
 * CardBack - Static card back image
 * Used for decks, opponent hand, unrevealed cards
 * Scales dynamically based on container size
 */
export function CardBack({
  imageUrl = '/assets/card-back.webp',
  size = 'normal',
  className,
}: CardBackProps) {
  return (
    <img
      src={imageUrl}
      alt="Card back"
      loading="lazy"
      className={clsx(
        'rounded-lg object-contain select-none',
        'card-shadow',
        sizeClasses[size],
        className
      )}
    />
  );
}
