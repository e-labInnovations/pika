import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService, type TagSpending, type MonthlyTagSpending } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';
import TagPopover from './tag-popover';
import { IconRenderer } from '../icon-renderer';
import { cn } from '@/lib/utils';
import { TagChip } from '../tag-chip';
import transactionUtils from '@/lib/transaction-utils';

interface TagSpendingProps {
  selectedDate: Date;
}

interface TagSpendingBarProps {
  tag: TagSpending;
  percentage: number;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  date: Date;
}

const TagSpendingBar = ({ tag, percentage, popoverOpen, onPopoverOpenChange, date }: TagSpendingBarProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    setAnimatedPercentage(0);
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 50);

    return () => clearTimeout(timer);
  }, [percentage]);

  const formatAmount = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.settings?.currency, {
      showSymbol: true,
      showDecimal: false,
      showNegative: true,
    });
  };

  return (
    <TagPopover tagData={tag} open={popoverOpen} onOpenChange={onPopoverOpenChange} date={date}>
      <div className="relative h-6 cursor-pointer">
        {/* Single Progress Bar Background */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Background with tag color */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: tag.bgColor,
              opacity: 0.2,
            }}
          />
          {/* Fill with full tag color */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${animatedPercentage}%`,
              backgroundColor: tag.bgColor,
            }}
          />
        </div>

        {/* Tag Icon and Name Section - Overlaid on Left */}
        <div className="absolute top-0 left-0 z-10 flex h-6 items-center gap-1 px-1 py-1">
          <IconRenderer iconName={tag.icon} size="xs" bgColor={tag.bgColor} color={tag.color} />
          <span className="text-sm font-medium" style={{ color: tag.color }}>
            {tag.name}
          </span>
        </div>

        {/* Amount Section - Overlaid on Right */}
        <div className="absolute top-0 right-0 z-10 flex h-6 items-center justify-center gap-1 px-1 py-1">
          <TagChip
            size="xs"
            name={formatAmount(tag.totalAmount)}
            className={cn('bg-white dark:bg-slate-900', transactionUtils.getBalanceColor(tag.totalAmount), 'text-xs')}
          />
        </div>
      </div>
    </TagPopover>
  );
};

const TagSpendingView = ({ selectedDate }: TagSpendingProps) => {
  const [tagSpendingData, setTagSpendingData] = useState<MonthlyTagSpending | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchTagSpending();
  }, [selectedDate]);

  const fetchTagSpending = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getTagSpending(selectedDate.getMonth() + 1, selectedDate.getFullYear());
      setTagSpendingData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopoverOpenChange = (tagId: string, open: boolean) => {
    if (open) {
      setSelectedTag(tagId);
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
      setSelectedTag(null);
    }
  };

  if (!tagSpendingData) {
    return null;
  }

  // Filter to only show tags with transactions
  const tagsWithTransactions = tagSpendingData.data.filter((tag) => tag.totalTransactionCount > 0);

  // Calculate max absolute amount for percentage calculation
  const maxAbsoluteAmount = Math.max(...tagsWithTransactions.map((tag) => Math.abs(tag.totalAmount)));

  return (
    <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={fetchTagSpending}>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-md">Tag Spending</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {tagsWithTransactions.map((tag) => {
              const percentage = maxAbsoluteAmount > 0 ? (Math.abs(tag.totalAmount) / maxAbsoluteAmount) * 100 : 0;

              return (
                <TagSpendingBar
                  key={tag.id}
                  tag={tag}
                  percentage={percentage}
                  popoverOpen={popoverOpen && selectedTag === tag.id}
                  onPopoverOpenChange={(open) => handlePopoverOpenChange(tag.id, open)}
                  date={selectedDate}
                />
              );
            })}

            {tagsWithTransactions.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No tagged transactions found for this month
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AsyncStateWrapper>
  );
};

export default TagSpendingView;
