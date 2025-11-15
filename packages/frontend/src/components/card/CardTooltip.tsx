import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface CardModification {
  /**
   * Type of modification
   */
  type: 'cost' | 'might' | 'keyword' | 'other';
  /**
   * Description of modification
   * e.g., "Cost -1E this turn", "+2 Might", "Keyword: SHIELD"
   */
  description: string;
  /**
   * Source of modification (card name or effect)
   */
  source: string;
}

export interface CardTooltipProps {
  /**
   * List of modifications
   */
  modifications: CardModification[];
  /**
   * Tooltip visibility
   */
  visible: boolean;
  /**
   * Additional content to show in tooltip
   */
  children?: ReactNode;
}

/**
 * CardTooltip - Detailed tooltip showing card modifications
 *
 * Displays:
 * - List of active modifications
 * - Source of each modification
 * - Any additional custom content
 *
 * Triggered by hovering over card
 */
export function CardTooltip({
  modifications,
  visible,
  children,
}: CardTooltipProps) {
  if (!visible || (modifications.length === 0 && !children)) {
    return null;
  }

  return (
    <div
      className={clsx(
        'absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2',
        'bg-slate-800 border border-slate-600 rounded-lg shadow-2xl',
        'p-4 min-w-[250px] max-w-[350px]',
        'pointer-events-none' // Don't interfere with hover
      )}
    >
      {modifications.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-slate-200 mb-2">
            Active Modifications:
          </h4>
          <ul className="space-y-2">
            {modifications.map((mod, index) => (
              <li key={index} className="text-xs">
                <div className="text-slate-100">{mod.description}</div>
                <div className="text-slate-400 italic">Source: {mod.source}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {children && (
        <div className="mt-3 pt-3 border-t border-slate-600 text-sm text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}
