import clsx from 'clsx';

export interface BattlefieldCardProps {
  /**
   * Battlefield card image URL
   */
  imageUrl: string;
  /**
   * Battlefield name
   */
  name: string;
  /**
   * Whether battlefield is contested
   * @default false
   */
  isContested?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * BattlefieldCard - Displays battlefield card in horizontal orientation
 *
 * Features:
 * - Always horizontal (landscape)
 * - Larger than normal cards
 * - Contested state (pulsing border)
 */
export function BattlefieldCard({
  imageUrl,
  name,
  isContested = false,
  className,
}: BattlefieldCardProps) {
  return (
    <div className={clsx('relative', className)}>
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        className={clsx(
          // Base styles
          'rounded-lg object-contain select-none',
          'card-shadow',
          // Dynamic size - scales to container
          'w-full h-full',
          // Contested state
          isContested && [
            'ring-2 ring-yellow-400',
            'shadow-xl shadow-yellow-400/50',
            'animate-pulse',
          ]
        )}
      />

      {/* Contested indicator */}
      {isContested && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            CONTESTED
          </div>
        </div>
      )}
    </div>
  );
}
