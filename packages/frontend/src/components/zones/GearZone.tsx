import clsx from 'clsx';
import { GameCard } from '../card/GameCard';

export interface GearCard {
  instanceId: string;
  imageUrl: string;
  name: string;
  ready: boolean;
}

export interface GearZoneProps {
  /**
   * Gear cards in play
   */
  gears: GearCard[];
  /**
   * Click handler for gear
   */
  onGearClick?: (gearId: string) => void;
  /**
   * Size variant
   * @default 'mini'
   */
  size?: 'mini' | 'normal';
}

/**
 * GearZone - Displays gear (permanent non-unit/rune cards)
 *
 * Layout: Horizontal row, similar to PlayerBase
 * Shows ready/exhausted states
 */
export function GearZone({ gears, onGearClick, size = 'mini' }: GearZoneProps) {
  if (gears.length === 0) {
    return (
      <div className="text-xs text-slate-400 italic p-2 border border-dashed border-slate-600 rounded">
        No gear
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-slate-800/30 rounded border border-slate-700">
      {gears.map((gear) => (
        <GameCard
          key={gear.instanceId}
          imageUrl={gear.imageUrl}
          name={gear.name}
          isExhausted={!gear.ready}
          size={size}
          onClick={() => onGearClick?.(gear.instanceId)}
        />
      ))}
    </div>
  );
}
