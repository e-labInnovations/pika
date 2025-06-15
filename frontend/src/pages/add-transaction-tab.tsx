import { AddTransaction } from "@/components/add-transaction";
import HeaderRightActions from "@/components/add-transaction-tab/header-right-actions";
import ScanReceipt from "@/components/add-transaction-tab/scan-receipt";
import {
  transactions as transactionsData,
  people,
  categories,
  accounts,
  type Transaction,
  type AnalysisOutput,
} from "@/data/dummy-data";
import TabsLayout from "@/layouts/tabs";
import { useState, useEffect } from "react";

const AddTransactionTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openAiReceiptScanner, setOpenAiReceiptScanner] = useState(false);

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

  const handleTransactionDetails = (transaction: AnalysisOutput) => {
    console.log(transaction);
  };

  return (
    <TabsLayout
      header={{
        title: "Add Transaction",
        description: "Add a new transaction",
        rightActions: (
          <HeaderRightActions
            handleScanReceipt={() => setOpenAiReceiptScanner(true)}
          />
        ),
      }}
    >
      {/* Will update this soon */}
      <AddTransaction
        onSubmit={addTransaction}
        people={people}
        accounts={accounts}
        categories={categories}
      />

      <ScanReceipt
        open={openAiReceiptScanner}
        setOpen={setOpenAiReceiptScanner}
        handleTransactionDetails={handleTransactionDetails}
      />
    </TabsLayout>
  );
};

export default AddTransactionTab;
