import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { monthlySummaryData, type MonthlyData } from '@/data/monthly-summary-data';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import SummaryCard from './summary-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

const MonthlySummary = () => {
  const { user } = useAuth();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    // Use the pre-generated data for consistency
    setMonthlyData(monthlySummaryData);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const currentMonthData = monthlyData[current - 1] || monthlyData[monthlyData.length - 1];

  const formatCurrency = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.default_currency);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (balance < 0) return 'text-red-500 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
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

  if (!currentMonthData) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Carousel setApi={setApi} className="w-full">
        {/* Header inside Carousel but outside CarouselContent */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-md font-semibold text-slate-900 dark:text-white">Monthly Summary</h3>
          <div className="flex items-center space-x-2">
            <CarouselPrevious className="relative top-0 left-0 translate-x-0 translate-y-0" />
            <div className="flex min-w-[140px] items-center justify-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="grow text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {currentMonthData.month} {currentMonthData.year}
              </span>
            </div>
            <CarouselNext className="relative top-0 right-0 translate-x-0 translate-y-0" />
          </div>
        </div>

        <CarouselContent>
          {monthlyData.map((monthData, index) => (
            <CarouselItem key={index}>
              <div className="space-y-4">
                {/* Summary Cards Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <SummaryCard
                    title="Income"
                    subtitle={`${monthData.transactionCount} txns`}
                    amount={monthData.income}
                    icon={TrendingUp}
                    iconBgColor="bg-emerald-500"
                    amountColor="text-emerald-600 dark:text-emerald-400"
                  />

                  <SummaryCard
                    title="Expenses"
                    subtitle={`${monthData.transactionCount} txns`}
                    amount={monthData.expenses}
                    icon={TrendingDown}
                    iconBgColor="bg-red-500"
                    amountColor="text-red-500 dark:text-red-400"
                  />

                  <SummaryCard
                    title="Balance"
                    subtitle={monthData.balance > 0 ? 'Surplus' : monthData.balance < 0 ? 'Deficit' : 'Even'}
                    amount={monthData.balance}
                    icon={getBalanceIcon(monthData.balance)}
                    iconBgColor={getBalanceBgColor(monthData.balance)}
                    amountColor={getBalanceColor(monthData.balance)}
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
                          {monthData.income > 0 ? Math.round((monthData.balance / monthData.income) * 100) : 0}%
                        </p>
                      </div>
                      <div className="flex grow flex-col items-center">
                        <p className="text-xs text-blue-700 dark:text-blue-300">Avg. Daily</p>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {formatCurrency(monthData.expenses / 30)}
                        </p>
                      </div>
                      <div className="flex grow flex-col items-center">
                        <p className="text-xs text-blue-700 dark:text-blue-300">Total Txns</p>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {monthData.transactionCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default MonthlySummary;
