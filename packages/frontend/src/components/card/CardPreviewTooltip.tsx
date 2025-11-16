import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { CardModification } from './CardTooltip';

export interface CardPreviewTooltipProps {
  /**
   * Card image URL
   */
  imageUrl: string;
  /**
   * Card name
   */
  cardName: string;
  /**
   * Whether card is exhausted
   */
  isExhausted?: boolean;
  /**
   * Tooltip visibility
   */
  visible: boolean;
  /**
   * Mouse position for smart positioning
   */
  mousePosition?: { x: number; y: number };
  /**
   * Card bounding rectangle for positioning
   */
  cardRect?: DOMRect;
  /**
   * List of modifications (optional, for future use)
   */
  modifications?: CardModification[];
}

/**
 * CardPreviewTooltip - Large preview tooltip showing card image
 *
 * Features:
 * - Shows card image at readable size (~400x560px)
 * - Smart positioning based on cursor location
 * - Will show modifications in the future
 */
export function CardPreviewTooltip({
  imageUrl,
  cardName,
  isExhausted = false,
  visible,
  mousePosition,
  cardRect,
  modifications = [],
}: CardPreviewTooltipProps) {
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-right');
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!visible || !mousePosition || !cardRect) return;

    // Determine which quadrant of the screen the cursor is in
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const isLeft = mousePosition.x < viewportWidth / 2;
    const isTop = mousePosition.y < viewportHeight / 2;

    let newPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    let style: React.CSSProperties = {};

    // Position tooltip so one corner touches one corner of the card
    if (isTop && isLeft) {
      // Card in top-left, tooltip goes bottom-right
      newPosition = 'bottom-right';
      style = {
        position: 'fixed',
        top: `${cardRect.bottom}px`,
        left: `${cardRect.right}px`,
      };
    } else if (isTop && !isLeft) {
      // Card in top-right, tooltip goes bottom-left
      newPosition = 'bottom-left';
      style = {
        position: 'fixed',
        top: `${cardRect.bottom}px`,
        right: `${viewportWidth - cardRect.left}px`,
      };
    } else if (!isTop && isLeft) {
      // Card in bottom-left, tooltip goes top-right
      newPosition = 'top-right';
      style = {
        position: 'fixed',
        bottom: `${viewportHeight - cardRect.top}px`,
        left: `${cardRect.right}px`,
      };
    } else {
      // Card in bottom-right, tooltip goes top-left
      newPosition = 'top-left';
      style = {
        position: 'fixed',
        bottom: `${viewportHeight - cardRect.top}px`,
        right: `${viewportWidth - cardRect.left}px`,
      };
    }

    setPosition(newPosition);
    setTooltipStyle(style);
  }, [visible, mousePosition, cardRect]);

  if (!visible) {
    return null;
  }

  const tooltipContent = (
    <div
      className={clsx(
        'z-[100]',
        'pointer-events-none' // Don't interfere with hover
      )}
      style={tooltipStyle}
    >
      <div className="bg-slate-900 border-2 border-slate-600 rounded-lg shadow-2xl overflow-hidden flex">
        {/* Card Preview Image */}
        <div className="relative flex-shrink-0" style={{ width: '360px', height: '504px' }}>
          <img
            src={imageUrl}
            alt={cardName}
            className={clsx(
              'w-full h-full object-contain',
              'card-shadow',
              isExhausted && [
                'rotate-90',
                'saturate-[0.3]',
                'opacity-80',
              ]
            )}
          />
        </div>

        {/* Modifications Section (to the right of image) */}
        {modifications.length > 0 && (
          <div className="p-3 bg-slate-800/90 border-l border-slate-600 flex flex-col min-w-[250px] max-w-[300px]">
            <h4 className="text-xs font-semibold text-slate-200 mb-2">
              Active Modifications:
            </h4>
            <ul className="space-y-2 overflow-y-auto">
              {modifications.map((mod, index) => (
                <li key={index} className="text-xs">
                  <div className="text-slate-100">{mod.description}</div>
                  <div className="text-slate-400 italic text-[10px]">
                    Source: {mod.source}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(tooltipContent, document.body);
}
