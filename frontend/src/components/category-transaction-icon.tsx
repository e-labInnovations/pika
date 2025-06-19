import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import TransactionUtils, { type TransactionType } from '@/lib/transaction-utils';

const iconRendererVariants = cva('flex relative items-center justify-center rounded-full shrink-0', {
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

const sizeVariants = {
  xs: {
    icon: 'h-2 w-2',
    transactionIcon: 'h-2 w-2',
    transactionIconPosition: '-right-0.5 -bottom-0.5',
  },
  sm: {
    icon: 'h-3 w-3',
    transactionIcon: 'h-3 w-3',
    transactionIconPosition: '-right-0.5 -bottom-0.5',
  },
  default: {
    icon: 'h-4 w-4',
    transactionIcon: 'h-4 w-4',
    transactionIconPosition: '-right-1 -bottom-1',
  },
  md: {
    icon: 'h-5 w-5',
    transactionIcon: 'h-5 w-5',
    transactionIconPosition: '-right-1 -bottom-1',
  },
  lg: {
    icon: 'h-6 w-6',
    transactionIcon: 'h-6 w-6',
    transactionIconPosition: '-right-1.5 -bottom-1.5',
  },
  xl: {
    icon: 'h-8 w-8',
    transactionIcon: 'h-8 w-8',
    transactionIconPosition: '-right-2 -bottom-2',
  },
} as const;

interface CategoryTransactionIconProps extends VariantProps<typeof iconRendererVariants> {
  /** The transaction type */
  transactionType: TransactionType;
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

const CategoryTransactionIcon = ({
  transactionType,
  iconName,
  size,
  variant,
  className,
  bgColor,
  color,
  iconSize,
  ...props
}: CategoryTransactionIconProps) => {
  const defaultIconSize = size ? sizeVariants[size].icon : sizeVariants.default.icon;
  const finalIconSize = iconSize || defaultIconSize;
  const transactionIconSize = size ? sizeVariants[size].transactionIcon : sizeVariants.default.transactionIcon;
  const transactionIconPosition = size
    ? sizeVariants[size].transactionIconPosition
    : sizeVariants.default.transactionIconPosition;
  const transactionIcon = TransactionUtils.typesObject[transactionType].icon;
  const transactionIconColor = TransactionUtils.typesObject[transactionType].color;

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
      <div
        className={cn(
          'absolute flex items-center justify-center rounded-full bg-white dark:bg-slate-800',
          transactionIconPosition,
          transactionIconSize,
          transactionIconColor,
        )}
      >
        <DynamicIcon name={transactionIcon as IconName} className="h-[80%] w-[80%]" />
      </div>
    </div>
  );
};

export { CategoryTransactionIcon };
