import { TransactionsList } from "@/components/transactions-list";
import TabsLayout from "@/layouts/tabs";
import { useEffect, useState } from "react";
import {
  transactions as transactionsData,
  type Transaction,
} from "@/data/dummy-data";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import TransactionsFilter, {
  type AmountFilter,
  type DateFilter,
} from "@/components/transactions-tab/filter/filter";

interface RightActionsProps {
  showTransactionSearch: boolean;
  setShowTransactionSearch: (show: boolean) => void;
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
  showSortModal: boolean;
  setShowSortModal: (show: boolean) => void;
}
const RightActions = ({
  showTransactionSearch,
  setShowTransactionSearch,
  setShowFilterModal,
  setShowSortModal,
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
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowFilterModal(true)}
      >
        <Filter className="w-4 h-4" />
      </Button>
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
  const [filters, setFilters] = useState<any>({
    types: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    people: [] as string[],
    dateRange: { from: "", to: "" } as DateFilter,
    amount: { operator: "between", value1: "", value2: "" } as AmountFilter,
  });

  useEffect(() => {
    return () => setTransactions(transactionsData);
  }, []);

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
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
