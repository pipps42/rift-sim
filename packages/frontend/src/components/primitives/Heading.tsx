import { ReactNode, createElement, HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  /**
   * Heading level (semantic HTML)
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Visual size (can differ from semantic level)
   */
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm';
  /**
   * Text color
   * @default 'default'
   */
  color?: 'default' | 'muted' | 'primary';
  /**
   * Font weight
   * @default 'bold'
   */
  weight?: 'semibold' | 'bold' | 'extrabold';
  /**
   * Additional className
   */
  className?: string;
}

const sizeClasses = {
  '2xl': 'text-4xl',
  xl: 'text-3xl',
  lg: 'text-2xl',
  md: 'text-xl',
  sm: 'text-lg',
};

const colorClasses = {
  default: 'text-slate-100',
  muted: 'text-slate-300',
  primary: 'text-primary-400',
};

const weightClasses = {
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

/**
 * Heading component - semantic headings (h1-h6) with flexible styling
 */
export function Heading({
  children,
  level = 2,
  size,
  color = 'default',
  weight = 'bold',
  className,
  ...props
}: HeadingProps) {
  // Map level to default size if not specified
  const defaultSizes: Record<number, keyof typeof sizeClasses> = {
    1: '2xl',
    2: 'xl',
    3: 'lg',
    4: 'md',
    5: 'sm',
    6: 'sm',
  };

  const headingSize = size || defaultSizes[level];

  return createElement(
    `h${level}`,
    {
      className: clsx(
        sizeClasses[headingSize],
        colorClasses[color],
        weightClasses[weight],
        className
      ),
      ...props,
    },
    children
  );
}
