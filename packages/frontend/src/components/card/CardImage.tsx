import { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CardImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /**
   * Card image URL (WebP format recommended)
   */
  imageUrl: string;
  /**
   * Card name (for alt text)
   */
  cardName: string;
  /**
   * Whether card is exhausted (tapped)
   * Applies desaturation + 90° rotation
   * @default false
   */
  isExhausted?: boolean;
  /**
   * Whether card is revealed (vs card back)
   * @default true
   */
  isRevealed?: boolean;
  /**
   * Card back image URL (if not revealed)
   */
  cardBackUrl?: string;
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
  mini: 'w-20 h-28', // ~80x112px (aspect 5:7)
  normal: 'w-48 h-[16.8rem]', // ~192x269px (aspect 5:7)
  large: 'w-64 h-[22.4rem]', // ~256x358px (aspect 5:7)
};

/**
 * CardImage - Renders card image with WebP format, states, and lazy loading
 *
 * Visual states:
 * - Ready: Full color, vertical orientation
 * - Exhausted: Desaturated (grayscale), rotated 90°
 */
export function CardImage({
  imageUrl,
  cardName,
  isExhausted = false,
  isRevealed = true,
  cardBackUrl = '/assets/card-back.webp', // Default card back
  size = 'normal',
  className,
  ...props
}: CardImageProps) {
  const imageSrc = isRevealed ? imageUrl : cardBackUrl;

  return (
    <img
      src={imageSrc}
      alt={isRevealed ? cardName : 'Card back'}
      loading="lazy"
      className={clsx(
        // Base styles
        'rounded-lg object-cover select-none',
        'transition-all duration-300',
        // Size
        sizeClasses[size],
        // Exhausted state
        isExhausted && [
          'rotate-90', // Tilt horizontal
          'saturate-[0.3]', // Desaturate to ~30%
          'opacity-80',
        ],
        // Card shadow
        'card-shadow',
        className
      )}
      {...props}
    />
  );
}
