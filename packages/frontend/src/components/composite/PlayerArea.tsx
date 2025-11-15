import { Stack } from '../primitives/Stack';
import { PlayerZones } from './PlayerZones';
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
 * PlayerArea - Complete area for one player
 *
 * Layout:
 * For player: Hand → Decks+Rune → Gear+Champion → Base+Legend
 * For opponent: Base+Legend → Gear+Champion → Decks+Rune → Hand (inverted)
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
  cardWidth = 80,
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
    <div className="w-full h-full overflow-hidden">
      <PlayerZones
        handCards={handCards}
        mainDeckCount={mainDeckCount}
        runeDeckCount={runeDeckCount}
        runes={runes}
        runePool={runePool}
        gears={gears}
        trashCards={trashCards}
        baseUnits={baseUnits}
        legend={legend}
        chosenChampion={chosenChampion}
        isOpponent={isOpponent}
        cardWidth={cardWidth}
        onCardClick={onCardClick}
        onDeckClick={onDeckClick}
        onRuneDeckClick={onRuneDeckClick}
        onTrashClick={onTrashClick}
        onRuneClick={onRuneClick}
        onGearClick={onGearClick}
        onUnitClick={onUnitClick}
        onChampionClick={onChampionClick}
      />
    </div>
  );
}
