import { useState, useEffect } from 'react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService, type DailyExpenses } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';

interface DailyCalendarProps {
  selectedDate: Date;
}

const DailyCalendar = ({ selectedDate }: DailyCalendarProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpenses | null>(null);

  useEffect(() => {
    getDailyExpenses();
  }, [selectedDate]);

  const getDailyExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getDailyExpenses(selectedDate.getMonth() + 1, selectedDate.getFullYear());
      setDailyExpenses(response.data);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const getDayExpenses = (date: Date) => {
    return dailyExpenses?.data[date.toISOString().split('T')[0]];
  };

  return (
    <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={getDailyExpenses} className="min-h-[430px]">
      <Calendar
        mode="single"
        selected={undefined}
        month={selectedDate}
        onSelect={(selectedDate, triggerDate, modifiers, e) => {
          console.log('🚀 ~ DailyCalendar ~ modifiers:', modifiers);
          console.log('🚀 ~ DailyCalendar ~ triggerDate:', triggerDate);
          console.log('🚀 ~ DailyCalendar ~ selectedDate:', selectedDate);
          console.log('🚀 ~ DailyCalendar ~ e:', e);
        }}
        className="bg-background w-full rounded-md border"
        required
        hideNavigation={true}
        fixedWeeks={true}
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            const dayExpenses = getDayExpenses(day.date);
            const amount = dayExpenses?.balance || 0;
            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                {!modifiers.outside && (
                  <span className={transactionUtils.getBalanceColor(amount)}>
                    {currencyUtils.formatAmount(amount, user?.settings.currency, {
                      showSymbol: false,
                      showDecimal: false,
                      showNegative: false,
                      showEmptyForZero: true,
                    })}
                  </span>
                )}
              </CalendarDayButton>
            );
          },
        }}
      />
    </AsyncStateWrapper>
  );
};

export default DailyCalendar;
