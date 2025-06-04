"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/components/dashboard";
import { TransactionsList } from "@/components/transactions-list";
import { AddTransaction } from "@/components/add-transaction";
import { PeopleList } from "@/components/people-list";
import { SettingsPage } from "@/components/settings-page";
import { ChevronLeft, Search, Filter, Plus, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionDetail } from "@/components/transaction-detail";
import { PersonDetail } from "@/components/person-detail";
import {
  Wallet,
  CreditCard,
  PiggyBank,
  ShoppingCart,
  Coffee,
  Car,
  Briefcase,
} from "lucide-react";

// Global state management
interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  time: string;
  type: "income" | "expense" | "transfer";
  category: any;
  account: any;
  tags: string[];
  person?: any;
  description: string;
}

interface Person {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  description: string;
  balance: number;
  lastTransaction: string;
  transactionCount: number;
  totalSpent?: number;
  totalReceived?: number;
}

interface Account {
  id: string;
  name: string;
  icon: any;
  color: string;
  balance: number;
  type: string;
  bank?: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  type: "income" | "expense" | "transfer";
  children?: Category[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  // Global state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add new state variables after the existing state declarations
  const [showTransactionSearch, setShowTransactionSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    // Initialize mock data with proper icon components
    setTransactions([
      {
        id: 1,
        title: "Grocery Shopping",
        amount: -85.5,
        date: "2024-11-15",
        time: "14:30",
        type: "expense",
        category: {
          id: "food",
          name: "Food & Dining",
          icon: ShoppingCart,
          color: "bg-orange-500",
        },
        account: {
          id: "checking",
          name: "Checking",
          icon: Wallet,
          color: "bg-blue-500",
        },
        tags: ["Essential"],
        person: { id: 1, name: "Sarah" },
        description: "Weekly grocery shopping",
      },
      {
        id: 2,
        title: "Coffee with John",
        amount: -12.75,
        date: "2024-11-15",
        time: "09:15",
        type: "expense",
        category: {
          id: "coffee",
          name: "Coffee & Drinks",
          icon: Coffee,
          color: "bg-amber-500",
        },
        account: {
          id: "credit",
          name: "Credit Card",
          icon: CreditCard,
          color: "bg-red-500",
        },
        tags: ["Social"],
        person: { id: 2, name: "John" },
        description: "Morning coffee meeting",
      },
      {
        id: 3,
        title: "Salary Deposit",
        amount: 3500.0,
        date: "2024-11-14",
        time: "08:00",
        type: "income",
        category: {
          id: "salary",
          name: "Salary",
          icon: Briefcase,
          color: "bg-emerald-500",
        },
        account: {
          id: "checking",
          name: "Checking",
          icon: Wallet,
          color: "bg-blue-500",
        },
        tags: ["Work"],
        description: "Monthly salary deposit",
      },
    ]);

    setPeople([
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "sarah@example.com",
        phone: "+1 (555) 123-4567",
        description: "College friend and roommate",
        balance: 125.5,
        lastTransaction: "2024-11-15",
        transactionCount: 12,
        totalSpent: 450.75,
        totalReceived: 325.25,
      },
      {
        id: 2,
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "john@example.com",
        phone: "+1 (555) 987-6543",
        description: "Work colleague",
        balance: -25.75,
        lastTransaction: "2024-11-15",
        transactionCount: 8,
        totalSpent: 200.0,
        totalReceived: 174.25,
      },
    ]);

    setAccounts([
      {
        id: "checking",
        name: "Checking Account",
        icon: Wallet,
        color: "bg-blue-500",
        balance: 2450.5,
        type: "checking",
        bank: "Chase Bank",
      },
      {
        id: "savings",
        name: "Savings Account",
        icon: PiggyBank,
        color: "bg-green-500",
        balance: 8920.0,
        type: "savings",
        bank: "Chase Bank",
      },
      {
        id: "credit",
        name: "Credit Card",
        icon: CreditCard,
        color: "bg-red-500",
        balance: -1250.75,
        type: "credit",
        bank: "American Express",
      },
    ]);

    setCategories([
      {
        id: "food",
        name: "Food & Dining",
        icon: ShoppingCart,
        color: "bg-orange-500",
        type: "expense",
        children: [
          {
            id: "restaurants",
            name: "Restaurants",
            icon: ShoppingCart,
            color: "bg-orange-400",
            type: "expense",
          },
          {
            id: "groceries",
            name: "Groceries",
            icon: ShoppingCart,
            color: "bg-orange-600",
            type: "expense",
          },
        ],
      },
      {
        id: "transport",
        name: "Transportation",
        icon: Car,
        color: "bg-blue-500",
        type: "expense",
        children: [
          {
            id: "gas",
            name: "Gas",
            icon: Car,
            color: "bg-blue-400",
            type: "expense",
          },
          {
            id: "public",
            name: "Public Transit",
            icon: Car,
            color: "bg-blue-600",
            type: "expense",
          },
        ],
      },
      {
        id: "income",
        name: "Income",
        icon: Briefcase,
        color: "bg-emerald-500",
        type: "income",
        children: [
          {
            id: "salary",
            name: "Salary",
            icon: Briefcase,
            color: "bg-emerald-400",
            type: "income",
          },
          {
            id: "freelance",
            name: "Freelance",
            icon: Briefcase,
            color: "bg-emerald-600",
            type: "income",
          },
        ],
      },
    ]);
  }, []);

  // CRUD operations
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addPerson = (person: Omit<Person, "id">) => {
    const newPerson = {
      ...person,
      id: Math.max(...people.map((p) => p.id), 0) + 1,
      totalSpent: 0,
      totalReceived: 0,
    };
    setPeople((prev) => [newPerson, ...prev]);
  };

  const updatePerson = (id: number, updates: Partial<Person>) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePerson = (id: number) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const addAccount = (account: Omit<Account, "id">) => {
    const newAccount = {
      ...account,
      id: Math.random().toString(36).substr(2, 9),
    };
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCategories((prev) => [newCategory, ...prev]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const renderContent = () => {
    if (selectedTransactionId) {
      return (
        <TransactionDetail
          transactionId={selectedTransactionId}
          onBack={() => setSelectedTransactionId(null)}
          onEdit={(id, updates) => updateTransaction(id, updates)}
          onDelete={(id) => {
            deleteTransaction(id);
            setSelectedTransactionId(null);
          }}
          transactions={transactions}
        />
      );
    }

    if (selectedPersonId) {
      return (
        <PersonDetail
          personId={selectedPersonId}
          onBack={() => setSelectedPersonId(null)}
          onEdit={(id, updates) => updatePerson(id, updates)}
          onDelete={(id) => {
            deletePerson(id);
            setSelectedPersonId(null);
          }}
          people={people}
          transactions={transactions}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return <Dashboard accounts={accounts} transactions={transactions} />;
      case "transactions":
        return (
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
        );
      case "add":
        return (
          <AddTransaction
            onSubmit={addTransaction}
            people={people}
            accounts={accounts}
            categories={categories}
          />
        );
      case "people":
        return (
          <PeopleList
            onPersonSelect={setSelectedPersonId}
            people={people}
            onAdd={addPerson}
            onEdit={updatePerson}
            onDelete={deletePerson}
          />
        );
      case "settings":
        return (
          <SettingsPage
            accounts={accounts}
            categories={categories}
            people={people}
            onAddAccount={addAccount}
            onEditAccount={updateAccount}
            onDeleteAccount={deleteAccount}
            onAddCategory={addCategory}
            onEditCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onAddPerson={addPerson}
            onEditPerson={updatePerson}
            onDeletePerson={deletePerson}
          />
        );
      default:
        return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(activeTab !== "home" ||
                selectedTransactionId ||
                selectedPersonId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedTransactionId) {
                      setSelectedTransactionId(null);
                    } else if (selectedPersonId) {
                      setSelectedPersonId(null);
                    } else {
                      setActiveTab("home");
                    }
                  }}
                  className="text-slate-600 dark:text-slate-400 p-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🏔️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedTransactionId
                      ? "Transaction Details"
                      : selectedPersonId
                      ? "Person Details"
                      : activeTab === "home"
                      ? "Dashboard"
                      : activeTab === "transactions"
                      ? "Transactions"
                      : activeTab === "add"
                      ? "Add Transaction"
                      : activeTab === "people"
                      ? "People"
                      : activeTab === "settings"
                      ? "Settings"
                      : "Pika"}
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedTransactionId || selectedPersonId
                      ? "View and manage details"
                      : activeTab === "home"
                      ? "Your financial overview"
                      : activeTab === "transactions"
                      ? "Track your financial activity"
                      : activeTab === "add"
                      ? "Record a new transaction"
                      : activeTab === "people"
                      ? "Manage your contacts"
                      : activeTab === "settings"
                      ? "App preferences and data"
                      : "Personal Finance"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {activeTab === "transactions" && !selectedTransactionId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-400"
                    onClick={() =>
                      setShowTransactionSearch(!showTransactionSearch)
                    }
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
                </>
              )}

              {activeTab === "people" && !selectedPersonId && (
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => {
                    // This would trigger the add person functionality
                    console.log("Add person from header");
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}

              {activeTab === "settings" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}

              {activeTab === "home" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 lg:pb-4">
        <div className="lg:flex lg:max-w-7xl lg:mx-auto">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-24 p-4">
              <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isDesktop
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:flex-1 lg:min-w-0">{renderContent()}</div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
