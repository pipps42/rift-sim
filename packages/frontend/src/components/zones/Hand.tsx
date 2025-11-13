import clsx from 'clsx';
import { GameCard } from '../card/GameCard';
import { CardBack } from '../card/CardBack';

export interface HandCard {
  instanceId: string;
  imageUrl: string;
  name: string;
  isPlayable?: boolean;
  originalCost?: number;
  modifiedCost?: number;
}

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

  const needsScroll = cards.length > maxDisplay;

  return (
    <div
      className={clsx(
        'flex gap-2 p-2',
        'bg-slate-800/50 rounded-lg border border-slate-700',
        // Scrollable if too many cards
        needsScroll && 'overflow-x-auto'
      )}
    >
      {cards.map((card) =>
        isOpponent ? (
          // Opponent hand: show card backs
          <div key={card.instanceId} className="flex-shrink-0">
            <CardBack size="normal" />
          </div>
        ) : (
          // Player hand: show full cards
          <div key={card.instanceId} className="flex-shrink-0">
            <GameCard
              imageUrl={card.imageUrl}
              name={card.name}
              originalCost={card.originalCost}
              modifiedCost={card.modifiedCost}
              isPlayable={card.isPlayable}
              size="normal"
              onClick={() => onCardClick?.(card.instanceId)}
            />
          </div>
        )
      )}
    </div>
  );
}
