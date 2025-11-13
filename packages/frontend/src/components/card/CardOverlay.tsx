import clsx from 'clsx';

export interface CardOverlayProps {
  /**
   * Original cost (energy)
   */
  originalCost?: number;
  /**
   * Modified cost (if different from original)
   */
  modifiedCost?: number;
  /**
   * Original might (for units)
   */
  originalMight?: number;
  /**
   * Modified might (if different from original)
   */
  modifiedMight?: number;
  /**
   * Card size (must match parent CardImage size)
   * @default 'normal'
   */
  size?: 'mini' | 'normal' | 'large';
}

const sizePadding = {
  mini: 'p-1',
  normal: 'p-2',
  large: 'p-3',
};

const sizeText = {
  mini: 'text-xs',
  normal: 'text-base',
  large: 'text-lg',
};

/**
 * CardOverlay - Renders cost/might modifications overlaid on card image
 *
 * Position:
 * - Cost: Top-left corner
 * - Might: Top-right corner
 *
 * Style:
 * - Green badge for reduced cost / increased might
 * - Red badge for increased cost / reduced might
 */
export function CardOverlay({
  originalCost,
  modifiedCost,
  originalMight,
  modifiedMight,
  size = 'normal',
}: CardOverlayProps) {
  const hasCostModification = modifiedCost !== undefined && modifiedCost !== originalCost;
  const hasMightModification =
    modifiedMight !== undefined && modifiedMight !== originalMight;

  // Don't render if no modifications
  if (!hasCostModification && !hasMightModification) {
    return null;
  }

  // Determine color based on whether it's a buff or nerf
  const getCostColor = () => {
    if (!hasCostModification || originalCost === undefined || modifiedCost === undefined)
      return '';
    return modifiedCost < originalCost ? 'bg-green-600' : 'bg-red-600';
  };

  const getMightColor = () => {
    if (!hasMightModification || originalMight === undefined || modifiedMight === undefined)
      return '';
    return modifiedMight > originalMight ? 'bg-green-600' : 'bg-red-600';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Cost overlay (top-left) */}
      {hasCostModification && modifiedCost !== undefined && (
        <div className={clsx('absolute top-0 left-0', sizePadding[size])}>
          <div
            className={clsx(
              'rounded-full px-2 py-1 font-bold text-white shadow-lg',
              sizeText[size],
              getCostColor()
            )}
          >
            {modifiedCost}
          </div>
        </div>
      )}

      {/* Might overlay (top-right) */}
      {hasMightModification && modifiedMight !== undefined && (
        <div className={clsx('absolute top-0 right-0', sizePadding[size])}>
          <div
            className={clsx(
              'rounded-full px-2 py-1 font-bold text-white shadow-lg',
              sizeText[size],
              getMightColor()
            )}
          >
            {modifiedMight}
          </div>
        </div>
      )}
    </div>
  );
}
