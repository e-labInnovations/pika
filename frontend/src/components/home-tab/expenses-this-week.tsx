import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DayExpenseBar from './day-expense-bar';
import { type WeeklyExpenses } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';
import { useWeeklyExpenses } from '@/hooks/queries';

const ExpensesThisWeek = () => {
  const [weeklyExpenses, setWeeklyExpenses] = useState<WeeklyExpenses>();
  const [maxExpense, setMaxExpense] = useState(0);

  const { data: weeklyExpensesData, isLoading, error, refetch } = useWeeklyExpenses();

  useEffect(() => {
    if (weeklyExpensesData) {
      setWeeklyExpenses(weeklyExpensesData);
      setMaxExpense(Math.max(...Object.values(weeklyExpensesData || {})));
    }
  }, [weeklyExpensesData]);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-md">Expenses This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={refetch}>
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {Object.entries(weeklyExpenses || {}).map(([day, amount]) => {
              const barHeight = (amount / maxExpense) * 100;

              return (
                <DayExpenseBar
                  key={day}
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
