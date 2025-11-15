import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface StackProps {
  children: ReactNode;
  /**
   * Stack direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Spacing between items (in tailwind units: 4px per unit)
   * @default 4
   */
  spacing?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
  /**
   * Align items
   * @default 'stretch'
   */
  align?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * Additional className
   */
  className?: string;
}

const spacingClasses = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
  16: 'gap-16',
};

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
};

/**
 * Stack component - vertical or horizontal layout with uniform spacing
 * Simplified Flex component for common stacking patterns
 */
export function Stack({
  children,
  direction = 'vertical',
  spacing = 4,
  align = 'stretch',
  className,
}: StackProps) {
  return (
    <div
      className={clsx(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}
