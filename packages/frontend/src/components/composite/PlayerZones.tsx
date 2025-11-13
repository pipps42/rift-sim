import { Flex } from '../primitives/Flex';
import { Stack } from '../primitives/Stack';
import { DeckZone } from '../zones/DeckZone';
import { RuneZone } from '../zones/RuneZone';
import { RunePool } from '../zones/RunePool';
import { GearZone } from '../zones/GearZone';
import { TrashZone } from '../zones/TrashZone';
import { PlayerBase } from '../zones/PlayerBase';
import { LegendChampionZone } from '../zones/LegendChampionZone';
import type { Rune } from '../zones/RuneZone';
import type { PowerCost } from '../zones/RunePool';
import type { GearCard } from '../zones/GearZone';
import type { TrashCard } from '../zones/TrashZone';
import type { BaseUnit } from '../zones/PlayerBase';
import type { LegendCard, ChampionCard } from '../zones/LegendChampionZone';

export interface PlayerZonesProps {
  /**
   * Main deck count
   */
  mainDeckCount: number;
  /**
   * Rune deck count
   */
  runeDeckCount: number;
  /**
   * Runes in play
   */
  runes: Rune[];
  /**
   * Rune pool (energy + power)
   */
  runePool: {
    energy: number;
    powerCosts: PowerCost[];
  };
  /**
   * Gear cards
   */
  gears: GearCard[];
  /**
   * Trash cards
   */
  trashCards: TrashCard[];
  /**
   * Units in base
   */
  baseUnits: BaseUnit[];
  /**
   * Legend card
   */
  legend: LegendCard;
  /**
   * Chosen champion
   */
  chosenChampion: ChampionCard;
  /**
   * Whether this is opponent's zones
   * @default false
   */
  isOpponent?: boolean;
  /**
   * Click handlers
   */
  onDeckClick?: () => void;
  onRuneDeckClick?: () => void;
  onTrashClick?: () => void;
  onRuneClick?: (runeId: string) => void;
  onGearClick?: (gearId: string) => void;
  onUnitClick?: (unitId: string) => void;
  onChampionClick?: () => void;
}

/**
 * PlayerZones - All zones for a player (excluding hand)
 *
 * Layout (left to right):
 * - Rune Deck
 * - Rune Zone + Pool (stacked)
 * - Main Deck
 * - Gear Zone
 * - Trash
 *
 * Below:
 * - Player Base
 * - Legend + Champion
 */
export function PlayerZones({
  mainDeckCount,
  runeDeckCount,
  runes,
  runePool,
  gears,
  trashCards,
  baseUnits,
  legend,
  chosenChampion,
  isOpponent = false,
  onDeckClick,
  onRuneDeckClick,
  onTrashClick,
  onRuneClick,
  onGearClick,
  onUnitClick,
  onChampionClick,
}: PlayerZonesProps) {
  return (
    <Stack spacing={3}>
      {/* Top row: Decks + Rune Zone + Gear + Trash */}
      <Flex gap={4} align="start" wrap>
        {/* Rune Deck */}
        <DeckZone
          count={runeDeckCount}
          type="rune"
          onClick={onRuneDeckClick}
          size="mini"
        />

        {/* Rune Zone + Pool */}
        <Stack spacing={2} className="flex-1 min-w-[200px]">
          <RunePool
            energy={runePool.energy}
            powerCosts={runePool.powerCosts}
            size="sm"
          />
          <RuneZone runes={runes} onRuneClick={onRuneClick} />
        </Stack>

        {/* Main Deck */}
        <DeckZone
          count={mainDeckCount}
          type="main"
          onClick={onDeckClick}
          size="mini"
        />

        {/* Gear Zone */}
        <div className="flex-1 min-w-[150px]">
          <div className="text-xs font-semibold text-slate-300 mb-2">Gear</div>
          <GearZone gears={gears} onGearClick={onGearClick} size="mini" />
        </div>

        {/* Trash */}
        <TrashZone cards={trashCards} onClick={onTrashClick} size="mini" />
      </Flex>

      {/* Bottom row: Base + Legend/Champion */}
      <Flex gap={4} align="start">
        {/* Player Base */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-slate-300 mb-2">
            {isOpponent ? 'Opponent Base' : 'Your Base'}
          </div>
          <PlayerBase units={baseUnits} onUnitClick={onUnitClick} size="mini" />
        </div>

        {/* Legend + Champion */}
        <LegendChampionZone
          legend={legend}
          chosenChampion={chosenChampion}
          onChampionClick={onChampionClick}
          size="mini"
        />
      </Flex>
    </Stack>
  );
}
