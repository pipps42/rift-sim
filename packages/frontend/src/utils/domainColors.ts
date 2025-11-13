/**
 * Domain color utilities for Riftbound TCG
 */

export type Domain = 'FURY' | 'CALM' | 'MIND' | 'BODY' | 'CHAOS' | 'ORDER' | 'UNIVERSAL';

export const domainColors: Record<Domain, string> = {
  FURY: '#ef4444',
  CALM: '#3b82f6',
  MIND: '#8b5cf6',
  BODY: '#10b981',
  CHAOS: '#f97316',
  ORDER: '#eab308',
  UNIVERSAL: '#6b7280',
};

export const domainTailwindClasses: Record<Domain, string> = {
  FURY: 'bg-fury',
  CALM: 'bg-calm',
  MIND: 'bg-mind',
  BODY: 'bg-body',
  CHAOS: 'bg-chaos',
  ORDER: 'bg-order',
  UNIVERSAL: 'bg-universal',
};

export const domainGlowClasses: Record<Domain, string> = {
  FURY: 'glow-fury',
  CALM: 'glow-calm',
  MIND: 'shadow-lg shadow-mind/50',
  BODY: 'shadow-lg shadow-body/50',
  CHAOS: 'shadow-lg shadow-chaos/50',
  ORDER: 'shadow-lg shadow-order/50',
  UNIVERSAL: 'shadow-lg shadow-universal/50',
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
