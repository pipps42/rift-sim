import { Flex } from '../primitives/Flex';
import { Stack } from '../primitives/Stack';
import { DeckZone } from '../zones/DeckZone';
import { RuneZone } from '../zones/RuneZone';
import { RunePool } from '../zones/RunePool';
import { GearZone } from '../zones/GearZone';
import { TrashZone } from '../zones/TrashZone';
import { PlayerBase } from '../zones/PlayerBase';
import { LegendChampionZone } from '../zones/LegendChampionZone';
import { Hand } from '../zones/Hand';
import type { Rune } from '../zones/RuneZone';
import type { PowerCost } from '../zones/RunePool';
import type { GearCard } from '../zones/GearZone';
import type { TrashCard } from '../zones/TrashZone';
import type { BaseUnit } from '../zones/PlayerBase';
import type { LegendCard, ChampionCard } from '../zones/LegendChampionZone';
import type { HandCard } from '../zones/Hand';

export interface PlayerZonesProps {
  /**
   * Cards in hand
   */
  handCards: HandCard[];
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
   * Card width for fixed-width components (in pixels)
   * @default 80
   */
  cardWidth?: number;
  /**
   * Click handlers
   */
  onCardClick?: (cardId: string) => void;
  onDeckClick?: () => void;
  onRuneDeckClick?: () => void;
  onTrashClick?: () => void;
  onRuneClick?: (runeId: string) => void;
  onGearClick?: (gearId: string) => void;
  onUnitClick?: (unitId: string) => void;
  onChampionClick?: () => void;
}

/**
 * PlayerZones - All zones for a player (including hand)
 *
 * Layout (3 equal-height rows):
 * For player (bottom to top): Hand → Decks+Rune → Base+Legend+Champion
 * For opponent (top to bottom): Hand → Decks+Rune → Base+Legend+Champion
 *
 * All components scale dynamically based on available space
 * Gear cards are now merged into Base Zone
 */
export function PlayerZones({
  handCards,
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
  cardWidth = 80, // Deprecated but kept for backwards compatibility
  onCardClick,
  onDeckClick,
  onRuneDeckClick,
  onTrashClick,
  onRuneClick,
  onGearClick,
  onUnitClick,
  onChampionClick,
}: PlayerZonesProps) {
  // Merge gear cards into base units
  const allBaseCards = [...baseUnits, ...gears.map(gear => ({
    instanceId: gear.instanceId,
    imageUrl: gear.imageUrl,
    name: gear.name,
    damage: 0,
    ready: true,
  }))];

  // Row 1: Hand (full width, scales dynamically)
  const handRow = (
    <div className="w-full h-full overflow-hidden">
      <Hand
        cards={handCards}
        isOpponent={isOpponent}
        onCardClick={onCardClick}
      />
    </div>
  );

  // Row 2: Rune Deck + Rune Zone + Main Deck + Trash (dynamic widths)
  const decksRow = (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 6fr 1fr 1fr',
        gap: '4px',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {/* Rune Deck */}
      <div className="overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
        <DeckZone
          count={runeDeckCount}
          type="rune"
          onClick={onRuneDeckClick}
          size="mini"
        />
      </div>

      {/* Rune Zone + Pool - Expandable */}
      <div className="h-full flex flex-col gap-1 overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
        <div className="flex-shrink-0">
          <RunePool
            energy={runePool.energy}
            powerCosts={runePool.powerCosts}
            size="sm"
          />
        </div>
        <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <RuneZone runes={runes} onRuneClick={onRuneClick} />
        </div>
      </div>

      {/* Main Deck */}
      <div className="overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
        <DeckZone
          count={mainDeckCount}
          type="main"
          onClick={onDeckClick}
          size="mini"
        />
      </div>

      {/* Trash */}
      <div className="overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
        <TrashZone cards={trashCards} onClick={onTrashClick} size="mini" />
      </div>
    </div>
  );

  // Row 3: Base + Legend + Champion (dynamic widths)
  const baseRow = (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '4px',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {/* Base (includes gear cards) - Expandable */}
      <div className="overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
        <PlayerBase units={allBaseCards} onUnitClick={onUnitClick} size="mini" />
      </div>

      {/* Legend */}
      <div className="overflow-hidden" style={{ minWidth: 0, minHeight: 0, aspectRatio: '240/336' }}>
        <div className="h-full flex flex-col items-center gap-1">
          <div className="text-xs font-semibold text-slate-300">Legend</div>
          <div className="flex-1 w-full relative">
            <img
              src={legend.imageUrl}
              alt={legend.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Champion */}
      <div className="overflow-hidden" style={{ minWidth: 0, minHeight: 0, aspectRatio: '240/336' }}>
        <div className="h-full flex flex-col items-center gap-1">
          <div className="text-xs font-semibold text-slate-300">Champion</div>
          <div className="flex-1 w-full relative">
            {chosenChampion.inZone ? (
              <img
                src={chosenChampion.imageUrl}
                alt={chosenChampion.name}
                className="absolute inset-0 w-full h-full object-contain cursor-pointer"
                onClick={onChampionClick}
              />
            ) : (
              <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center bg-slate-800/30">
                <span className="text-xs text-slate-500">Played</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '2px',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {isOpponent ? (
        <>
          {/* Opponent: Hand at top → Decks → Base */}
          {handRow}
          {decksRow}
          {baseRow}
        </>
      ) : (
        <>
          {/* Player: Base → Decks → Hand at bottom */}
          {baseRow}
          {decksRow}
          {handRow}
        </>
      )}
    </div>
  );
}
