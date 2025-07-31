import FilterTabHeader from './filter-tab-header';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { defaultFilterValues, type Filter } from './types';
import { DateTimePicker } from '@/components/datetime-picker';
import { subMonths, subYears, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

interface DateTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const DateTabContent = ({ filters, setFilters }: DateTabContentProps) => {
  const setDatePreset = (months?: number, years?: number, preset?: 'thisMonth' | 'pastMonth') => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (preset === 'thisMonth') {
      startDate = startOfMonth(now);
      endDate = endOfDay(now);
    } else if (preset === 'pastMonth') {
      const lastMonth = subMonths(now, 1);
      startDate = startOfMonth(lastMonth);
      endDate = endOfMonth(lastMonth);
    } else if (years) {
      startDate = startOfDay(subYears(now, years));
      endDate = endOfDay(now);
    } else if (months) {
      startDate = startOfDay(subMonths(now, months));
      endDate = endOfDay(now);
    } else {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      dateRange: {
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      },
    }));
  };

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="Date"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: defaultFilterValues.dateRange,
                }))
              }
            >
              Clear
            </Button>
          }
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-col gap-2 p-1">
        <Label className="text-sm font-medium">Quick Select</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDatePreset(undefined, undefined, 'thisMonth')}
            className="text-xs"
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDatePreset(undefined, undefined, 'pastMonth')}
            className="text-xs"
          >
            Past Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDatePreset(1)} className="text-xs">
            1 Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDatePreset(3)} className="text-xs">
            3 Months
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDatePreset(6)} className="text-xs">
            6 Months
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDatePreset(undefined, 1)} className="text-xs">
            1 Year
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            From Date
          </Label>
          <DateTimePicker
            className="flex flex-col"
            value={filters.dateRange.from ? new Date(filters.dateRange.from) : undefined}
            onChange={(date) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  from: date ? date.toISOString() : '',
                },
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            To Date
          </Label>
          <DateTimePicker
            className="flex flex-col"
            value={filters.dateRange.to ? new Date(filters.dateRange.to) : undefined}
            onChange={(date) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  to: date ? date.toISOString() : '',
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DateTabContent;
