// No more used, ToDo: Delete

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import AccountAvatar from './account-avatar';
import type { Account, Transaction } from '@/data/dummy-data';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
}

export function Dashboard({ accounts, transactions }: DashboardProps) {
  const [currentMonth, setCurrentMonth] = useState('November 2024');

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Calculate weekly expenses from real transactions
  const weeklyExpenses = [
    { day: 'Mon', amount: 45.5 },
    { day: 'Tue', amount: 120.0 },
    { day: 'Wed', amount: 85.25 },
    { day: 'Thu', amount: 200.0 },
    { day: 'Fri', amount: 95.75 },
    { day: 'Sat', amount: 180.5 },
    { day: 'Sun', amount: 65.0 },
  ];

  const maxExpense = Math.max(...weeklyExpenses.map((e) => e.amount));

  // Calculate monthly data from real transactions
  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const currentDate = new Date();
    return (
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const monthlyData = {
    income: monthlyIncome,
    expenses: monthlyExpenses,
    balance: monthlyIncome - monthlyExpenses,
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Accounts Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Accounts</h3>
          <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="cursor-pointer border-slate-200 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AccountAvatar account={account} size="md" />
                    <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      account.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    $
                    {Math.abs(account.balance).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Balance</span>
              <span className="text-xl font-bold">
                $
                {totalBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses This Week */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Expenses This Week</h3>
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardContent className="p-4">
            <div className="flex h-32 items-end justify-between space-x-2">
              {weeklyExpenses.map((expense, index) => (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <div className="relative w-full overflow-hidden rounded-t-md bg-slate-200 dark:bg-slate-700">
                    <div
                      className="rounded-t-md bg-gradient-to-t from-red-500 to-red-400 transition-all duration-500 ease-out"
                      style={{
                        height: `${(expense.amount / maxExpense) * 80}px`,
                        minHeight: '8px',
                      }}
                    />
                  </div>
                  <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">{expense.day}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">${expense.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Summary</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[120px] text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {currentMonth}
            </span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">Income</span>
                </div>
                <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  $
                  {monthlyData.income.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                    <TrendingDown className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">Expenses</span>
                </div>
                <span className="text-lg font-semibold text-red-500 dark:text-red-400">
                  $
                  {monthlyData.expenses.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">Net Balance</span>
                </div>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  $
                  {monthlyData.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
