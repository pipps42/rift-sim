import type { ImgHTMLAttributes } from 'react';
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

// Card sizes scale to fit container while maintaining aspect ratio
// Container must have defined dimensions
const sizeClasses = {
  mini: 'w-full h-full',
  normal: 'w-full h-full',
  large: 'w-full h-full',
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
        'rounded-lg object-contain select-none',
        'transition-all duration-300',
        // Size - fills container
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
