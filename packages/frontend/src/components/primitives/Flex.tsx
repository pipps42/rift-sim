import { ReactNode } from 'react';
import clsx from 'clsx';

export interface FlexProps {
  children: ReactNode;
  /**
   * Flex direction
   * @default 'row'
   */
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  /**
   * Justify content
   * @default 'start'
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /**
   * Align items
   * @default 'stretch'
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /**
   * Gap between items
   * @default 0
   */
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
  /**
   * Wrap items
   * @default false
   */
  wrap?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

const directionClasses = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const gapClasses = {
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

/**
 * Flex component - flexible box layout container
 */
export function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 0,
  wrap = false,
  className,
}: FlexProps) {
  return (
    <div
      className={clsx(
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}
