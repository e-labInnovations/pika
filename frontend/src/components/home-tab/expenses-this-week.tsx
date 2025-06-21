import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DayExpenseBar from './day-expense-bar';

interface ExpensesThisWeekProps {
  weeklyExpenses: Array<{ day: string; amount: number }>;
}
const ExpensesThisWeek = ({ weeklyExpenses }: ExpensesThisWeekProps) => {
  const maxExpense = Math.max(...weeklyExpenses.map((e) => e.amount));

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-md">Expenses This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {weeklyExpenses.map((day) => {
            const barHeight = (day.amount / maxExpense) * 100;

            return (
              <DayExpenseBar percentage={barHeight} day={day.day} amount={`${day.amount}`} progressColor="bg-red-500" />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesThisWeek;
