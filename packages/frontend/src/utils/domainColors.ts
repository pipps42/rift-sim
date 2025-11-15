/**
 * Domain color utilities for Riftbound TCG
 */

import { Domain } from '@riftbound/shared';

// Re-export Domain for backwards compatibility
export type { Domain };

export const domainColors: Record<Domain, string> = {
  [Domain.FURY]: '#ef4444',
  [Domain.CALM]: '#3b82f6',
  [Domain.MIND]: '#8b5cf6',
  [Domain.BODY]: '#10b981',
  [Domain.CHAOS]: '#f97316',
  [Domain.ORDER]: '#eab308',
  [Domain.UNIVERSAL]: '#6b7280',
};

export const domainTailwindClasses: Record<Domain, string> = {
  [Domain.FURY]: 'bg-fury',
  [Domain.CALM]: 'bg-calm',
  [Domain.MIND]: 'bg-mind',
  [Domain.BODY]: 'bg-body',
  [Domain.CHAOS]: 'bg-chaos',
  [Domain.ORDER]: 'bg-order',
  [Domain.UNIVERSAL]: 'bg-universal',
};

export const domainGlowClasses: Record<Domain, string> = {
  [Domain.FURY]: 'glow-fury',
  [Domain.CALM]: 'glow-calm',
  [Domain.MIND]: 'shadow-lg shadow-mind/50',
  [Domain.BODY]: 'shadow-lg shadow-body/50',
  [Domain.CHAOS]: 'shadow-lg shadow-chaos/50',
  [Domain.ORDER]: 'shadow-lg shadow-order/50',
  [Domain.UNIVERSAL]: 'shadow-lg shadow-universal/50',
};

/**
 * Get Tailwind color class for a domain
 */
export function getDomainColor(domain: Domain): string {
  return domainTailwindClasses[domain];
}

/**
 * Get glow effect class for a domain
 */
export function getDomainGlow(domain: Domain): string {
  return domainGlowClasses[domain];
}
