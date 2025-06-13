import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight } from "lucide-react";
import FilterTabHeader from "./filter-tab-header";
import { useState } from "react";
import SearchItem from "./search-item";
import { cn } from "@/lib/utils";

type TransactionType = {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
};

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
  filters: any;
  setFilters: any;
}

const TypesTabContent = ({ filters, setFilters }: TypesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Select/Unselect all functions
  const handleSelectAllTypes = () => {
    const allSelected = transactionTypes.length === filters.types.length;
    setFilters((prev: any) => ({
      ...prev,
      types: allSelected ? [] : transactionTypes.map((type) => type.id),
    }));
  };

  const handleTypeToggle = (typeId: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((id) => id !== typeId)
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

      <div className="space-y-2">
        {getFilteredTypes().map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                filters.types.includes(type.id)
                  ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
              onClick={() => handleTypeToggle(type.id)}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  type.bgColor
                )}
              >
                <Icon className={cn("w-4 h-4", type.color)} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {type.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {type.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TypesTabContent;
