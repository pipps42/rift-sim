import { Flex } from '../primitives/Flex';
import { Stack } from '../primitives/Stack';
import { BattlefieldZone } from '../battlefield/BattlefieldZone';
import { GameInfoPanel, GamePhase } from '../game/GameInfoPanel';
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
 * Layout:
 * - Left: 2 battlefields side by side
 * - Right: Game info panel + Chain stack
 */
export function BattlefieldCenter({
  battlefields,
  gameInfo,
  chainItems,
  onUnitClick,
}: BattlefieldCenterProps) {
  const [battlefield1, battlefield2] = battlefields;

  return (
    <Flex gap={4} align="start" justify="center" className="w-full">
      {/* Battlefields (left) */}
      <Flex gap={4}>
        <BattlefieldZone
          battlefield={{
            imageUrl: battlefield1.imageUrl,
            name: battlefield1.name,
            isContested: battlefield1.isContested,
          }}
          playerUnits={battlefield1.playerUnits}
          opponentUnits={battlefield1.opponentUnits}
          onUnitClick={onUnitClick}
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
        />
      </Flex>

      {/* Game Info + Chain Stack (right) */}
      <Stack spacing={4}>
        <GameInfoPanel
          player1={gameInfo.player1}
          player2={gameInfo.player2}
          currentPhase={gameInfo.currentPhase}
          turnNumber={gameInfo.turnNumber}
          roundNumber={gameInfo.roundNumber}
          priorityPlayer={gameInfo.priorityPlayer}
        />

        <ChainStack items={chainItems} />
      </Stack>
    </Flex>
  );
}
