import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  CircleCheck,
} from "lucide-react";
import FilterTabHeader from "./filter-tab-header";
import { useState } from "react";
import SearchItem from "./search-item";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

type TransactionType = {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
};

interface Filters {
  types: string[];
}

const transactionTypes: TransactionType[] = [
  {
    id: "income",
    name: "Income",
    description: "Money received",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
    icon: ArrowDownLeft,
  },
  {
    id: "expense",
    name: "Expense",
    description: "Money spent",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
    icon: ArrowUpRight,
  },
  {
    id: "transfer",
    name: "Transfer",
    description: "Money moved between accounts",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    icon: ArrowRightLeft,
  },
];

interface TypesTabContentProps {
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
}

const TypesTabContent = ({ filters, setFilters }: TypesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Select/Unselect all functions
  const handleSelectAllTypes = () => {
    const allSelected = transactionTypes.length === filters.types.length;
    setFilters((prev: Filters) => ({
      ...prev,
      types: allSelected ? [] : transactionTypes.map((type) => type.id),
    }));
  };

  const handleTypeToggle = (typeId: string) => {
    setFilters((prev: Filters) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((id: string) => id !== typeId)
        : [...prev.types, typeId],
    }));
  };

  // Filter functions for search within tabs
  const getFilteredTypes = () => {
    return transactionTypes.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-3">
      <FilterTabHeader
        title="Transaction Types"
        handleSelectAll={handleSelectAllTypes}
        isAllSelected={
          filters.types.length === transactionTypes.length
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
