import { Stack } from '../primitives/Stack';
import { BattlefieldCard } from './BattlefieldCard';
import { BattlefieldUnits } from './BattlefieldUnits';
import type { BattlefieldUnit } from './BattlefieldUnits';

export interface BattlefieldZoneProps {
  /**
   * Battlefield card info
   */
  battlefield: {
    imageUrl: string;
    name: string;
    isContested: boolean;
  };
  /**
   * Player's units on this battlefield
   */
  playerUnits: BattlefieldUnit[];
  /**
   * Opponent's units on this battlefield
   */
  opponentUnits: BattlefieldUnit[];
  /**
   * Click handler for units
   */
  onUnitClick?: (unitId: string) => void;
  /**
   * Unit size
   * @default 'mini'
   */
  unitSize?: 'mini' | 'normal';
}

/**
 * BattlefieldZone - Complete battlefield with units on both sides
 *
 * Layout (top to bottom):
 * 1. Opponent units (above BF card)
 * 2. Battlefield card (horizontal, center)
 * 3. Player units (below BF card)
 *
 * Features:
 * - Contested indicator on battlefield card
 * - Units positioned above/below
 */
export function BattlefieldZone({
  battlefield,
  playerUnits,
  opponentUnits,
  onUnitClick,
  unitSize = 'mini',
}: BattlefieldZoneProps) {
  return (
    <Stack spacing={3} align="center" className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
      {/* Opponent units (top) */}
      <BattlefieldUnits
        units={opponentUnits}
        side="opponent"
        onUnitClick={onUnitClick}
        size={unitSize}
      />

      {/* Battlefield card (center) */}
      <BattlefieldCard
        imageUrl={battlefield.imageUrl}
        name={battlefield.name}
        isContested={battlefield.isContested}
      />

      {/* Player units (bottom) */}
      <BattlefieldUnits
        units={playerUnits}
        side="player"
        onUnitClick={onUnitClick}
        size={unitSize}
      />
    </Stack>
  );
}
