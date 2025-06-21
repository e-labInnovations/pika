import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DayExpenseBar from './day-expense-bar';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface ExpensesThisWeekProps {
  weeklyExpenses: Array<{ day: string; amount: number }>;
}
const ExpensesThisWeek = ({ weeklyExpenses }: ExpensesThisWeekProps) => {
  const maxExpense = Math.max(...weeklyExpenses.map((e) => e.amount));
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Expenses This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10">
          {weeklyExpenses.map((day) => {
            const barHeight = (day.amount / maxExpense) * 100;

            return (
              <DayExpenseBar
                percentage={barHeight}
                day={day.day}
                amount={currencyUtils.formatAmount(day.amount, user?.default_currency)}
                progressColor="bg-red-500"
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesThisWeek;
