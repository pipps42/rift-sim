import clsx from 'clsx';
import { GameCard } from '../card/GameCard';

export interface BaseUnit {
  instanceId: string;
  imageUrl: string;
  name: string;
  ready: boolean;
  originalMight?: number;
  modifiedMight?: number;
}

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
      <div className="text-xs text-slate-400 italic p-3 border border-dashed border-slate-600 rounded">
        No units in base
      </div>
    );
  }

  const needsOverlap = units.length > maxInline;

  return (
    <div
      className={clsx(
        'flex flex-wrap gap-2 p-2',
        'bg-slate-800/30 rounded border border-slate-700',
        // Overlap if many units
        needsOverlap && '-space-x-8'
      )}
    >
      {units.map((unit, index) => (
        <div
          key={unit.instanceId}
          className={clsx(
            'transition-all duration-200',
            needsOverlap && 'hover:z-10'
          )}
          style={needsOverlap ? { zIndex: index } : undefined}
        >
          <GameCard
            imageUrl={unit.imageUrl}
            name={unit.name}
            isExhausted={!unit.ready}
            originalMight={unit.originalMight}
            modifiedMight={unit.modifiedMight}
            size={size}
            onClick={() => onUnitClick?.(unit.instanceId)}
          />
        </div>
      ))}
    </div>
  );
}
