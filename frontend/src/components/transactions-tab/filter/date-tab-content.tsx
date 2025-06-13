import { Input } from "@/components/ui/input";
import React from "react";
import FilterTabHeader from "./filter-tab-header";
import { Label } from "@/components/ui/label";

interface DateTabContentProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const DateTabContent = ({ filters, setFilters }: DateTabContentProps) => {
  return (
    <div className="space-y-3">
      <FilterTabHeader title="Date" />

      <div className="space-y-4">
        <div>
          <Label htmlFor="date-from">From Date</Label>
          <Input
            id="date-from"
            type="date"
            value={filters.dateRange.from}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  from: e.target.value,
                },
              }))
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="date-to">To Date</Label>
          <Input
            id="date-to"
            type="date"
            value={filters.dateRange.to}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: {
                  ...prev.dateRange,
                  to: e.target.value,
                },
              }))
            }
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTabContent;
