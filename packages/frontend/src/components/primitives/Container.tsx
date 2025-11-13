import { ReactNode } from 'react';
import clsx from 'clsx';

export interface ContainerProps {
  children: ReactNode;
  /**
   * Max width constraint
   * @default 'xl'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /**
   * Padding
   * @default true
   */
  padding?: boolean;
  /**
   * Center horizontally
   * @default true
   */
  center?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

/**
 * Container component - responsive container with max-width constraints
 */
export function Container({
  children,
  maxWidth = 'xl',
  padding = true,
  center = true,
  className,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        maxWidthClasses[maxWidth],
        padding && 'px-4',
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}
