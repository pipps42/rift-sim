import clsx from 'clsx';
import { GameCard } from '../card/GameCard';

export interface BattlefieldUnit {
  instanceId: string;
  imageUrl: string;
  name: string;
  ready: boolean;
  originalMight?: number;
  modifiedMight?: number;
}

export interface BattlefieldUnitsProps {
  /**
   * Units on this side of battlefield
   */
  units: BattlefieldUnit[];
  /**
   * Which side (player or opponent)
   */
  side: 'player' | 'opponent';
  /**
   * Click handler for unit
   */
  onUnitClick?: (unitId: string) => void;
  /**
   * Size variant
   * @default 'mini'
   */
  size?: 'mini' | 'normal';
}

/**
 * BattlefieldUnits - Container for units on one side of battlefield
 *
 * Layout:
 * - Horizontal row
 * - Positioned above (opponent) or below (player) battlefield card
 * - Partial overlap if many units
 */
export function BattlefieldUnits({
  units,
  side,
  onUnitClick,
  size = 'mini',
}: BattlefieldUnitsProps) {
  if (units.length === 0) {
    return (
      <div
        className={clsx(
          'text-xs text-slate-400 italic p-2',
          'border border-dashed border-slate-600 rounded',
          'min-w-[200px] text-center'
        )}
      >
        No {side} units
      </div>
    );
  }

  const needsOverlap = units.length > 6;

  return (
    <div
      className={clsx(
        'flex justify-center',
        needsOverlap ? '-space-x-8' : 'gap-2'
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
