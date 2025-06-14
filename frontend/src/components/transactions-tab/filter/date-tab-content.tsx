import FilterTabHeader from "./filter-tab-header";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Filter } from "./types";

interface DateTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const DatePicker = ({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

const DateTabContent = ({ filters, setFilters }: DateTabContentProps) => {
  return (
    <div className="space-y-3">
      <FilterTabHeader title="Date" />

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            From Date
          </Label>
          <DatePicker
            date={
              filters.dateRange.from
                ? new Date(filters.dateRange.from)
                : undefined
            }
            setDate={(date) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  from: date ? date.toISOString() : "",
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
            date={
              filters.dateRange.to ? new Date(filters.dateRange.to) : undefined
            }
            setDate={(date) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  to: date ? date.toISOString() : "",
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
