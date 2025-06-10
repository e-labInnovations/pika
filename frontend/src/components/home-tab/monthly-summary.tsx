import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Transaction } from "@/data/dummy-data";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface MonthlySummaryProps {
  transactions: Transaction[];
}
const MonthlySummary = ({ transactions }: MonthlySummaryProps) => {
  const [currentMonth, setCurrentMonth] = useState("November 2024");

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const currentDate = new Date();
    return (
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const monthlyData = {
    income: monthlyIncome,
    expenses: monthlyExpenses,
    balance: monthlyIncome - monthlyExpenses,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Monthly Summary
        </h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-[120px] text-center">
            {currentMonth}
          </span>
          <Button variant="ghost" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  Income
                </span>
              </div>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                $
                {monthlyData.income.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  Expenses
                </span>
              </div>
              <span className="text-lg font-semibold text-red-500 dark:text-red-400">
                $
                {monthlyData.expenses.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  Net Balance
                </span>
              </div>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                $
                {monthlyData.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlySummary;
