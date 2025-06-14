import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";
import { SwipeableTransaction } from "@/components/swipeable-transaction";
import type { Transaction } from "@/data/dummy-data";
import type { Filter } from "./transactions-tab/filter/types";
import type { Sort } from "./transactions-tab/sort/types";

interface TransactionsListProps {
  transactions: Transaction[];
  onClearSearchAndFilters: () => void;
  searchTerm: string;
  filters: Filter;
  sort: Sort;
}

export function TransactionsList({
  transactions,
  searchTerm,
  onClearSearchAndFilters,
  filters,
  sort,
}: TransactionsListProps) {
  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.person?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.person?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType =
      filters.types.length === 0 || filters.types.includes(transaction.type);

    // Category filter
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(transaction.category.id);

    // Tags filter
    const matchesTags =
      filters.tags.length === 0 ||
      filters.tags.some((tag) => transaction.tags.includes(tag));

    // People filter
    const matchesPeople =
      filters.people.length === 0 ||
      filters.people.some((personId) => {
        const transactionPersonId = transaction.person?.id?.toString();
        return transactionPersonId === personId;
      });

    // Date range filter
    const matchesDateRange = (() => {
      if (!filters.dateRange.from && !filters.dateRange.to) return true;
      const transactionDate = new Date(transaction.date);
      const fromDate = filters.dateRange.from
        ? new Date(filters.dateRange.from)
        : null;
      const toDate = filters.dateRange.to
        ? new Date(filters.dateRange.to)
        : null;

      if (fromDate && toDate) {
        return transactionDate >= fromDate && transactionDate <= toDate;
      } else if (fromDate) {
        return transactionDate >= fromDate;
      } else if (toDate) {
        return transactionDate <= toDate;
      }
      return true;
    })();

    // Amount filter
    const matchesAmount = (() => {
      if (!filters.amount.value1) return true;
      const transactionAmount = Math.abs(transaction.amount);
      const value1 = Number.parseFloat(filters.amount.value1);
      const value2 = filters.amount.value2
        ? Number.parseFloat(filters.amount.value2)
        : null;

      switch (filters.amount.operator) {
        case "between":
          return value2
            ? transactionAmount >= value1 && transactionAmount <= value2
            : true;
        case "greater":
          return transactionAmount > value1;
        case "less":
          return transactionAmount < value1;
        case "equal":
          return transactionAmount === value1;
        case "not_equal":
          return transactionAmount !== value1;
        case "greater_equal":
          return transactionAmount >= value1;
        case "less_equal":
          return transactionAmount <= value1;
        default:
          return true;
      }
    })();

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesTags &&
      matchesPeople &&
      matchesDateRange &&
      matchesAmount
    );
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let valueA, valueB;

    // Extract values based on sort field
    switch (sort.field) {
      case "date":
        valueA = new Date(`${a.date} ${a.time}`).getTime();
        valueB = new Date(`${b.date} ${b.time}`).getTime();
        break;
      case "amount":
        valueA = Math.abs(a.amount);
        valueB = Math.abs(b.amount);
        break;
      case "category":
        valueA = a.category.name.toLowerCase();
        valueB = b.category.name.toLowerCase();
        break;
      case "tags":
        valueA = a.tags[0]?.toLowerCase() || "";
        valueB = b.tags[0]?.toLowerCase() || "";
        break;
      case "title":
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case "person":
        valueA = (a.person?.name || "").toLowerCase();
        valueB = (b.person?.name || "").toLowerCase();
        break;
      default:
        valueA = a[sort.field as keyof Transaction];
        valueB = b[sort.field as keyof Transaction];
    }

    // Compare values based on sort direction
    if (sort.direction === "asc") {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case "expense":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "transfer":
        return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAmountColor = (amount: number, type: string) => {
    if (type === "income") return "text-emerald-600 dark:text-emerald-400";
    if (type === "expense") return "text-red-500 dark:text-red-400";
    return "text-blue-600 dark:text-blue-400";
  };

  const getActiveFiltersCount = () => {
    return (
      filters.types.length +
      filters.categories.length +
      filters.tags.length +
      filters.people.length +
      (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
      (filters.amount.value1 ? 1 : 0)
    );
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      console.log("Delete transaction with id:", id);
    }
  };

  const handleEdit = (id: string) => {
    alert(`Edit functionality for transaction with id: ${id}`);
  };

  const handleSelect = (id: string) => {
    alert(`Open functionality for transaction with id: ${id}`);
  };

  return (
    <div className="px-0 py-0 space-y-6">
      {/* Transactions List */}
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <SwipeableTransaction
            key={transaction.id}
            onEdit={() => {
              handleEdit(`${transaction.id}`);
            }}
            onDelete={() => {
              handleDelete(`${transaction.id}`);
            }}
            onClick={() => handleSelect(`${transaction.id}`)}
          >
            <Card className="transition-all duration-200 p-0">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-10 h-10 ${transaction.category.color} rounded-full flex items-center justify-center relative`}
                    >
                      <IconRenderer
                        iconName={transaction.category.icon}
                        className="w-5 h-5 text-white"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900 dark:text-white truncate">
                          {transaction.title}
                        </h4>
                        <span
                          className={`font-semibold ${getAmountColor(
                            transaction.amount,
                            transaction.type
                          )}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}$
                          {Math.abs(transaction.amount).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {transaction.date} • {transaction.time}
                        </span>
                        <div
                          className={`w-4 h-4 ${transaction.account.color} rounded-full flex items-center justify-center`}
                        >
                          <IconRenderer
                            iconName={transaction.account.icon}
                            className="w-2 h-2 text-white"
                          />
                        </div>
                      </div>
                      {transaction.person?.name && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            with {transaction.person?.name}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transaction.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwipeableTransaction>
        ))}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No transactions found
          </p>
          {(searchTerm || getActiveFiltersCount() > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSearchAndFilters}
              className="mt-2"
            >
              Clear search and filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
