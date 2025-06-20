import transactionUtils, { type TransactionType } from '@/lib/transaction-utils';
import { IconRenderer, iconRendererVariants } from './icon-renderer';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';

interface TransactionTypeViewProps extends VariantProps<typeof iconRendererVariants> {
  type: TransactionType;
  className?: string;
}

const TransactionTypeView = ({ type, className, size, variant }: TransactionTypeViewProps) => {
  const transactionType = transactionUtils.typesObject[type];
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <IconRenderer
        iconName={transactionType.icon}
        size={size}
        variant={variant}
        className={`${transactionType.bgColor} ${transactionType.color}`}
      />
      <div className="flex-1">
        <p className="font-medium">{transactionType.name}</p>
        <p className="text-muted-foreground text-sm">{transactionType.description}</p>
      </div>
    </div>
  );
};

export default TransactionTypeView;
