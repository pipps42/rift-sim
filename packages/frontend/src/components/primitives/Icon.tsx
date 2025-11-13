import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export interface IconProps {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  /**
   * Icon size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Icon color
   * @default 'currentColor'
   */
  color?: string;
  /**
   * Additional className
   */
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * Icon component - wrapper for Lucide React icons
 */
export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'currentColor',
  className,
}: IconProps) {
  return (
    <IconComponent
      className={clsx(sizeClasses[size], className)}
      color={color}
      aria-hidden="true"
    />
  );
}
