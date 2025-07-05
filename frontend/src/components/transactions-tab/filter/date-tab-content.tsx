import FilterTabHeader from './filter-tab-header';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { defaultFilterValues, type Filter } from './types';
import DatePicker from '@/components/date-picker';

interface DateTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const DateTabContent = ({ filters, setFilters }: DateTabContentProps) => {
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

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            From Date
          </Label>
          <DatePicker
            date={filters.dateRange.from ? new Date(filters.dateRange.from) : undefined}
            setDate={(date) =>
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
          <DatePicker
            date={filters.dateRange.to ? new Date(filters.dateRange.to) : undefined}
            setDate={(date) =>
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
