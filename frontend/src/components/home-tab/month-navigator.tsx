import { ArrowLeft, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthNavigatorProps {
  selectedDate: Date;
  onChangeDate: (action: 'prev' | 'next') => void;
}

const MonthNavigator = ({ selectedDate, onChangeDate }: MonthNavigatorProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button
        variant="outline"
        size="icon"
        className="relative top-0 left-0 size-8 translate-x-0 translate-y-0 rounded-full"
        onClick={() => onChangeDate('prev')}
      >
        <ArrowLeft />
      </Button>
      <div className="flex min-w-[140px] items-center justify-center space-x-2">
        <CalendarIcon className="h-4 w-4 text-slate-600 dark:text-slate-200" />
        <span className="grow text-center text-sm font-medium text-slate-600 dark:text-slate-200">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="relative top-0 right-0 size-8 translate-x-0 translate-y-0 rounded-full"
        onClick={() => onChangeDate('next')}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default MonthNavigator;
