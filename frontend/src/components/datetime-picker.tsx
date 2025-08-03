import { useState } from 'react';
import { format } from 'date-fns';
import { DynamicIcon } from '@/components/lucide';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({ value, onChange, disabled, className }: DateTimePickerProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      onChange(undefined);
      setDateOpen(false);
      return;
    }

    if (value) {
      // Preserve existing time
      const updatedDate = new Date(newDate);
      updatedDate.setHours(value.getHours(), value.getMinutes(), 0, 0);
      onChange(updatedDate);
    } else {
      // Set time to current time if no existing value
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      onChange(newDate);
    }
    setDateOpen(false);
  };

  // Handle time change
  const handleTimeChange = (hours: number, minutes: number, isPM: boolean) => {
    const baseDate = value || new Date();
    const newDate = new Date(baseDate);

    // Convert 12-hour to 24-hour format
    let hour24 = hours;
    if (isPM && hours !== 12) {
      hour24 = hours + 12;
    } else if (!isPM && hours === 12) {
      hour24 = 0;
    }

    newDate.setHours(hour24, minutes, 0, 0);
    onChange(newDate);
  };

  // Set to current date and time
  const handleSetNow = () => {
    const now = new Date();
    now.setSeconds(0, 0); // Remove seconds and milliseconds
    onChange(now);
    setDateOpen(false);
    setTimeOpen(false);
  };

  // Format display values
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return format(date, 'MMM d, yyyy');
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return 'Select time';
    return format(date, 'h:mm a');
  };

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const currentHour12 = value ? value.getHours() % 12 || 12 : 12;
  const currentMinute = value ? value.getMinutes() : 0;
  const currentIsPM = value ? value.getHours() >= 12 : false;

  return (
    <div className={cn('flex gap-2', className)}>
      {/* Date Picker */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn('w-fit justify-between font-normal', !value && 'text-muted-foreground')}
          >
            <DynamicIcon name="calendar" className="mr-2 h-4 w-4" />
            {formatDate(value)}
            <DynamicIcon name="chevron-down" className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 pb-0">
            <Button variant="outline" size="sm" onClick={handleSetNow} className="mb-2 w-full">
              Set Now
            </Button>
          </div>
          <Calendar mode="single" className="pt-0" selected={value} onSelect={handleDateChange} month={value} />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <Popover open={timeOpen} onOpenChange={setTimeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn('w-fit justify-between font-normal', !value && 'text-muted-foreground')}
          >
            <DynamicIcon name="clock" className="mr-2 h-4 w-4" />
            {formatTime(value)}
            <DynamicIcon name="chevron-down" className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2">
            <Button variant="outline" size="sm" onClick={handleSetNow} className="mb-2 w-full">
              Set Now
            </Button>
          </div>
          <div className="flex h-48 overflow-hidden">
            {/* Hours */}
            <ScrollArea className="w-16">
              <div className="p-1">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={currentHour12 === hour ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 w-full justify-center text-sm"
                    onClick={() => handleTimeChange(hour, currentMinute, currentIsPM)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Minutes */}
            <ScrollArea className="w-16">
              <div className="p-1">
                {minutes
                  .filter((m) => m % 5 === 0)
                  .map((minute) => (
                    <Button
                      key={minute}
                      variant={currentMinute === minute ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 w-full justify-center text-sm"
                      onClick={() => handleTimeChange(currentHour12, minute, currentIsPM)}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
              </div>
            </ScrollArea>

            {/* AM/PM */}
            <div className="flex w-16 flex-col gap-1 p-1">
              <Button
                variant={!currentIsPM ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-full text-sm"
                onClick={() => handleTimeChange(currentHour12, currentMinute, false)}
              >
                AM
              </Button>
              <Button
                variant={currentIsPM ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-full text-sm"
                onClick={() => handleTimeChange(currentHour12, currentMinute, true)}
              >
                PM
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
