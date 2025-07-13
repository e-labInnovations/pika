import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MonthYearPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function MonthYearPicker({ value, onChange, disabled, className }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [tempYear, setTempYear] = useState(value.getFullYear());

  const currentMonth = value.getMonth();
  const currentYear = value.getFullYear();

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(value);
    newDate.setMonth(monthIndex);
    onChange(newDate);
    setOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setTempYear(year);
    setViewMode('month');
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? tempYear - 1 : tempYear + 1;
    setTempYear(newYear);
  };

  const handleYearConfirm = () => {
    const newDate = new Date(value);
    newDate.setFullYear(tempYear);
    onChange(newDate);
    setOpen(false);
  };

  // Generate years around current year
  const startYear = currentYear - 50;
  const endYear = currentYear + 50;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-1 h-4 w-4" />
          {value.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" align="center">
        <div className="p-3">
          {viewMode === 'month' ? (
            <>
              {/* Year selector header */}
              <div className="mb-3 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => handleYearChange('prev')} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('year')}
                  className="h-8 px-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {tempYear}
                </Button>

                <Button variant="outline" size="sm" onClick={() => handleYearChange('next')} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((month, index) => (
                  <Button
                    key={month}
                    variant={currentMonth === index ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      'h-8 text-xs font-medium',
                      currentMonth === index && 'bg-primary text-primary-foreground',
                    )}
                  >
                    {month.substring(0, 3)}
                  </Button>
                ))}
              </div>

              {/* Apply year change button if year was changed */}
              {tempYear !== currentYear && (
                <div className="mt-3 border-t pt-3">
                  <Button size="sm" onClick={handleYearConfirm} className="h-8 w-full">
                    Apply Year {tempYear}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Year selection mode */}
              <div className="mb-3 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => setViewMode('month')} className="h-8 px-3 text-sm">
                  ← Back
                </Button>
                <span className="text-sm font-medium">Select Year</span>
              </div>

              {/* Year grid */}
              <div className="grid max-h-48 grid-cols-4 gap-1 overflow-y-auto">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={currentYear === year ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      'h-8 text-xs font-medium',
                      currentYear === year && 'bg-primary text-primary-foreground',
                    )}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
