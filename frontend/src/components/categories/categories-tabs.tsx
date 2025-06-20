import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import TransactionUtils, { type TransactionType } from '@/lib/transaction-utils';

interface CategoriesTabsProps {
  tabContents: {
    id: TransactionType;
    content: React.ReactNode;
  }[];
  onTabChange: (transactionType: TransactionType) => void;
  tabValue: TransactionType;
}

const CategoriesTabs = ({ tabContents, onTabChange, tabValue }: CategoriesTabsProps) => {
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
    <Tabs defaultValue={tabValue} className="w-full" onValueChange={(value) => onTabChange(value as TransactionType)}>
      <TabsList className="w-full p-1">
        {TransactionUtils.types.map((transactionType) => (
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
      {tabContents.map((tabContent: { id: TransactionType; content: React.ReactNode }) => (
        <TabsContent key={tabContent.id} value={tabContent.id}>
          {tabContent.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoriesTabs;
