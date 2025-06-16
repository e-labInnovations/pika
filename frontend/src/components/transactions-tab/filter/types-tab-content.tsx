import { CircleCheck } from "lucide-react";
import FilterTabHeader from "./filter-tab-header";
import { useState } from "react";
import SearchItem from "./search-item";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type Filter } from "./types";
import type { TransactionType } from "@/data/types";
import { transactionTypes } from "@/data/transaction-types";

interface TypesTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const TypesTabContent = ({ filters, setFilters }: TypesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter functions for search within tabs
  const getFilteredTypes = () => {
    return transactionTypes.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Select/Unselect all functions
  const handleSelectAllTypes = () => {
    const allSelected = getFilteredTypes().length === filters.types.length;
    setFilters((prev: Filter) => ({
      ...prev,
      types: allSelected ? [] : getFilteredTypes().map((type) => type.id),
    }));
  };

  const handleTypeToggle = (typeId: TransactionType) => {
    setFilters((prev: Filter) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((id: string) => id !== typeId)
        : [...prev.types, typeId],
    }));
  };

  return (
    <div className="space-y-3">
      <FilterTabHeader
        title="Transaction Types"
        handleSelectAll={handleSelectAllTypes}
        isAllSelected={
          filters.types.length === getFilteredTypes().length
            ? true
            : filters.types.length > 0
            ? "indeterminate"
            : false
        }
      />

      {/* Search within types */}
      <SearchItem
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search types..."
      />

      <div className="grid grid-cols-1 gap-2">
        {getFilteredTypes().map((type) => {
          const Icon = type.icon;
          return (
            <CheckboxPrimitive.Root
              key={type.id}
              checked={filters.types.includes(type.id)}
              onCheckedChange={() => handleTypeToggle(type.id)}
              className={cn(
                "relative ring-[0.25px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground",
                "data-[state=checked]:ring-[1.5px] data-[state=checked]:ring-primary data-[state=checked]:text-primary",
                "hover:bg-accent/50"
              )}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    type.bgColor
                  )}
                >
                  <Icon className={cn("w-4 h-4", type.color)} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{type.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
              <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
                <CircleCheck className="fill-primary text-primary-foreground" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          );
        })}
      </div>
    </div>
  );
};

export default TypesTabContent;
