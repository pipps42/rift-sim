import { Flex } from '../primitives/Flex';
import { RunePoolIcon } from './RunePoolIcon';
import type { Domain } from '@/utils/domainColors';

export interface PowerCost {
  domain: Domain;
  amount: number;
}

export interface RunePoolProps {
  /**
   * Energy amount
   */
  energy: number;
  /**
   * Power costs (domain + amount)
   */
  powerCosts: PowerCost[];
  /**
   * Layout direction
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Icon size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * RunePool - Displays available energy and power resources
 *
 * Shows:
 * - Energy (white circle) if > 0
 * - Power for each domain with amount > 0
 *
 * Layout: Horizontal row of icons with counters
 */
export function RunePool({
  energy,
  powerCosts,
  direction = 'horizontal',
  size = 'md',
}: RunePoolProps) {
  // Filter out power with 0 amount
  const activePower = powerCosts.filter((p) => p.amount > 0);

  // Don't render if no resources
  if (energy === 0 && activePower.length === 0) {
    return (
      <div className="text-sm text-slate-400 italic">No resources</div>
    );
  }

  return (
    <Flex
      direction={direction === 'horizontal' ? 'row' : 'col'}
      gap={3}
      align="center"
      wrap
    >
      {/* Energy */}
      {energy > 0 && <RunePoolIcon type="energy" count={energy} size={size} />}

      {/* Power by domain */}
      {activePower.map((power) => (
        <RunePoolIcon
          key={power.domain}
          type={power.domain}
          count={power.amount}
          size={size}
        />
      ))}
    </Flex>
  );
}
