import { PlayerArea } from './PlayerArea';
import type { PlayerAreaProps } from './PlayerArea';
import { BattlefieldCenter } from './BattlefieldCenter';
import type { BattlefieldCenterProps } from './BattlefieldCenter';

export interface GameBoardProps {
  /**
   * Current player data (bottom)
   */
  player: Omit<PlayerAreaProps, 'isOpponent' | 'cardWidth'>;
  /**
   * Opponent player data (top)
   */
  opponent: Omit<PlayerAreaProps, 'isOpponent' | 'cardWidth'>;
  /**
   * Battlefield center data
   */
  battlefieldCenter: BattlefieldCenterProps;
  /**
   * Card width for fixed-width components (in pixels)
   * @default 80
   */
  cardWidth?: number;
}

/**
 * GameBoard - Complete game board layout
 *
 * Grid layout (7 rows total):
 * - Opponent Area: 2 rows (Rune Deck + Rune Zone + Hand + Main Deck + Trash | Base + Legend + Champion)
 * - Battlefield Center: 3 rows (Info + Battlefields + Stack)
 * - Player Area: 2 rows (Base + Legend + Champion | Rune Deck + Rune Zone + Hand + Main Deck + Trash)
 *
 * No scrolling anywhere - entire board fits on screen and adapts to window size.
 * All content scales dynamically based on available space.
 */
export function GameBoard({
  player,
  opponent,
  battlefieldCenter,
  cardWidth = 80, // Deprecated
}: GameBoardProps) {
  return (
    <div
      className="bg-slate-900 overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateRows: 'repeat(7, 1fr)',
        gap: '2px',
        padding: '4px',
        height: '100vh',
        width: '100vw',
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {/* Opponent Area (top) - 2 rows */}
      <div
        className="border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden"
        style={{
          gridRow: 'span 2',
          padding: '4px',
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <PlayerArea
          {...opponent}
          isOpponent={true}
          cardWidth={cardWidth}
        />
      </div>

      {/* Battlefield Center (middle) - 3 rows */}
      <div
        className="border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden"
        style={{
          gridRow: 'span 3',
          padding: '4px',
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <BattlefieldCenter {...battlefieldCenter} />
      </div>

      {/* Player Area (bottom) - 2 rows */}
      <div
        className="border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden"
        style={{
          gridRow: 'span 2',
          padding: '4px',
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <PlayerArea
          {...player}
          isOpponent={false}
          cardWidth={cardWidth}
        />
      </div>
    </div>
  );
}
