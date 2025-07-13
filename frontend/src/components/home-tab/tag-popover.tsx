import { Eye, TrendingUp, TrendingDown, ArrowUpDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import type { TagSpending } from '@/services/api/analytics.service';
import { useNavigate } from 'react-router-dom';
import transactionUtils from '@/lib/transaction-utils';
import { TagChip } from '../tag-chip';
import { IconRenderer } from '../icon-renderer';
import { cn } from '@/lib/utils';

interface TagPopoverProps {
  children: React.ReactNode;
  tagData: TagSpending;
  open: boolean;
  date: Date;
  onOpenChange: (open: boolean) => void;
}

const TagPopover = ({ children, tagData, open, onOpenChange, date }: TagPopoverProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewTransactions = (tagId: string, date: Date) => {
    // Use the first day of the month at 12:00AM and last day at 11:59PM, both as epoch
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1, 0, 0, 0, 0); // 1st day, 12:00AM
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // last day, 11:59:59.999PM

    navigate(`/transactions?tags=${tagId}&dateFrom=${startDate.getTime()}&dateTo=${endDate.getTime()}`);
    onOpenChange(false);
  };

  const handleEditTag = (tagId: string) => {
    navigate(`/settings/tags/${tagId}/edit`);
    onOpenChange(false);
  };

  const formatAmount = (amount: number, showSign: boolean = true) => {
    return currencyUtils.formatAmount(amount, user?.settings?.currency, {
      showSymbol: true,
      showDecimal: true,
      showNegative: showSign,
    });
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit" align="center">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <IconRenderer iconName={tagData.icon} size="sm" bgColor={tagData.bgColor} color={tagData.color} />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                <h4 className="flex-1 text-sm font-medium">{tagData.name}</h4>
                <TagChip
                  name={transactionUtils.getCountLabel(tagData.totalTransactionCount)}
                  color="#ffffff"
                  size="xs"
                  bgColor={tagData.bgColor}
                />
              </div>
              <span className="text-muted-foreground text-xs font-medium">{tagData.description}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            {/* Net Amount */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium">Net Amount</span>
              <span className={cn('text-sm font-semibold', transactionUtils.getBalanceColor(tagData.totalAmount))}>
                {formatAmount(tagData.totalAmount)}
              </span>
            </div>

            {/* Expense Amount */}
            {tagData.expenseAmount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-1.5">
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  <span className="text-muted-foreground text-xs">Expenses</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    {formatAmount(tagData.expenseAmount, false)}
                  </span>
                  <span className="text-muted-foreground text-xs">({tagData.expenseTransactionCount})</span>
                </div>
              </div>
            )}

            {/* Income Amount */}
            {tagData.incomeAmount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-1.5">
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-muted-foreground text-xs">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {formatAmount(tagData.incomeAmount, false)}
                  </span>
                  <span className="text-muted-foreground text-xs">({tagData.incomeTransactionCount})</span>
                </div>
              </div>
            )}

            {/* Transfer Amount */}
            {tagData.transferAmount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-1.5">
                  <ArrowUpDown className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-muted-foreground text-xs">Transfers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {formatAmount(tagData.transferAmount, false)}
                  </span>
                  <span className="text-muted-foreground text-xs">({tagData.transferTransactionCount})</span>
                </div>
              </div>
            )}

            {/* Average per Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Average</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(tagData.averagePerTransaction, false)}
              </span>
            </div>

            {/* Highest Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Highest</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(tagData.highestTransaction, false)}
              </span>
            </div>

            {/* Lowest Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Lowest</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(tagData.lowestTransaction, false)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleViewTransactions(tagData.id, date)}
              className={cn('h-8', !tagData.isSystem ? 'flex-1' : 'w-full')}
              variant="outline"
              size="sm"
            >
              <Eye className="mr-1.5 h-3 w-3" />
              <span className="text-xs">View All</span>
            </Button>

            {!tagData.isSystem && (
              <Button onClick={() => handleEditTag(tagData.id)} className="h-8 flex-1" variant="outline" size="sm">
                <Edit className="mr-1.5 h-3 w-3" />
                <span className="text-xs">Edit Tag</span>
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TagPopover;
