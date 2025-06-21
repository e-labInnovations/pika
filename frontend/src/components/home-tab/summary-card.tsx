import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface SummaryCardProps {
  title: string;
  subtitle?: string;
  amount: number;
  icon: LucideIcon;
  iconBgColor: string;
  amountColor: string;
  currency?: string;
}

const SummaryCard = ({ title, subtitle, amount, icon: Icon, iconBgColor, amountColor, currency }: SummaryCardProps) => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return currencyUtils.formatAmount(amount, currency || user?.default_currency);
  };

  return (
    <Card className="border-slate-200 bg-white/70 py-3 backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70">
      <CardContent className="p-2">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${iconBgColor}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{title}</span>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <span className={`text-sm font-semibold ${amountColor}`}>{formatCurrency(amount)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
