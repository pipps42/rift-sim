import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  /**
   * Text variant
   * @default 'body'
   */
  variant?: 'body' | 'caption' | 'label' | 'display';
  /**
   * Text size (overrides variant size if specified)
   */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  /**
   * Text color
   * @default 'default'
   */
  color?: 'default' | 'muted' | 'primary' | 'danger' | 'success';
  /**
   * Font weight
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Additional className
   */
  className?: string;
}

const variantClasses = {
  body: 'text-base',
  caption: 'text-sm text-slate-400',
  label: 'text-sm font-medium',
  display: 'text-lg font-semibold',
};

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const colorClasses = {
  default: 'text-slate-100',
  muted: 'text-slate-400',
  primary: 'text-primary-400',
  danger: 'text-red-400',
  success: 'text-green-400',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Text component - styled paragraph/text
 */
export function Text({
  children,
  variant = 'body',
  size,
  color = 'default',
  weight,
  align,
  className,
  ...props
}: TextProps) {
  return (
    <p
      className={clsx(
        // Variant (baseline)
        variantClasses[variant],
        // Size override
        size && sizeClasses[size],
        // Color
        colorClasses[color],
        // Weight
        weight && weightClasses[weight],
        // Alignment
        align && alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
