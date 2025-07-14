import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService, type TagActivity, type MonthlyTagActivity } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';
import TagActivityPopover from './tag-activity-popover';
import { IconRenderer } from '../icon-renderer';
import { cn } from '@/lib/utils';
import { TagChip } from '../tag-chip';
import transactionUtils from '@/lib/transaction-utils';

interface TagActivityProps {
  selectedDate: Date;
}

interface TagActivityBarProps {
  tag: TagActivity;
  percentage: number;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  date: Date;
}

const TagActivityBar = ({ tag, percentage, popoverOpen, onPopoverOpenChange, date }: TagActivityBarProps) => {
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
    <TagActivityPopover tagData={tag} open={popoverOpen} onOpenChange={onPopoverOpenChange} date={date}>
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
    </TagActivityPopover>
  );
};

const TagActivityView = ({ selectedDate }: TagActivityProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    tagsWithTransactions: TagActivity[];
    maxAbsoluteAmount: number;
  } | null>(null);

  useEffect(() => {
    fetchTagActivity();
  }, [selectedDate]);

  const fetchTagActivity = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getTagActivity(selectedDate.getMonth() + 1, selectedDate.getFullYear());
      setMeta(getMeta(response.data));
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

  const getMeta = (data: MonthlyTagActivity | null) => {
    if (!data) {
      return {
        tagsWithTransactions: [],
        maxAbsoluteAmount: 0,
      };
    }

    // Filter to only show tags with transactions
    const tagsWithTransactions = data.data.filter((tag) => tag.totalTransactionCount > 0);

    // Calculate max absolute amount for percentage calculation
    const maxAbsoluteAmount = Math.max(...tagsWithTransactions.map((tag) => Math.abs(tag.totalAmount)));

    return {
      tagsWithTransactions,
      maxAbsoluteAmount,
    };
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-md">Tag Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={fetchTagActivity}>
          <div className="space-y-2">
            {meta?.tagsWithTransactions.map((tag) => {
              const percentage =
                meta?.maxAbsoluteAmount > 0 ? (Math.abs(tag.totalAmount) / meta?.maxAbsoluteAmount) * 100 : 0;

              return (
                <TagActivityBar
                  key={tag.id}
                  tag={tag}
                  percentage={percentage}
                  popoverOpen={popoverOpen && selectedTag === tag.id}
                  onPopoverOpenChange={(open) => handlePopoverOpenChange(tag.id, open)}
                  date={selectedDate}
                />
              );
            })}

            {meta?.tagsWithTransactions.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No tagged transactions found for this month
                </p>
              </div>
            )}
          </div>
        </AsyncStateWrapper>
      </CardContent>
    </Card>
  );
};

export default TagActivityView;
