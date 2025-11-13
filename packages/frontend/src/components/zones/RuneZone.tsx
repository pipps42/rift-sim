import clsx from 'clsx';
import { GameCard } from '../card/GameCard';
import type { Domain } from '@/utils/domainColors';

export interface Rune {
  instanceId: string;
  imageUrl: string;
  name: string;
  domain: Domain;
  ready: boolean; // true = vertical, false = horizontal/exhausted
}

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
      <div className="text-sm text-slate-400 italic p-4 border border-dashed border-slate-600 rounded">
        No runes in play
      </div>
    );
  }

  // Group runes by domain
  const domainOrder: Domain[] = ['FURY', 'CALM', 'MIND', 'BODY', 'CHAOS', 'ORDER', 'UNIVERSAL'];

  const runesByDomain = runes.reduce((acc, rune) => {
    if (!acc[rune.domain]) {
      acc[rune.domain] = [];
    }
    acc[rune.domain].push(rune);
    return acc;
  }, {} as Record<Domain, Rune[]>);

  return (
    <div className="flex flex-wrap gap-4">
      {domainOrder.map((domain) => {
        const domainRunes = runesByDomain[domain];
        if (!domainRunes || domainRunes.length === 0) return null;

        // Separate ready and exhausted runes
        const readyRunes = domainRunes.filter((r) => r.ready);
        const exhaustedRunes = domainRunes.filter((r) => !r.ready);

        return (
          <div key={domain} className="flex flex-col gap-2">
            {/* Domain label */}
            <div className="text-xs font-semibold text-slate-300">{domain}</div>

            {/* Ready runes (vertical, overlapping) */}
            {readyRunes.length > 0 && (
              <div className="flex -space-x-16">
                {readyRunes.map((rune, index) => (
                  <div
                    key={rune.instanceId}
                    className={clsx(
                      'transition-all duration-200',
                      // Bring to front on hover
                      'hover:z-10'
                    )}
                    style={{ zIndex: index }}
                  >
                    <GameCard
                      imageUrl={rune.imageUrl}
                      name={rune.name}
                      isExhausted={false}
                      size="mini"
                      onClick={() => onRuneClick?.(rune.instanceId)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Exhausted runes (horizontal, overlapping) */}
            {exhaustedRunes.length > 0 && (
              <div className="flex -space-x-8">
                {exhaustedRunes.map((rune, index) => (
                  <div
                    key={rune.instanceId}
                    className={clsx(
                      'transition-all duration-200',
                      'hover:z-10'
                    )}
                    style={{ zIndex: index }}
                  >
                    <GameCard
                      imageUrl={rune.imageUrl}
                      name={rune.name}
                      isExhausted={true}
                      size="mini"
                      onClick={() => onRuneClick?.(rune.instanceId)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
