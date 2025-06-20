import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const tagChipVariants = cva('inline-flex items-center gap-1 rounded-full border-0', {
  variants: {
    size: {
      xs: 'px-1.5 py-0.5',
      sm: 'px-2 py-1',
      default: 'px-2.5 py-1',
      md: 'px-3 py-1.5',
      lg: 'px-3.5 py-2',
      xl: 'px-4 py-2.5',
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
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  default: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4.5 w-4.5',
  xl: 'h-5 w-5',
} as const;

const textSizes = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  default: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-base',
} as const;

interface TagChipProps extends VariantProps<typeof tagChipVariants> {
  /** The tag name to display */
  name: string;
  /** The lucide icon name */
  iconName?: string | IconName;
  /** Additional CSS classes */
  className?: string;
  /** Custom background color (overrides variant) */
  bgColor?: string;
  /** Custom text/icon color (overrides variant) */
  color?: string;
  /** Custom icon size class (overrides size variant) */
  iconSize?: string;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether the tag is clickable */
  clickable?: boolean;
}

const TagChip = ({
  name,
  iconName,
  size,
  variant,
  className,
  bgColor,
  color,
  iconSize,
  showIcon = true,
  onClick,
  clickable = false,
  ...props
}: TagChipProps) => {
  const defaultIconSize = size ? iconSizes[size] : iconSizes.default;
  const finalIconSize = iconSize || defaultIconSize;
  const textSize = size ? textSizes[size] : textSizes.default;

  const customStyles =
    bgColor || color
      ? {
          ...(bgColor && { backgroundColor: bgColor }),
          ...(color && { color: color }),
        }
      : undefined;

  return (
    <span
      className={cn(
        tagChipVariants({ size, variant }),
        textSize,
        clickable && 'cursor-pointer transition-colors hover:opacity-80',
        className,
      )}
      style={customStyles}
      onClick={onClick}
      {...props}
    >
      {showIcon && iconName && (
        <DynamicIcon name={iconName as IconName} className={cn(finalIconSize, customStyles?.color && 'text-current')} />
      )}
      <span className="font-medium">{name}</span>
    </span>
  );
};

export { TagChip, tagChipVariants };
export type { TagChipProps };
