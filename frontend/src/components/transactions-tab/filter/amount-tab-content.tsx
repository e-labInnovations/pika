import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FilterTabHeader from "./filter-tab-header";

interface AmountTabContentProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const AmountTabContent = ({ filters, setFilters }: AmountTabContentProps) => {
  const amountOperators = [
    { value: "between", label: "Between" },
    { value: "greater", label: "Greater than" },
    { value: "less", label: "Less than" },
    { value: "equal", label: "Equal to" },
    { value: "not_equal", label: "Not equal to" },
    { value: "greater_equal", label: "Greater than or equal to" },
    { value: "less_equal", label: "Less than or equal to" },
  ];

  return (
    <div className="space-y-3">
      <FilterTabHeader title="Amount" />
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="amount-operator" className="px-1">
            Condition
          </Label>
          <Select
            value={filters.amount.operator}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                amount: { ...prev.amount, operator: value as any },
              }))
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {amountOperators.map((operator) => (
                <SelectItem key={operator.value} value={operator.value}>
                  {operator.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="amount-value1" className="px-1">
            {filters.amount.operator === "between"
              ? "Minimum Amount"
              : "Amount"}
          </Label>
          <Input
            id="amount-value1"
            type="number"
            placeholder="0.00"
            value={filters.amount.value1}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                amount: { ...prev.amount, value1: e.target.value },
              }))
            }
            className="mt-1"
          />
        </div>
        {filters.amount.operator === "between" && (
          <div className="flex flex-col gap-3">
            <Label htmlFor="amount-value2" className="px-1">
              Maximum Amount
            </Label>
            <Input
              id="amount-value2"
              type="number"
              placeholder="0.00"
              value={filters.amount.value2 || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  amount: {
                    ...prev.amount,
                    value2: e.target.value,
                  },
                }))
              }
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AmountTabContent;
