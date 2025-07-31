import { Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import type { DailySummary } from '@/services/api/analytics.service';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import transactionUtils from '@/lib/transaction-utils';
import { DynamicIcon } from '@/components/lucide';

interface DayPopoverProps {
  children: React.ReactNode;
  dayData: DailySummary | null;
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DayPopover = ({ children, dayData, date, open, onOpenChange }: DayPopoverProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewTransactions = (date: Date) => {
    // Use epoch timestamps for start (12:00am) and end (11:59:59pm) of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const startDateFilter = startOfDay.getTime();
    const endDateFilter = endOfDay.getTime();
    navigate(`/transactions?dateFrom=${startDateFilter}&dateTo=${endDateFilter}`);
    onOpenChange(false);
  };

  const formatAmount = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.settings.currency, {
      showSymbol: true,
      showDecimal: true,
    });
  };

  if (!dayData) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-72" align="center">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <h4 className="text-sm font-medium">
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h4>
            </div>
            <Separator />
            <div className="text-muted-foreground py-2 text-center text-xs">No transactions recorded</div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit" align="center">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <h4 className="text-sm font-medium">
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h4>
            </div>
            <span className="text-muted-foreground text-xs font-medium">
              {transactionUtils.getCountLabel(dayData.transactionCount)}
            </span>
          </div>

          <Separator />

          <div className="space-y-2">
            {/* Balance */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium">Net Balance</span>
              <span className={cn('text-sm font-semibold', transactionUtils.getBalanceColor(dayData.balance))}>
                {formatAmount(dayData.balance)}
              </span>
            </div>

            {/* Income */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-1.5">
                <DynamicIcon
                  name={transactionUtils.getIcon('income')}
                  className={cn('h-3 w-3', transactionUtils.getAmountColor('income'))}
                />
                <span className="text-muted-foreground text-xs">Income</span>
                <span className={cn('text-xs font-medium', transactionUtils.getAmountColor('income'))}>
                  ({dayData.incomeTransactionCount})
                </span>
              </div>
              <span className={cn('text-xs font-medium', transactionUtils.getAmountColor('income'))}>
                {formatAmount(dayData.income)}
              </span>
            </div>

            {/* Expenses */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-1.5">
                <DynamicIcon
                  name={transactionUtils.getIcon('expense')}
                  className={cn('h-3 w-3', transactionUtils.getAmountColor('expense'))}
                />
                <span className="text-muted-foreground text-xs">Expenses</span>
                <span className={cn('text-xs font-medium', transactionUtils.getAmountColor('expense'))}>
                  ({dayData.expenseTransactionCount})
                </span>
              </div>
              <span className={cn('text-xs font-medium', transactionUtils.getAmountColor('expense'))}>
                {formatAmount(Math.abs(dayData.expenses))}
              </span>
            </div>

            {/* Transfers */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-1.5">
                <DynamicIcon
                  name={transactionUtils.getIcon('transfer')}
                  className={cn('h-3 w-3', transactionUtils.getAmountColor('transfer'))}
                />
                <span className="text-muted-foreground text-xs">Transfers</span>
                <span className={cn('text-xs font-medium', transactionUtils.getAmountColor('transfer'))}>
                  ({dayData.transferTransactionCount})
                </span>
              </div>
              <span className={cn('text-xs font-medium', transactionUtils.getAmountColor('transfer'))}>
                {formatAmount(dayData.transfers)}
              </span>
            </div>
          </div>

          <Button onClick={() => handleViewTransactions(date)} className="h-8 w-full" variant="outline" size="sm">
            <Eye className="mr-1.5 h-3 w-3" />
            <span className="text-xs">View All</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DayPopover;
