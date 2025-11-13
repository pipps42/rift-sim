import clsx from 'clsx';
import { Circle } from 'lucide-react';
import { getDomainColor } from '@/utils/domainColors';
import type { Domain } from '@/utils/domainColors';

export interface RunePoolIconProps {
  /**
   * Type of resource
   * 'energy' = white circle
   * Domain name = colored icon for that domain
   */
  type: 'energy' | Domain;
  /**
   * Amount of this resource
   */
  count: number;
  /**
   * Icon size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * RunePoolIcon - Single resource icon with counter
 *
 * Displays:
 * - White circle for energy
 * - Colored circle for power domains (Fury, Calm, etc.)
 * - Count number next to icon
 */
export function RunePoolIcon({ type, count, size = 'md' }: RunePoolIconProps) {
  const isEnergy = type === 'energy';

  // Get color for domain
  const colorClass = isEnergy ? 'text-white' : getDomainColor(type as Domain);

  return (
    <div className={clsx('inline-flex items-center gap-1', sizeClasses[size])}>
      {/* Icon */}
      <Circle
        className={clsx(
          iconSizeClasses[size],
          isEnergy ? 'text-white fill-white' : `${colorClass} fill-current`
        )}
      />

      {/* Count */}
      <span className="font-semibold text-slate-100">×{count}</span>
    </div>
  );
}
