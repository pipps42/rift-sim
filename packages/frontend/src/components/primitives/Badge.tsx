import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: ReactNode;
  /**
   * Badge variant/color
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'fury' | 'calm' | 'mind' | 'body' | 'chaos' | 'order';
  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional className
   */
  className?: string;
}

const variantClasses = {
  default: 'bg-slate-700 text-slate-200',
  primary: 'bg-primary-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  danger: 'bg-red-600 text-white',
  fury: 'bg-fury text-white',
  calm: 'bg-calm text-white',
  mind: 'bg-mind text-white',
  body: 'bg-body text-white',
  chaos: 'bg-chaos text-white',
  order: 'bg-order text-gray-900',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * Badge component - colored label/tag for status or categories
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
