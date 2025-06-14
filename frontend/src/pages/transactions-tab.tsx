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
} from "@/components/transactions-tab/filter/types";
import { Badge } from "@/components/ui/badge";

interface RightActionsProps {
  showTransactionSearch: boolean;
  setShowTransactionSearch: (show: boolean) => void;
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
  showSortModal: boolean;
  setShowSortModal: (show: boolean) => void;
  filterCount: number;
}
const RightActions = ({
  showTransactionSearch,
  setShowTransactionSearch,
  setShowFilterModal,
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
          onClick={() => setShowFilterModal(true)}
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
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [showTransactionSearch, setShowTransactionSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [filters, setFilters] = useState<Filter>(defaultFilterValues);

  useEffect(() => {
    return () => setTransactions(transactionsData);
  }, []);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ filters:", filters);
  }, [filters]);

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getFilterCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof Filter];
      return Array.isArray(value) && value.length > 0;
    }).length;
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
            setShowFilterModal={setShowFilterModal}
            showSortModal={showSortModal}
            setShowSortModal={setShowSortModal}
            filterCount={getFilterCount()}
          />
        ),
      }}
    >
      <TransactionsList
        onTransactionSelect={setSelectedTransactionId}
        transactions={transactions}
        onEdit={updateTransaction}
        onDelete={deleteTransaction}
        showSearch={showTransactionSearch}
        onSearchToggle={setShowTransactionSearch}
        showFilterModal={showFilterModal}
        onFilterModalClose={() => setShowFilterModal(false)}
      />

      <TransactionsFilter
        open={showFilterModal}
        setOpen={setShowFilterModal}
        filters={filters}
        setFilters={setFilters}
      />
    </TabsLayout>
  );
};

export default TransactionsTab;
