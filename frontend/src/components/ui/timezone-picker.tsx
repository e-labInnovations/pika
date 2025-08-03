import { useState, useMemo } from 'react';
import { DynamicIcon } from '@/components/lucide';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment-timezone';

interface TimezonePickerProps {
  value?: string;
  onValueChange?: (timezone: string) => void;
  placeholder?: string;
}

const formatTimezone = (timezone: string): string => {
  const now = moment();
  const tz = moment.tz(now, timezone);
  const offset = tz.format('Z'); // Gets offset in format +05:30 or -08:00
  const abbr = tz.format('z'); // Gets timezone abbreviation like EST, PST, IST

  // Get city name from timezone (last part after /)
  const parts = timezone.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');

  // Format as "New York (EST GMT-05:00)" or "Kolkata (IST GMT+05:30)"
  return `${city} (${abbr} GMT${offset})`;
};

const getCurrentTimezone = (): string => {
  return moment.tz.guess() || 'UTC';
};

// Create timezone data with search keywords
const createTimezoneData = (timezone: string) => {
  const now = moment();
  const tz = moment.tz(now, timezone);
  const offset = tz.format('Z');
  const abbr = tz.format('z');
  const parts = timezone.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  const region = parts[0];

  return {
    id: timezone,
    city,
    region,
    offset,
    abbr,
    displayName: `${city} (${abbr} GMT${offset})`,
    searchKeywords: `${timezone} ${city} ${region} ${abbr} ${offset}`.toLowerCase(),
    isDST: tz.isDST(),
  };
};

export function TimezonePicker({ value, onValueChange, placeholder = 'Select timezone...' }: TimezonePickerProps) {
  const [open, setOpen] = useState(false);
  const currentTimezone = getCurrentTimezone();

  const groupedTimezones = useMemo(() => {
    const allTimezones = moment.tz.names();
    const timezoneData = allTimezones.map(createTimezoneData);

    // Group timezones by region
    const groups: { [key: string]: typeof timezoneData } = {};
    timezoneData.forEach((tz) => {
      if (!groups[tz.region]) {
        groups[tz.region] = [];
      }
      groups[tz.region].push(tz);
    });

    // Sort groups and timezones within groups
    const sortedGroups: { [key: string]: typeof timezoneData } = {};
    Object.keys(groups)
      .sort()
      .forEach((region) => {
        sortedGroups[region] = groups[region].sort((a, b) => a.city.localeCompare(b.city));
      });

    return sortedGroups;
  }, []);

  const selectedTimezone = value || currentTimezone;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <DynamicIcon name="globe" className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">{selectedTimezone ? formatTimezone(selectedTimezone) : placeholder}</span>
          </div>
          <DynamicIcon name="chevrons-up-down" className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search timezone, city, or abbreviation..." />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>

            {/* Current timezone */}
            <CommandGroup heading="Current">
              <CommandItem
                value={`${currentTimezone} ${formatTimezone(currentTimezone)}`}
                onSelect={() => {
                  onValueChange?.(currentTimezone);
                  setOpen(false);
                }}
              >
                <DynamicIcon
                  name="check"
                  className={cn('mr-2 h-4 w-4', selectedTimezone === currentTimezone ? 'opacity-100' : 'opacity-0')}
                />
                <DynamicIcon name="globe" className="mr-2 h-4 w-4 opacity-50" />
                <div className="flex flex-col">
                  <span className="font-medium">{formatTimezone(currentTimezone)}</span>
                  <span className="text-muted-foreground text-xs">{currentTimezone}</span>
                </div>
              </CommandItem>
            </CommandGroup>

            {/* All timezones grouped by region */}
            {Object.entries(groupedTimezones).map(([region, timezones]) => (
              <CommandGroup key={region} heading={region}>
                {timezones.map((tz) => (
                  <CommandItem
                    key={tz.id}
                    value={tz.searchKeywords}
                    onSelect={() => {
                      onValueChange?.(tz.id);
                      setOpen(false);
                    }}
                  >
                    <DynamicIcon
                      name="check"
                      className={cn('mr-2 h-4 w-4', selectedTimezone === tz.id ? 'opacity-100' : 'opacity-0')}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tz.displayName}</span>
                        {tz.isDST && (
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            DST
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">{tz.id}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
