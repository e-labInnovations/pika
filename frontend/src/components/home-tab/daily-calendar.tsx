import { useState, useEffect } from 'react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService, type DailySummaries, type DailySummary } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';
import DayPopover from './day-popover';
import { Minus, Equal } from 'lucide-react';

interface DailyCalendarProps {
  selectedDate: Date;
}

const DailyCalendar = ({ selectedDate }: DailyCalendarProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [dailySummaries, setDailySummaries] = useState<DailySummaries | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    getDailyExpenses();
  }, [selectedDate]);

  const getDailyExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getDailySummaries(
        selectedDate.getMonth() + 1,
        selectedDate.getFullYear(),
      );
      setDailySummaries(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaySummary = (date: Date) => {
    // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    return dailySummaries?.data[dateKey];
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    setPopoverOpen(true);
  };

  const renderDayContent = (daySummary: DailySummary | undefined, amount: number) => {
    // If there's a non-zero balance, show the formatted amount
    if (amount !== 0) {
      return (
        <span className={transactionUtils.getBalanceColor(amount)}>
          {currencyUtils.formatAmount(amount, user?.settings.currency, {
            showSymbol: false,
            showDecimal: false,
            showNegative: false,
            showEmptyForZero: true,
          })}
        </span>
      );
    }

    // If balance is zero but there are transactions, show balanced indicator
    if (daySummary && daySummary.transactionCount > 0) {
      return (
        <div className="flex items-center justify-center">
          <Equal className="text-muted-foreground h-2 w-2" />
        </div>
      );
    }

    // If balance is zero and no transactions, show no activity indicator
    return (
      <div className="flex items-center justify-center">
        <Minus className="text-muted-foreground/40 h-1.5 w-1.5" />
      </div>
    );
  };

  return (
    <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={getDailyExpenses} className="min-h-[430px]">
      <Calendar
        mode="single"
        selected={undefined}
        month={selectedDate}
        onSelect={() => {
          // Remove this handler since we're handling clicks in DayButton
        }}
        className="bg-background w-full rounded-md border"
        required
        hideNavigation={true}
        fixedWeeks={true}
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            const daySummary = getDaySummary(day.date);
            const amount = daySummary?.balance || 0;
            const isCurrentSelectedDay = selectedDay !== null && selectedDay.toDateString() === day.date.toDateString();

            return (
              <DayPopover
                open={popoverOpen && isCurrentSelectedDay}
                onOpenChange={(open) => {
                  if (!open) {
                    setPopoverOpen(false);
                    setSelectedDay(null);
                  }
                }}
                date={day.date}
                dayData={daySummary || null}
              >
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  {...props}
                  onClick={(e) => {
                    if (!modifiers.outside) {
                      handleDaySelect(day.date);
                    }
                    // Call original onClick if it exists
                    if (props.onClick) {
                      props.onClick(e);
                    }
                  }}
                >
                  {children}
                  {!modifiers.outside && renderDayContent(daySummary, amount)}
                  {modifiers.outside && <span aria-label="Outside day">&nbsp;</span>}
                </CalendarDayButton>
              </DayPopover>
            );
          },
        }}
      />
    </AsyncStateWrapper>
  );
};

export default DailyCalendar;
