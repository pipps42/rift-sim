import { Stack } from '../primitives/Stack';
import { Hand } from '../zones/Hand';
import { PlayerZones } from './PlayerZones';
import { PlayerInfo } from '../zones/PlayerInfo';
import type { HandCard } from '../zones/Hand';
import type { Rune } from '../zones/RuneZone';
import type { PowerCost } from '../zones/RunePool';
import type { GearCard } from '../zones/GearZone';
import type { TrashCard } from '../zones/TrashZone';
import type { BaseUnit } from '../zones/PlayerBase';
import type { LegendCard, ChampionCard } from '../zones/LegendChampionZone';

export interface PlayerAreaProps {
  /**
   * Player info
   */
  player: {
    name: string;
    score: number;
    avatarUrl?: string;
    hasPriority: boolean;
  };
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
   * Rune pool
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
   * Whether this is opponent's area
   * @default false
   */
  isOpponent?: boolean;
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
 * PlayerArea - Complete area for one player
 *
 * Layout:
 * - Player Info (top)
 * - Hand (for current player bottom, opponent top)
 * - All zones (PlayerZones)
 *
 * Orientation flips for opponent (reversed order)
 */
export function PlayerArea({
  player,
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
  onCardClick,
  onDeckClick,
  onRuneDeckClick,
  onTrashClick,
  onRuneClick,
  onGearClick,
  onUnitClick,
  onChampionClick,
}: PlayerAreaProps) {
  return (
    <Stack spacing={3} className="w-full">
      {/* Player Info */}
      <PlayerInfo
        name={player.name}
        score={player.score}
        avatarUrl={player.avatarUrl}
        hasPriority={player.hasPriority}
        size="compact"
      />

      {/* For opponent: Hand at top, zones below */}
      {/* For player: Zones at top, hand at bottom */}
      {isOpponent ? (
        <>
          <Hand
            cards={handCards}
            isOpponent={true}
            onCardClick={onCardClick}
          />
          <PlayerZones
            mainDeckCount={mainDeckCount}
            runeDeckCount={runeDeckCount}
            runes={runes}
            runePool={runePool}
            gears={gears}
            trashCards={trashCards}
            baseUnits={baseUnits}
            legend={legend}
            chosenChampion={chosenChampion}
            isOpponent={true}
            onDeckClick={onDeckClick}
            onRuneDeckClick={onRuneDeckClick}
            onTrashClick={onTrashClick}
            onRuneClick={onRuneClick}
            onGearClick={onGearClick}
            onUnitClick={onUnitClick}
            onChampionClick={onChampionClick}
          />
        </>
      ) : (
        <>
          <PlayerZones
            mainDeckCount={mainDeckCount}
            runeDeckCount={runeDeckCount}
            runes={runes}
            runePool={runePool}
            gears={gears}
            trashCards={trashCards}
            baseUnits={baseUnits}
            legend={legend}
            chosenChampion={chosenChampion}
            isOpponent={false}
            onDeckClick={onDeckClick}
            onRuneDeckClick={onRuneDeckClick}
            onTrashClick={onTrashClick}
            onRuneClick={onRuneClick}
            onGearClick={onGearClick}
            onUnitClick={onUnitClick}
            onChampionClick={onChampionClick}
          />
          <Hand
            cards={handCards}
            isOpponent={false}
            onCardClick={onCardClick}
          />
        </>
      )}
    </Stack>
  );
}
