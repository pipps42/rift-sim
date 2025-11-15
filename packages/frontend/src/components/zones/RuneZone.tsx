import clsx from 'clsx';
import { GameCard } from '../card/GameCard';
import { Domain } from '@riftbound/shared';
import type { UICard } from '@/types';

// Re-export UICard as Rune for backwards compatibility
// Note: Rune uses the domain property from UICard
export type Rune = UICard;

export interface RuneZoneProps {
  /**
   * Runes in play
   */
  runes: Rune[];
  /**
   * Click handler for rune
   */
  onRuneClick?: (runeId: string) => void;
}

/**
 * RuneZone - Displays runes in play, grouped by domain
 *
 * Layout:
 * - Runes grouped by domain
 * - Ready runes: vertical
 * - Exhausted runes: horizontal (tilted) + desaturated
 * - Partial overlap to save space
 *
 * Groups: Fury → Calm → Mind → Body → Chaos → Order → Universal
 */
export function RuneZone({ runes, onRuneClick }: RuneZoneProps) {
  if (runes.length === 0) {
    return (
      <div className="w-full text-sm text-slate-400 italic p-2 border border-dashed border-slate-600 rounded">
        No runes in play
      </div>
    );
  }

  // Group runes by domain
  const domainOrder: Domain[] = [Domain.FURY, Domain.CALM, Domain.MIND, Domain.BODY, Domain.CHAOS, Domain.ORDER, Domain.UNIVERSAL];

  const runesByDomain = runes.reduce((acc, rune) => {
    if (rune.domain) {
      if (!acc[rune.domain]) {
        acc[rune.domain] = [];
      }
      acc[rune.domain].push(rune);
    }
    return acc;
  }, {} as Record<Domain, Rune[]>);

  return (
    <div className="w-full h-full flex gap-2 p-1 overflow-x-auto overflow-y-hidden" style={{ minWidth: 0, minHeight: 0 }}>
      {domainOrder.map((domain) => {
        const domainRunes = runesByDomain[domain];
        if (!domainRunes || domainRunes.length === 0) return null;

        // Separate ready and exhausted runes
        const readyRunes = domainRunes.filter((r) => r.ready);
        const exhaustedRunes = domainRunes.filter((r) => !r.ready);

        return (
          <div key={domain} className="flex gap-1 flex-shrink-0 h-full" style={{ minHeight: 0 }}>
            {/* Ready and exhausted runes side by side */}
            {readyRunes.map((rune) => (
              <div
                key={rune.instanceId}
                className="flex-shrink-0 transition-all duration-200"
                style={{ height: '100%', aspectRatio: '240/336' }}
              >
                <GameCard
                  imageUrl={rune.imageUrl}
                  name={rune.name}
                  isExhausted={false}
                  size="mini"
                  onClick={() => rune.instanceId && onRuneClick?.(rune.instanceId)}
                />
              </div>
            ))}
            {exhaustedRunes.map((rune) => (
              <div
                key={rune.instanceId}
                className="flex-shrink-0 transition-all duration-200"
                style={{ height: '100%', aspectRatio: '240/336' }}
              >
                <GameCard
                  imageUrl={rune.imageUrl}
                  name={rune.name}
                  isExhausted={true}
                  size="mini"
                  onClick={() => rune.instanceId && onRuneClick?.(rune.instanceId)}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
