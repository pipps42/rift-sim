import { Flex } from '../primitives/Flex';
import { GameCard } from '../card/GameCard';
import type { UICard } from '@/types';

// Re-export UICard with aliases for backwards compatibility
export type LegendCard = UICard;
export type ChampionCard = UICard;

export interface LegendChampionZoneProps {
  /**
   * Legend card (always visible, never played)
   */
  legend: LegendCard;
  /**
   * Chosen champion card
   */
  chosenChampion: ChampionCard;
  /**
   * Click handler for champion (to play it)
   */
  onChampionClick?: () => void;
  /**
   * Size variant
   * @default 'mini'
   */
  size?: 'mini' | 'normal';
}

/**
 * LegendChampionZone - Displays legend + chosen champion
 *
 * Layout:
 * - 2 cards side by side
 * - Legend: Always visible, not playable
 * - Champion: Visible, clickable to play (if in zone)
 *
 * Both cards always visible from game start
 */
export function LegendChampionZone({
  legend,
  chosenChampion,
  onChampionClick,
  size = 'mini',
}: LegendChampionZoneProps) {
  return (
    <Flex gap={2} align="center">
      {/* Legend (not playable) */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs font-semibold text-slate-300">Legend</div>
        <GameCard
          imageUrl={legend.imageUrl}
          name={legend.name}
          size={size}
        />
      </div>

      {/* Chosen Champion (playable) */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs font-semibold text-slate-300">Champion</div>
        {chosenChampion.inZone ? (
          <GameCard
            imageUrl={chosenChampion.imageUrl}
            name={chosenChampion.name}
            size={size}
            isPlayable={true} // Champions are always playable from zone
            onClick={onChampionClick}
          />
        ) : (
          // Champion played - show placeholder
          <div className="w-20 h-28 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center bg-slate-800/30">
            <span className="text-xs text-slate-500">Played</span>
          </div>
        )}
      </div>
    </Flex>
  );
}
