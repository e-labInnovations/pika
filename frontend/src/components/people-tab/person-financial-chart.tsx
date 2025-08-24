import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicIcon } from '@/components/lucide';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '@/provider/theme-provider';
import type { Person } from '@/services/api';
import { usePersonTransactionSummary } from '@/hooks/queries';
import AsyncStateWrapper from '../async-state-wrapper';
import { useState } from 'react';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import ChartNoData from '@/components/ui/chart-no-data';

interface PersonFinancialChartProps {
  person: Person;
}

const chartConfig = {
  expense: {
    label: 'Expenses',
    dataKey: 'expense',
    color: '#ef4444',
  },
  income: {
    label: 'Income',
    dataKey: 'income',
    color: '#10b981',
  },
  balance: {
    label: 'Balance',
    dataKey: 'balance',
    color: '#3b82f6',
  },
};

const PersonFinancialChart = ({ person }: PersonFinancialChartProps) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [timeBucket, setTimeBucket] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const { data: personTransactionSummary, isLoading, error } = usePersonTransactionSummary(person.id, timeBucket);

  const formatDate = (date: string, timeBucket: string) => {
    const dateObj = new Date(date);
    if (timeBucket === 'daily') {
      return dateObj.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      });
    }

    if (timeBucket === 'weekly') {
      return dateObj.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      });
    }

    if (timeBucket === 'monthly') {
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });
    }
    if (timeBucket === 'yearly') {
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
      });
    }
    return date;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DynamicIcon name="trending-up" className="h-4 w-4" />
              Financial Overview
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              Track expenses, income, and balance trends with {person?.name ?? ''}
            </p>
          </div>
        </div>

        {/* Time Bucket Picker */}
        <div className="bg-background flex w-fit items-center gap-1 rounded-lg border p-1">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((bucket) => (
            <button
              key={bucket}
              onClick={() => setTimeBucket(bucket)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                timeBucket === bucket
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {bucket.charAt(0).toUpperCase() + bucket.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <AsyncStateWrapper isLoading={isLoading} error={error}>
          {!personTransactionSummary?.data || personTransactionSummary.data.length === 0 ? (
            <ChartNoData
              title="No Financial Data Available"
              description={`No transaction data found for ${person?.name ?? 'this person'} in the selected time period`}
              icon="trending-up"
              className="h-64 sm:h-72 md:h-80"
            />
          ) : (
            <div className="h-64 w-full sm:h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={personTransactionSummary.data} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
                  <CartesianGrid
                    strokeDasharray="2 2"
                    className="stroke-slate-200 dark:stroke-slate-700"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="period"
                    className="text-xs text-slate-600 dark:text-slate-400"
                    tick={{ fontSize: 10 }}
                    tickMargin={5}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => {
                      if (typeof value === 'string') {
                        return formatDate(value, timeBucket);
                      }
                      return value;
                    }}
                  />
                  <YAxis
                    className="text-xs text-slate-600 dark:text-slate-400"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) =>
                      currencyUtils.formatAmount(value, user?.settings?.currency, {
                        showDecimal: false,
                      })
                    }
                    tickMargin={5}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? 'rgb(30 41 59)' : 'rgb(255 255 255)',
                      border: `1px solid ${isDarkMode ? 'rgb(51 65 85)' : 'rgb(226 232 240)'}`,
                      borderRadius: '6px',
                      color: isDarkMode ? 'rgb(248 250 252)' : 'rgb(15 23 42)',
                      fontSize: '12px',
                      padding: '10px 12px',
                      boxShadow: isDarkMode
                        ? '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)'
                        : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      backdropFilter: 'none',
                      WebkitBackdropFilter: 'none',
                    }}
                    formatter={(value: number) => currencyUtils.formatAmount(value, user?.settings?.currency)}
                    labelFormatter={(value) => formatDate(value, timeBucket)}
                    labelStyle={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isDarkMode ? 'rgb(148 163 184)' : 'rgb(100 116 139)',
                      marginBottom: '4px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: '11px',
                      paddingTop: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartConfig.expense.dataKey}
                    stroke={chartConfig.expense.color}
                    strokeWidth={1.5}
                    dot={{ fill: chartConfig.expense.color, strokeWidth: 1, r: 2 }}
                    activeDot={{ r: 4, stroke: chartConfig.expense.color, strokeWidth: 1.5 }}
                    name={chartConfig.expense.label}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartConfig.income.dataKey}
                    stroke={chartConfig.income.color}
                    strokeWidth={1.5}
                    dot={{ fill: chartConfig.income.color, strokeWidth: 1, r: 2 }}
                    activeDot={{ r: 4, stroke: chartConfig.income.color, strokeWidth: 1.5 }}
                    name={chartConfig.income.label}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartConfig.balance.dataKey}
                    stroke={chartConfig.balance.color}
                    strokeWidth={1.5}
                    dot={{ fill: chartConfig.balance.color, strokeWidth: 1, r: 2 }}
                    activeDot={{ r: 4, stroke: chartConfig.balance.color, strokeWidth: 1.5 }}
                    name={chartConfig.balance.label}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </AsyncStateWrapper>
      </CardContent>
    </Card>
  );
};

export default PersonFinancialChart;
