import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DateTimePicker } from '@/components/datetime-picker';
import { DynamicIcon } from '@/components/lucide';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from 'usehooks-ts';
import { subMonths, subYears, startOfDay, endOfDay, startOfMonth, endOfMonth, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  trigger?: React.ReactNode;
  className?: string;
  title?: string;
}

const DateRangePicker = ({
  value,
  onChange,
  trigger,
  className,
  title = 'Select Date Range',
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const isDesktop = useMediaQuery('(min-width: 768px)');

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

    const newRange = {
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    };

    setTempRange(newRange);
    onChange(newRange);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(value);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  const getDisplayText = () => {
    if (!value.from && !value.to) return 'Select date range';
    if (value.from && value.to) {
      return `${formatDisplayDate(value.from)} - ${formatDisplayDate(value.to)}`;
    }
    if (value.from) {
      return `From ${formatDisplayDate(value.from)}`;
    }
    if (value.to) {
      return `Until ${formatDisplayDate(value.to)}`;
    }
    return 'Select date range';
  };

  const content = (
    <div className="flex h-full flex-col gap-4">
      {/* Preset Buttons */}
      <div className="flex flex-col gap-3">
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

      {/* Custom Date Selection */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">From Date</Label>
          <div className="flex flex-row items-center justify-between">
            <DateTimePicker
              className="flex flex-row"
              value={tempRange.from ? new Date(tempRange.from) : undefined}
              onChange={(date) =>
                setTempRange((prev) => ({
                  ...prev,
                  from: date ? date.toISOString() : '',
                }))
              }
            />
            <Button
              variant="outline"
              size="sm"
              disabled={!tempRange.from}
              onClick={() => setTempRange((prev) => ({ ...prev, from: '' }))}
              className="text-muted-foreground hover:text-foreground h-6 w-6 p-0 text-xs"
            >
              <DynamicIcon name="x" className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">To Date</Label>
          <div className="flex flex-row items-center justify-between">
            <DateTimePicker
              className="flex flex-row"
              value={tempRange.to ? new Date(tempRange.to) : undefined}
              onChange={(date) =>
                setTempRange((prev) => ({
                  ...prev,
                  to: date ? date.toISOString() : '',
                }))
              }
            />
            <Button
              variant="outline"
              size="sm"
              disabled={!tempRange.to}
              onClick={() => setTempRange((prev) => ({ ...prev, to: '' }))}
              className="text-muted-foreground hover:text-foreground h-6 w-6 p-0 text-xs"
            >
              <DynamicIcon name="x" className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );

  const defaultTrigger = (
    <Button variant="outline" className={cn('flex items-center gap-2', className)}>
      <DynamicIcon name="calendar" className="h-4 w-4" />
      <span className="">{getDisplayText()}</span>
      <DynamicIcon name="chevron-down" className="h-4 w-4" />
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default DateRangePicker;
