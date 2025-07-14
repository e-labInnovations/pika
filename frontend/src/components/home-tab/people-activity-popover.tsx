import { Eye, TrendingUp, TrendingDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import type { PersonActivity } from '@/services/api/analytics.service';
import { useNavigate } from 'react-router-dom';
import transactionUtils from '@/lib/transaction-utils';
import { TagChip } from '../tag-chip';
import { cn, getInitials } from '@/lib/utils';

interface PeopleActivityPopoverProps {
  children: React.ReactNode;
  personData: PersonActivity;
  open: boolean;
  date: Date;
  onOpenChange: (open: boolean) => void;
}

const PeopleActivityPopover = ({ children, personData, open, onOpenChange, date }: PeopleActivityPopoverProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewTransactions = (personId: string, date: Date) => {
    // Use the first day of the month at 12:00AM and last day at 11:59PM, both as epoch
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1, 0, 0, 0, 0); // 1st day, 12:00AM
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // last day, 11:59:59.999PM

    navigate(`/transactions?people=${personId}&dateFrom=${startDate.getTime()}&dateTo=${endDate.getTime()}`);
    onOpenChange(false);
  };

  const handleViewProfile = (personId: string) => {
    navigate(`/people/${personId}`);
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
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={personData.avatarUrl || undefined} alt={personData.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                {getInitials(personData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="flex-1 text-sm font-medium">{personData.name}</h4>
                <TagChip
                  name={transactionUtils.getCountLabel(personData.totalTransactionCount)}
                  color="#ffffff"
                  size="xs"
                  bgColor="#6366f1"
                />
              </div>
              <span className="text-muted-foreground text-xs font-medium">{personData.description}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            {/* Overall Balance */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium">Overall Balance</span>
              <div className="text-right">
                <span
                  className={cn('text-sm font-semibold', transactionUtils.getBalanceColor(personData.balance, true))}
                >
                  {personData.balance === 0 ? 'Even' : formatAmount(Math.abs(personData.balance), false)}
                </span>
                {personData.balance !== 0 && (
                  <p className="text-muted-foreground text-xs">{personData.balance > 0 ? 'You owe' : 'Owes you'}</p>
                )}
              </div>
            </div>

            {/* Monthly Net Amount */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium">This Month</span>
              <span className={cn('text-sm font-semibold', transactionUtils.getBalanceColor(personData.totalAmount))}>
                {formatAmount(personData.totalAmount)}
              </span>
            </div>

            {/* Monthly Breakdown */}
            {personData.incomeAmount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-1.5">
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-muted-foreground text-xs">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {formatAmount(personData.incomeAmount, false)}
                  </span>
                  <span className="text-muted-foreground text-xs">({personData.incomeTransactionCount})</span>
                </div>
              </div>
            )}

            {personData.expenseAmount > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-1.5">
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  <span className="text-muted-foreground text-xs">Expenses</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    {formatAmount(personData.expenseAmount, false)}
                  </span>
                  <span className="text-muted-foreground text-xs">({personData.expenseTransactionCount})</span>
                </div>
              </div>
            )}

            {/* Average per Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Average</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(personData.averagePerTransaction, false)}
              </span>
            </div>

            {/* Transaction Range */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Range</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {formatAmount(personData.lowestTransaction, false)} -{' '}
                {formatAmount(personData.highestTransaction, false)}
              </span>
            </div>

            {/* Last Transaction */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs">Last Activity</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {personData.lastTransactionAt ? transactionUtils.formatDate(personData.lastTransactionAt) : 'Never'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleViewTransactions(personData.id, date)}
              className="h-8 flex-1"
              variant="outline"
              size="sm"
            >
              <Eye className="mr-1.5 h-3 w-3" />
              <span className="text-xs">View All</span>
            </Button>

            <Button onClick={() => handleViewProfile(personData.id)} className="h-8 flex-1" variant="outline" size="sm">
              <User className="mr-1.5 h-3 w-3" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PeopleActivityPopover;
