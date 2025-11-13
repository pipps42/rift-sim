import { Stack } from '../primitives/Stack';
import { Container } from '../primitives/Container';
import { PlayerArea, PlayerAreaProps } from './PlayerArea';
import { BattlefieldCenter, BattlefieldCenterProps } from './BattlefieldCenter';

export interface GameBoardProps {
  /**
   * Current player data (bottom)
   */
  player: Omit<PlayerAreaProps, 'isOpponent'>;
  /**
   * Opponent player data (top)
   */
  opponent: Omit<PlayerAreaProps, 'isOpponent'>;
  /**
   * Battlefield center data
   */
  battlefieldCenter: BattlefieldCenterProps;
}

/**
 * GameBoard - Complete game board layout
 *
 * Layout (top to bottom):
 * 1. Opponent PlayerArea (mirrored layout)
 * 2. BattlefieldCenter (2 battlefields + info panel + chain stack)
 * 3. Player PlayerArea (normal layout)
 *
 * This is the main game view component that assembles all zones
 * and game state into a complete playable interface.
 */
export function GameBoard({
  player,
  opponent,
  battlefieldCenter,
}: GameBoardProps) {
  return (
    <Container maxWidth="full" padding={true} className="min-h-screen bg-slate-900">
      <Stack spacing={6} className="py-6">
        {/* Opponent Area (top) */}
        <PlayerArea
          {...opponent}
          isOpponent={true}
        />

        {/* Battlefield Center (middle) */}
        <BattlefieldCenter {...battlefieldCenter} />

        {/* Player Area (bottom) */}
        <PlayerArea
          {...player}
          isOpponent={false}
        />
      </Stack>
    </Container>
  );
}
