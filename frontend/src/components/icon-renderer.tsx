import { DynamicIcon, type IconName } from '@/components/lucide';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const iconRendererVariants = cva('flex items-center justify-center rounded-full shrink-0', {
  variants: {
    size: {
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      default: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      muted: 'bg-muted text-muted-foreground',
      outline: 'border border-input bg-background text-foreground',
      ghost: 'bg-transparent text-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

const iconSizes = {
  xs: 'h-2 w-2',
  sm: 'h-3 w-3',
  default: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
} as const;

interface IconRendererProps extends VariantProps<typeof iconRendererVariants> {
  /** The lucide icon name */
  iconName: string | IconName | undefined;
  /** Additional CSS classes */
  className?: string;
  /** Custom background color (overrides variant) */
  bgColor?: string;
  /** Custom text/icon color (overrides variant) */
  color?: string;
  /** Custom icon size class (overrides size variant) */
  iconSize?: string;
}

const IconRenderer = ({
  iconName,
  size,
  variant,
  className,
  bgColor,
  color,
  iconSize,
  ...props
}: IconRendererProps) => {
  const defaultIconSize = size ? iconSizes[size] : iconSizes.default;
  const finalIconSize = iconSize || defaultIconSize;

  const customStyles =
    bgColor || color
      ? {
          ...(bgColor && { backgroundColor: bgColor }),
          ...(color && { color: color }),
        }
      : undefined;

  return (
    <div className={cn(iconRendererVariants({ size, variant }), className)} style={customStyles} {...props}>
      <DynamicIcon
        name={iconName ? (iconName as IconName) : 'dot'}
        className={cn(finalIconSize, customStyles?.color && 'text-current')}
      />
    </div>
  );
};

export { IconRenderer, iconRendererVariants };
export type { IconRendererProps };
