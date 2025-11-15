import clsx from 'clsx';
import { GameCard } from '../card/GameCard';
import type { UICard } from '@/types';

// Re-export UICard as BaseUnit for backwards compatibility
export type BaseUnit = UICard;

export interface PlayerBaseProps {
  /**
   * Units in base
   */
  units: BaseUnit[];
  /**
   * Click handler for unit
   */
  onUnitClick?: (unitId: string) => void;
  /**
   * Size variant
   * @default 'mini'
   */
  size?: 'mini' | 'normal';
  /**
   * Maximum units to display inline (before wrapping)
   * @default 8
   */
  maxInline?: number;
}

/**
 * PlayerBase - Displays units in player's base
 *
 * Layout:
 * - Horizontal row
 * - Wraps if >8 units
 * - Partial overlap if many units (space saving)
 * - Shows ready/exhausted states
 */
export function PlayerBase({
  units,
  onUnitClick,
  size = 'mini',
  maxInline = 8,
}: PlayerBaseProps) {
  if (units.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 italic border border-dashed border-slate-600 rounded">
        No units in base
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex gap-1 p-1 bg-slate-800/30 rounded border border-slate-700 overflow-x-auto overflow-y-hidden"
      style={{ minWidth: 0, minHeight: 0 }}
    >
      {units.map((unit) => (
        <div
          key={unit.instanceId}
          className="flex-shrink-0"
          style={{
            height: '100%',
            aspectRatio: '240/336',
          }}
        >
          <GameCard
            imageUrl={unit.imageUrl}
            name={unit.name}
            isExhausted={!unit.ready}
            originalMight={unit.originalMight}
            modifiedMight={unit.modifiedMight}
            size={size}
            onClick={() => unit.instanceId && onUnitClick?.(unit.instanceId)}
          />
        </div>
      ))}
    </div>
  );
}
