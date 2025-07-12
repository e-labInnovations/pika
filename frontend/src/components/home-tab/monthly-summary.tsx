import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import SummaryCard from './summary-card';
import { analyticsService, type MonthlySummary } from '@/services/api';
import transactionUtils from '@/lib/transaction-utils';
import AsyncStateWrapper from '../async-state-wrapper';

interface MonthlySummaryViewProps {
  selectedDate: Date;
}

const MonthlySummaryView = ({ selectedDate }: MonthlySummaryViewProps) => {
  const { user } = useAuth();
  const [monthlySummaryData, setMonthlySummaryData] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedDate]);

  const fetchMonthlyData = () => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    setIsLoading(true);
    setError(null);
    analyticsService
      .getMonthlySummary(month, year)
      .then((response) => {
        setMonthlySummaryData(response.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatCurrency = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.settings?.currency);
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return TrendingUp;
    if (balance < 0) return TrendingDown;
    return DollarSign;
  };

  const getBalanceBgColor = (balance: number) => {
    if (balance > 0) return 'bg-emerald-500';
    if (balance < 0) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={fetchMonthlyData}>
      {monthlySummaryData && (
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-semibold text-slate-900 dark:text-white">Monthly Summary</h3>

          <div className="space-y-4">
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              <SummaryCard
                title="Income"
                subtitle={transactionUtils.getCountLabel(monthlySummaryData.incomeTransactionCount)}
                amount={monthlySummaryData.income}
                icon={TrendingUp}
                iconBgColor="bg-emerald-500"
                amountColor="text-emerald-600 dark:text-emerald-400"
              />

              <SummaryCard
                title="Expenses"
                subtitle={transactionUtils.getCountLabel(monthlySummaryData.expenseTransactionCount)}
                amount={monthlySummaryData.expenses}
                icon={TrendingDown}
                iconBgColor="bg-red-500"
                amountColor="text-red-500 dark:text-red-400"
              />

              <SummaryCard
                title="Balance"
                subtitle={
                  monthlySummaryData.balance > 0 ? 'Surplus' : monthlySummaryData.balance < 0 ? 'Deficit' : 'Even'
                }
                amount={monthlySummaryData.balance}
                icon={getBalanceIcon(monthlySummaryData.balance)}
                iconBgColor={getBalanceBgColor(monthlySummaryData.balance)}
                amountColor={transactionUtils.getBalanceColor(monthlySummaryData.balance)}
              />
            </div>

            {/* Summary Stats - Full Width Row */}
            <Card className="gap-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 py-3 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Monthly Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <div className="flex items-center text-center">
                  <div className="flex grow flex-col items-center">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Savings Rate</p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {monthlySummaryData.savingsRate}%
                    </p>
                  </div>
                  <div className="flex grow flex-col items-center">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Avg. Daily</p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {formatCurrency(monthlySummaryData.avgDaily)}
                    </p>
                  </div>
                  <div className="flex grow flex-col items-center">
                    <p className="text-xs text-blue-700 dark:text-blue-300">Total Txns</p>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {monthlySummaryData.transactionCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AsyncStateWrapper>
  );
};

export default MonthlySummaryView;
