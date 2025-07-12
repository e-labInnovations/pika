import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface DayExpenseBarProps {
  percentage: number;
  day: string;
  amount: string;
  className?: string;
  progressColor?: string;
}

const DayExpenseBar = ({ percentage, day, amount, className, progressColor }: DayExpenseBarProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    setAnimatedPercentage(0);

    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 50);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={cn('flex flex-col items-center', className)} role="group" aria-label={`Expenses for ${day}`}>
      <div className="text-muted-foreground mb-1 text-xs font-medium" aria-hidden="true">
        {currencyUtils.formatAmount(amount, user?.settings?.currency, {
          showSymbol: false,
          showDecimal: false,
          showNegative: false,
        })}
      </div>
      <div
        className="bg-muted relative h-40 w-4 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={animatedPercentage}
        aria-label={`${animatedPercentage}% of expenses for ${day}`}
      >
        <div
          className={cn(
            'absolute bottom-0 w-full rounded-b-full transition-all duration-1000 ease-out',
            progressColor || 'bg-primary',
          )}
          style={{ height: `${animatedPercentage}%` }}
        />
      </div>
      <div className="text-muted-foreground mt-1 text-xs font-medium" aria-hidden="true">
        {day}
      </div>
    </div>
  );
};

export default DayExpenseBar;
