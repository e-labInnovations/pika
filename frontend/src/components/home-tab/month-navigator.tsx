import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MonthYearPicker } from '../ui/month-year-picker';

interface MonthNavigatorProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const MonthNavigator = ({ selectedDate, onChangeDate }: MonthNavigatorProps) => {
  const handleChangeMonth = (action: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (action === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onChangeDate(newDate);
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <Button
        variant="outline"
        size="icon"
        className="relative top-0 left-0 size-8 translate-x-0 translate-y-0 rounded-full"
        onClick={() => handleChangeMonth('prev')}
      >
        <ArrowLeft />
      </Button>

      <MonthYearPicker value={selectedDate} onChange={onChangeDate} />

      <Button
        variant="outline"
        size="icon"
        className="relative top-0 right-0 size-8 translate-x-0 translate-y-0 rounded-full"
        onClick={() => handleChangeMonth('next')}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default MonthNavigator;
