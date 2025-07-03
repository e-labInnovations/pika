import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DayExpenseBar from './day-expense-bar';
import { analyticsService, type WeeklyExpenses } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';

const ExpensesThisWeek = () => {
  const [weeklyExpensesData, setWeeklyExpensesData] = useState<WeeklyExpenses>();
  const maxExpense = Math.max(...Object.values(weeklyExpensesData || {}));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    analyticsService
      .getWeeklyExpenses()
      .then((response) => {
        setWeeklyExpensesData(response.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-md">Expenses This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <AsyncStateWrapper isLoading={isLoading} error={error}>
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {Object.entries(weeklyExpensesData || {}).map(([day, amount]) => {
              const barHeight = (amount / maxExpense) * 100;

              return (
                <DayExpenseBar
                  percentage={barHeight}
                  day={day.charAt(0).toUpperCase() + day.slice(1)}
                  amount={amount}
                  progressColor="bg-red-500"
                />
              );
            })}
          </div>
        </AsyncStateWrapper>
      </CardContent>
    </Card>
  );
};

export default ExpensesThisWeek;
