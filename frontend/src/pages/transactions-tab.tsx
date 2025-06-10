import { TransactionsList } from "@/components/transactions-list";
import TabsLayout from "@/layouts/tabs";
import { useEffect, useState } from "react";
import {
  transactions as transactionsData,
  type Transaction,
} from "@/data/dummy-data";

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [showTransactionSearch, setShowTransactionSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

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
    </TabsLayout>
  );
};

export default TransactionsTab;
