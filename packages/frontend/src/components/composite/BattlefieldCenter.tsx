import { Flex } from '../primitives/Flex';
import { Stack } from '../primitives/Stack';
import { BattlefieldZone } from '../battlefield/BattlefieldZone';
import { GameInfoPanel } from '../game/GameInfoPanel';
import type { GamePhase } from '../game/PhaseIndicator';
import { ChainStack } from '../game/ChainStack';
import type { BattlefieldUnit } from '../battlefield/BattlefieldUnits';
import type { ChainItem } from '../game/ChainStack';

export interface Battlefield {
  id: string;
  imageUrl: string;
  name: string;
  isContested: boolean;
  playerUnits: BattlefieldUnit[];
  opponentUnits: BattlefieldUnit[];
}

export interface BattlefieldCenterProps {
  /**
   * Two battlefields
   */
  battlefields: [Battlefield, Battlefield];
  /**
   * Game info
   */
  gameInfo: {
    player1: { name: string; score: number };
    player2: { name: string; score: number };
    currentPhase: GamePhase;
    turnNumber: number;
    roundNumber: number;
    priorityPlayer: string;
  };
  /**
   * Chain stack items
   */
  chainItems: ChainItem[];
  /**
   * Click handler for units
   */
  onUnitClick?: (unitId: string) => void;
}

/**
 * BattlefieldCenter - Central area with 2 battlefields + game info
 *
 * Layout (left to right):
 * - Left: Game info panel (fixed width)
 * - Center: 2 battlefields side by side (expandable)
 * - Right: Chain stack (fixed width)
 *
 * No scrolling - content fits within allocated space
 */
export function BattlefieldCenter({
  battlefields,
  gameInfo,
  chainItems,
  onUnitClick,
}: BattlefieldCenterProps) {
  const [battlefield1, battlefield2] = battlefields;

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'stretch',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {/* Left: Game Info Panel - Fixed */}
      <div
        className="overflow-hidden"
        style={{
          width: '180px',
          flexShrink: 0,
          minHeight: 0,
        }}
      >
        <GameInfoPanel
          player1={gameInfo.player1}
          player2={gameInfo.player2}
          currentPhase={gameInfo.currentPhase}
          turnNumber={gameInfo.turnNumber}
          roundNumber={gameInfo.roundNumber}
          priorityPlayer={gameInfo.priorityPlayer}
          size="compact"
        />
      </div>

      {/* Center: Battlefields - Expandable */}
      <div
        className="overflow-hidden"
        style={{
          flex: '1 1 0',
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        <BattlefieldZone
          battlefield={{
            imageUrl: battlefield1.imageUrl,
            name: battlefield1.name,
            isContested: battlefield1.isContested,
          }}
          playerUnits={battlefield1.playerUnits}
          opponentUnits={battlefield1.opponentUnits}
          onUnitClick={onUnitClick}
          unitSize="mini"
        />

        <BattlefieldZone
          battlefield={{
            imageUrl: battlefield2.imageUrl,
            name: battlefield2.name,
            isContested: battlefield2.isContested,
          }}
          playerUnits={battlefield2.playerUnits}
          opponentUnits={battlefield2.opponentUnits}
          onUnitClick={onUnitClick}
          unitSize="mini"
        />
      </div>

      {/* Right: Chain Stack - Fixed */}
      <div
        className="overflow-hidden"
        style={{
          width: '180px',
          flexShrink: 0,
          minHeight: 0,
        }}
      >
        <ChainStack items={chainItems} />
      </div>
    </div>
  );
}
