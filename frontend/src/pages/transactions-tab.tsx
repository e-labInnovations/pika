import { TransactionsList } from "@/components/transactions-list";
import TabsLayout from "@/layouts/tabs";
import { useEffect, useState } from "react";
import {
  transactions as transactionsData,
  type Transaction,
} from "@/data/dummy-data";
import { Filter as FilterIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import TransactionsFilter from "@/components/transactions-tab/filter";
import {
  defaultFilterValues,
  type Filter,
  type FilterTab,
} from "@/components/transactions-tab/filter/types";
import TransactionsSort from "@/components/transactions-tab/sort";
import {
  defaultSort,
  type Sort,
} from "@/components/transactions-tab/sort/types";
import FilterSortBar from "@/components/transactions-tab/filter-sort-bar";
import SearchBar from "@/components/transactions-tab/search-bar";

interface RightActionsProps {
  showTransactionSearch: boolean;
  setShowTransactionSearch: (show: boolean) => void;
  showFilterModal: boolean;
  handleFilterOpen: () => void;
  showSortModal: boolean;
  setShowSortModal: (show: boolean) => void;
  filterCount: number;
}
const RightActions = ({
  showTransactionSearch,
  setShowTransactionSearch,
  handleFilterOpen,
  setShowSortModal,
  filterCount,
}: RightActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowTransactionSearch(!showTransactionSearch)}
      >
        <Search className="w-4 h-4" />
      </Button>

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 dark:text-slate-400"
          onClick={handleFilterOpen}
        >
          <FilterIcon className="w-4 h-4" />
        </Button>
        {filterCount > 0 && (
          <span className="absolute top-1 right-1 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
            {filterCount}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowSortModal(true)}
      >
        <ArrowDownUp className="w-4 h-4" />
      </Button>
    </div>
  );
};

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionSearch, setShowTransactionSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [filters, setFilters] = useState<Filter>(defaultFilterValues);
  const [sort, setSort] = useState<Sort>(defaultSort);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    return () => setTransactions(transactionsData);
  }, []);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ filters:", filters);
  }, [filters]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ sort:", sort);
  }, [sort]);

  const getFilterCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof Filter];
      return Array.isArray(value) && value.length > 0;
    }).length;
  };

  const clearSearchAndFilters = () => {
    setSearchTerm("");
    setFilters(defaultFilterValues);
    setSort(defaultSort);
    setShowTransactionSearch(false);
  };

  const handleFilterClick = (
    action: "open" | "remove",
    type: FilterTab,
    value: string
  ) => {
    if (action === "open") {
      setActiveFilterTab(type);
      setShowFilterModal(true);
    } else if (action === "remove") {
      if (type === "types") {
        setFilters((prev) => ({
          ...prev,
          types: prev.types.filter((t) => t !== value),
        }));
      } else if (type === "categories") {
        setFilters((prev) => ({
          ...prev,
          categories: prev.categories.filter((c) => c !== value),
        }));
      } else if (type === "tags") {
        setFilters((prev) => ({
          ...prev,
          tags: prev.tags.filter((t) => t !== value),
        }));
      } else if (type === "people") {
        setFilters((prev) => ({
          ...prev,
          people: prev.people.filter((p) => p !== value),
        }));
      }
    }
  };

  return (
    <TabsLayout
      header={{
        title: "Transactions",
        description: "Your financial transactions",
        rightActions: (
          <RightActions
            showTransactionSearch={showTransactionSearch}
            setShowTransactionSearch={setShowTransactionSearch}
            showFilterModal={showFilterModal}
            handleFilterOpen={() => handleFilterClick("open", "types", "")}
            showSortModal={showSortModal}
            setShowSortModal={setShowSortModal}
            filterCount={getFilterCount()}
          />
        ),
      }}
    >
      <FilterSortBar
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        onSortClick={() => setShowSortModal(true)}
        onFilterClick={handleFilterClick}
      />

      {showTransactionSearch && (
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchToggle={setShowTransactionSearch}
        />
      )}

      <TransactionsList
        transactions={transactions}
        searchTerm={searchTerm}
        onClearSearchAndFilters={clearSearchAndFilters}
        filters={filters}
        sort={sort}
      />

      <TransactionsFilter
        open={showFilterModal}
        setOpen={setShowFilterModal}
        filters={filters}
        setFilters={setFilters}
        defaultTab={activeFilterTab}
      />

      <TransactionsSort
        open={showSortModal}
        setOpen={setShowSortModal}
        sort={sort}
        setSort={setSort}
      />
    </TabsLayout>
  );
};

export default TransactionsTab;
