import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DayExpenseBar from "./day-expense-bar";

interface ExpensesThisWeekProps {
  weeklyExpenses: Array<{ day: string; amount: number }>;
}
const ExpensesThisWeek = ({ weeklyExpenses }: ExpensesThisWeekProps) => {
  const maxExpense = Math.max(...weeklyExpenses.map((e) => e.amount));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Expenses This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 mb-4">
          {weeklyExpenses.map((day) => {
            const barHeight = (day.amount / maxExpense) * 100;

            return (
              <DayExpenseBar
                percentage={barHeight}
                day={day.day}
                amount={`$${day.amount}`}
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
