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

const sizeClasses = {
  mini: 'w-20 h-28',
  normal: 'w-48 h-[16.8rem]',
  large: 'w-64 h-[22.4rem]',
};

/**
 * CardBack - Static card back image
 * Used for decks, opponent hand, unrevealed cards
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
        'rounded-lg object-cover select-none',
        'card-shadow',
        sizeClasses[size],
        className
      )}
    />
  );
}
