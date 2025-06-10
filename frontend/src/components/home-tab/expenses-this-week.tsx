import { Card, CardContent } from "@/components/ui/card";

interface ExpensesThisWeekProps {
  weeklyExpenses: Array<{ day: string; amount: number }>;
}
const ExpensesThisWeek = ({ weeklyExpenses }: ExpensesThisWeekProps) => {
  const maxExpense = Math.max(...weeklyExpenses.map((e) => e.amount));

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Expenses This Week
      </h3>
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-end justify-between h-32 space-x-2">
            {weeklyExpenses.map((expense, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-md relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-md transition-all duration-500 ease-out"
                    style={{
                      height: `${(expense.amount / maxExpense) * 80}px`,
                      minHeight: "8px",
                    }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {expense.day}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  ${expense.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesThisWeek;
