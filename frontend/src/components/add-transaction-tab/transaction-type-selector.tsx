import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transactionTypes } from '@/data/transaction-types';
import type { TransactionType } from '@/data/types';
import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}

const TransactionTypeSelector = ({ value, onChange }: TransactionTypeSelectorProps) => {
  const getTabColorClasses = (transactionType: TransactionType) => {
    switch (transactionType) {
      case 'income':
        return 'data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900 data-[state=active]:text-white';
      case 'expense':
        return 'data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900 data-[state=active]:text-white';
      case 'transfer':
        return 'data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-white';
    }
  };

  return (
    <Tabs defaultValue={value} className="w-full" onValueChange={(value) => onChange(value as TransactionType)}>
      <TabsList className="w-full p-1">
        {transactionTypes.map((transactionType) => (
          <TabsTrigger
            key={transactionType.id}
            value={transactionType.id}
            className={cn('px-2.5 sm:px-3', transactionType.color, getTabColorClasses(transactionType.id))}
          >
            <DynamicIcon name={transactionType.icon as IconName} className="h-4 w-4" />
            {transactionType.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TransactionTypeSelector;
