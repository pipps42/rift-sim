import clsx from 'clsx';
import { GameCard } from '../card/GameCard';
import { CardBack } from '../card/CardBack';
import type { UICard } from '@/types';

// Re-export UICard as HandCard for backwards compatibility
export type HandCard = UICard;

export interface HandProps {
  /**
   * Cards in hand
   */
  cards: HandCard[];
  /**
   * Whether this is opponent's hand (shows card backs)
   * @default false
   */
  isOpponent?: boolean;
  /**
   * Click handler for card
   */
  onCardClick?: (cardId: string) => void;
  /**
   * Maximum cards to display before scrolling
   * @default 10
   */
  maxDisplay?: number;
}

/**
 * Hand - Displays player's hand of cards
 *
 * Features:
 * - Horizontal scrollable layout
 * - Shows card backs for opponent
 * - Highlights playable cards
 * - Responsive: scrolls when >10 cards
 */
export function Hand({
  cards,
  isOpponent = false,
  onCardClick,
  maxDisplay = 10,
}: HandProps) {
  if (cards.length === 0) {
    return (
      <div className="text-sm text-slate-400 italic p-4 border border-dashed border-slate-600 rounded">
        {isOpponent ? 'Opponent has no cards' : 'Your hand is empty'}
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700 overflow-x-auto overflow-y-hidden"
      style={{ minWidth: 0, minHeight: 0 }}
    >
      {cards.map((card) =>
        isOpponent ? (
          // Opponent hand: show card backs - height 100%, width auto based on aspect ratio
          <div
            key={card.instanceId}
            className="flex-shrink-0"
            style={{
              height: '100%',
              aspectRatio: '240/336',
            }}
          >
            <CardBack size="normal" />
          </div>
        ) : (
          // Player hand: show full cards - height 100%, width auto based on aspect ratio
          <div
            key={card.instanceId}
            className="flex-shrink-0"
            style={{
              height: '100%',
              aspectRatio: '240/336',
            }}
          >
            <GameCard
              imageUrl={card.imageUrl}
              name={card.name}
              originalCost={card.originalCost}
              modifiedCost={card.modifiedCost}
              isPlayable={card.isPlayable}
              size="normal"
              onClick={() => card.instanceId && onCardClick?.(card.instanceId)}
            />
          </div>
        )
      )}
    </div>
  );
}
