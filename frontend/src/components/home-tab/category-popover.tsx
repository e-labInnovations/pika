import { DynamicIcon } from '@/components/lucide';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import type { CategorySpending } from '@/services/api/analytics.service';
import { useNavigate } from 'react-router-dom';
import { IconRenderer } from '../icon-renderer';
import transactionUtils from '@/lib/transaction-utils';
import { TagChip } from '../tag-chip';
import { cn } from '@/lib/utils';

interface CategoryPopoverProps {
  children: React.ReactNode;
  categoryData: CategorySpending;
  open: boolean;
  date: Date;
  onOpenChange: (open: boolean) => void;
}

const CategoryPopover = ({ children, categoryData, open, onOpenChange, date }: CategoryPopoverProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewTransactions = (categoryId: string, date: Date) => {
    // Use the first day of the month at 12:00AM and last day at 11:59PM, both as epoch
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1, 0, 0, 0, 0); // 1st day, 12:00AM
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // last day, 11:59:59.999PM

    navigate(`/transactions?categories=${categoryId}&dateFrom=${startDate.getTime()}&dateTo=${endDate.getTime()}`);
    onOpenChange(false);
  };

  const handleEditCategory = (categoryId: string) => {
    navigate(`/settings/categories/${categoryId}/edit`);
    onOpenChange(false);
  };

  const formatAmount = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.settings?.currency, {
      showSymbol: true,
      showDecimal: true,
    });
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit" align="center">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <IconRenderer
              iconName={categoryData.categoryIcon}
              size="sm"
              bgColor={categoryData.categoryBgColor}
              color={categoryData.categoryColor}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h4 className="flex-1 text-sm font-medium">{categoryData.categoryName}</h4>
                <TagChip
                  name={transactionUtils.getCountLabel(categoryData.transactionCount)}
                  color="#ffffff"
                  size="xs"
                  bgColor={categoryData.categoryBgColor}
                />
              </div>
              <span className="text-muted-foreground text-xs font-medium">{categoryData.description}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            {/* Total Amount */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium">Total Spent</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {formatAmount(categoryData.amount)}
              </span>
            </div>

            {/* Average per Transaction */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-1.5">
                <DynamicIcon name="trending-down" className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-muted-foreground text-xs">Average</span>
              </div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {formatAmount(categoryData.averagePerTransaction)}
              </span>
            </div>

            {/* Highest Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Highest</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(categoryData.highestTransaction)}
              </span>
            </div>

            {/* Lowest Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Lowest</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(categoryData.lowestTransaction)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleViewTransactions(categoryData.categoryId, date)}
              className={cn('h-8', !categoryData.isSystem ? 'flex-1' : 'w-full')}
              variant="outline"
              size="sm"
            >
              <DynamicIcon name="eye" className="mr-1.5 h-3 w-3" />
              <span className="text-xs">View All</span>
            </Button>

            {!categoryData.isSystem && (
              <Button
                onClick={() => handleEditCategory(categoryData.categoryId)}
                className="h-8 flex-1"
                variant="outline"
                size="sm"
              >
                <DynamicIcon name="pencil" className="mr-1.5 h-3 w-3" />
                <span className="text-xs">Edit Category</span>
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPopover;
