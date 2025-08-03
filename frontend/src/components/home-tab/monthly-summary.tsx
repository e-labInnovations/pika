import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicIcon, type IconName } from '@/components/lucide';
import { useState, useEffect } from 'react';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import SummaryCard from './summary-card';
import { type MonthlySummary } from '@/services/api';
import transactionUtils from '@/lib/transaction-utils';
import AsyncStateWrapper from '../async-state-wrapper';
import { useMonthlySummary } from '@/hooks/queries';

interface MonthlySummaryViewProps {
  selectedDate: Date;
}

const MonthlySummaryView = ({ selectedDate }: MonthlySummaryViewProps) => {
  const { user } = useAuth();
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);

  const {
    data: monthlySummaryData,
    isLoading,
    error,
    refetch,
  } = useMonthlySummary(selectedDate.getMonth() + 1, selectedDate.getFullYear());

  useEffect(() => {
    if (monthlySummaryData) {
      setMonthlySummary(monthlySummaryData);
    }
  }, [monthlySummaryData]);

  const formatCurrency = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.settings?.currency);
  };

  const getBalanceIcon = (balance: number): IconName => {
    if (balance > 0) return 'trending-up';
    if (balance < 0) return 'trending-down';
    return 'dollar-sign';
  };

  const getBalanceBgColor = (balance: number) => {
    if (balance > 0) return 'bg-emerald-500';
    if (balance < 0) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-md font-semibold text-slate-900 dark:text-white">Monthly Summary</h3>

      <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={refetch} className="w-full rounded-md border">
        {monthlySummary && (
          <div className="space-y-4">
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              <SummaryCard
                title="Income"
                subtitle={transactionUtils.getCountLabel(monthlySummary.incomeTransactionCount)}
                amount={monthlySummary.income}
                iconName="trending-up"
                iconBgColor="bg-emerald-500"
                amountColor="text-emerald-600 dark:text-emerald-400"
              />

              <SummaryCard
                title="Expenses"
                subtitle={transactionUtils.getCountLabel(monthlySummary.expenseTransactionCount)}
                amount={monthlySummary.expenses}
                iconName="trending-down"
                iconBgColor="bg-red-500"
                amountColor="text-red-500 dark:text-red-400"
              />

              <SummaryCard
                title="Balance"
                subtitle={monthlySummary.balance > 0 ? 'Surplus' : monthlySummary.balance < 0 ? 'Deficit' : 'Even'}
                amount={monthlySummary.balance}
                iconName={getBalanceIcon(monthlySummary.balance)}
                iconBgColor={getBalanceBgColor(monthlySummary.balance)}
                amountColor={transactionUtils.getBalanceColor(monthlySummary.balance)}
              />
            </div>

            {/* Summary Stats - Full Width Row */}
            <Card className="gap-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 py-3 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DynamicIcon name="bar-chart-3" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Monthly Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <div className="flex items-center text-center">
                  <div className="flex grow flex-col items-center">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Savings Rate</p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {monthlySummary.savingsRate}%
                    </p>
                  </div>
                  <div className="flex grow flex-col items-center">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Avg. Daily</p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {formatCurrency(monthlySummary.avgDaily)}
                    </p>
                  </div>
                  <div className="flex grow flex-col items-center">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Total Txns</p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {monthlySummary.transactionCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </AsyncStateWrapper>
    </div>
  );
};

export default MonthlySummaryView;
