import { AddTransaction } from "@/components/add-transaction";
import {
  transactions as transactionsData,
  people,
  categories,
  accounts,
  type Transaction,
} from "@/data/dummy-data";
import TabsLayout from "@/layouts/tabs";
import { useState, useEffect } from "react";

const AddTransactionTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    return () => setTransactions(transactionsData);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  return (
    <TabsLayout
      header={{
        title: "Add Transaction",
        description: "Add a new transaction",
      }}
    >
      <AddTransaction
        onSubmit={addTransaction}
        people={people}
        accounts={accounts}
        categories={categories}
      />
    </TabsLayout>
  );
};

export default AddTransactionTab;
