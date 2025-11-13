import { Stack } from '../primitives/Stack';
import { MiniCard } from '../card/MiniCard';
import { Text } from '../primitives/Text';

export interface ChainItem {
  id: string;
  cardImageUrl: string;
  cardName: string;
  /**
   * Type of item (spell or ability)
   */
  type: 'spell' | 'ability';
  /**
   * Controller player name
   */
  controller: string;
}

export interface ChainStackProps {
  /**
   * Items in chain (bottom to top order)
   */
  items: ChainItem[];
}

/**
 * ChainStack - Displays spell/ability chain stack
 *
 * Layout:
 * - Vertical stack (bottom = first to resolve)
 * - Shows mini cards for each spell/ability
 * - Arrow indicators between items
 * - Resolution order: bottom → top
 */
export function ChainStack({ items }: ChainStackProps) {
  if (items.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 min-w-[120px]">
        <Text variant="caption" color="muted" align="center">
          Chain Empty
        </Text>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg">
      <Stack spacing={2} align="center">
        {/* Header */}
        <Text variant="label" size="sm" className="mb-2">
          Chain Stack ({items.length})
        </Text>

        {/* Items (reversed to show top of stack first) */}
        {[...items].reverse().map((item, index) => (
          <div key={item.id} className="flex flex-col items-center gap-1">
            {/* Arrow (except for first item) */}
            {index > 0 && (
              <div className="text-slate-400 text-xs">↓</div>
            )}

            {/* Card */}
            <div className="relative">
              <MiniCard
                imageUrl={item.cardImageUrl}
                name={item.cardName}
              />
              {/* Controller label */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                {item.controller}
              </div>
            </div>
          </div>
        ))}

        {/* Resolution hint */}
        <Text variant="caption" color="muted" size="xs" className="mt-2">
          Resolves bottom → top
        </Text>
      </Stack>
    </div>
  );
}
