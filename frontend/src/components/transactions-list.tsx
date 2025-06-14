"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  X,
  DollarSign,
  Tag,
  Folder,
  ArrowDownUp,
  SortAsc,
  SortDesc,
  User,
  Calendar,
  Calculator,
  CheckSquare,
  Square,
} from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";

// Import the SwipeableTransaction component
import { SwipeableTransaction } from "@/components/swipeable-transaction";

interface TransactionsListProps {
  onTransactionSelect: (id: number) => void;
  transactions: any[];
  onEdit: (id: number, updates: any) => void;
  onDelete: (id: number) => void;
  showSearch: boolean;
  onSearchToggle: (show: boolean) => void;
  showFilterModal: boolean;
  onFilterModalClose: () => void;
}

type SortOption = {
  field: string;
  label: string;
  ascLabel: string;
  descLabel: string;
  icon?: React.ReactNode;
};

type SortDirection = "asc" | "desc";

type AmountFilter = {
  operator:
    | "between"
    | "greater"
    | "less"
    | "equal"
    | "not_equal"
    | "greater_equal"
    | "less_equal";
  value1: string;
  value2?: string; // For "between" operator
};

type DateFilter = {
  from: string;
  to: string;
};

export function TransactionsList({
  onTransactionSelect,
  transactions,
  onEdit,
  onDelete,
  showSearch,
  onSearchToggle,
  showFilterModal,
  onFilterModalClose,
}: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState("types");
  const [filters, setFilters] = useState({
    types: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    people: [] as string[],
    dateRange: { from: "", to: "" } as DateFilter,
    amount: { operator: "between", value1: "", value2: "" } as AmountFilter,
  });

  // Add search states for each tab
  const [tabSearchTerms, setTabSearchTerms] = useState({
    types: "",
    categories: "",
    tags: "",
    people: "",
  });

  // Add sort state
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Updated sort options with proper labels
  const sortOptions: SortOption[] = [
    {
      field: "date",
      label: "Date",
      ascLabel: "Oldest to Newest",
      descLabel: "Newest to Oldest",
    },
    {
      field: "amount",
      label: "Amount",
      ascLabel: "Lowest to Highest",
      descLabel: "Highest to Lowest",
    },
    {
      field: "category",
      label: "Category",
      ascLabel: "A to Z",
      descLabel: "Z to A",
    },
    {
      field: "tags",
      label: "Tags",
      ascLabel: "A to Z",
      descLabel: "Z to A",
    },
    {
      field: "title",
      label: "Description",
      ascLabel: "A to Z",
      descLabel: "Z to A",
    },
    {
      field: "person",
      label: "Person",
      ascLabel: "A to Z",
      descLabel: "Z to A",
    },
  ];

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
      transaction.member?.toLowerCase().includes(searchTerm.toLowerCase());

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
        const transactionPersonId =
          transaction.person?.id?.toString() || transaction.member;
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
    switch (sortField) {
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
        valueA = (a.person?.name || a.member || "").toLowerCase();
        valueB = (b.person?.name || b.member || "").toLowerCase();
        break;
      default:
        valueA = a[sortField];
        valueB = b[sortField];
    }

    // Compare values based on sort direction
    if (sortDirection === "asc") {
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

  const clearFilters = () => {
    setFilters({
      types: [],
      categories: [],
      tags: [],
      people: [],
      dateRange: { from: "", to: "" },
      amount: { operator: "between", value1: "", value2: "" },
    });
  };

  const applyFilters = () => {
    onFilterModalClose();
  };

  // Get unique categories, tags, and people for filter options
  const uniqueCategories = Array.from(
    new Set(transactions.map((t) => t.category.id))
  )
    .map((id) => transactions.find((t) => t.category.id === id)?.category)
    .filter(Boolean);

  const uniqueTags = Array.from(new Set(transactions.flatMap((t) => t.tags)));

  const uniquePeople = Array.from(
    new Set(
      transactions
        .map(
          (t) =>
            t.person || (t.member ? { id: t.member, name: t.member } : null)
        )
        .filter(Boolean)
        .map((p) => JSON.stringify(p))
    )
  ).map((p) => JSON.parse(p));

  // Transaction types with metadata
  const transactionTypes = [
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

  // Mock parent categories with children (in a real app, this would come from props)
  const categoryHierarchy = [
    {
      id: "food",
      name: "Food & Dining",
      icon: "ShoppingCart",
      color: "bg-orange-500",
      children: [
        {
          id: "restaurants",
          name: "Restaurants",
          icon: "ShoppingCart",
          color: "bg-orange-400",
        },
        {
          id: "groceries",
          name: "Groceries",
          icon: "ShoppingCart",
          color: "bg-orange-600",
        },
        {
          id: "coffee",
          name: "Coffee Shops",
          icon: "Coffee",
          color: "bg-amber-500",
        },
        {
          id: "fastfood",
          name: "Fast Food",
          icon: "ShoppingCart",
          color: "bg-orange-300",
        },
      ],
    },
    {
      id: "transport",
      name: "Transportation",
      icon: "Car",
      color: "bg-blue-500",
      children: [
        { id: "gas", name: "Gas", icon: "Car", color: "bg-blue-400" },
        {
          id: "public",
          name: "Public Transit",
          icon: "Car",
          color: "bg-blue-600",
        },
        { id: "parking", name: "Parking", icon: "Car", color: "bg-blue-300" },
        {
          id: "maintenance",
          name: "Car Maintenance",
          icon: "Car",
          color: "bg-blue-700",
        },
      ],
    },
    {
      id: "shopping",
      name: "Shopping",
      icon: "Gift",
      color: "bg-purple-500",
      children: [
        {
          id: "clothing",
          name: "Clothing",
          icon: "Gift",
          color: "bg-purple-400",
        },
        {
          id: "electronics",
          name: "Electronics",
          icon: "Gift",
          color: "bg-purple-600",
        },
        { id: "books", name: "Books", icon: "Gift", color: "bg-purple-300" },
      ],
    },
    {
      id: "income",
      name: "Income",
      icon: "Briefcase",
      color: "bg-emerald-500",
      children: [
        {
          id: "salary",
          name: "Salary",
          icon: "Briefcase",
          color: "bg-emerald-400",
        },
        {
          id: "freelance",
          name: "Freelance",
          icon: "Briefcase",
          color: "bg-emerald-600",
        },
        {
          id: "bonus",
          name: "Bonus",
          icon: "Briefcase",
          color: "bg-emerald-300",
        },
        {
          id: "investment",
          name: "Investment",
          icon: "Briefcase",
          color: "bg-emerald-700",
        },
      ],
    },
  ];

  const handleTypeToggle = (typeId: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((id) => id !== typeId)
        : [...prev.types, typeId],
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      // Handle parent-child logic
      const parent = categoryHierarchy.find((p) => p.id === categoryId);
      const child = categoryHierarchy.find((p) =>
        p.children.some((c) => c.id === categoryId)
      );

      if (parent) {
        // If parent is being selected, select all children
        if (!prev.categories.includes(categoryId)) {
          parent.children.forEach((child) => {
            if (!newCategories.includes(child.id)) {
              newCategories.push(child.id);
            }
          });
        } else {
          // If parent is being deselected, deselect all children
          parent.children.forEach((child) => {
            const index = newCategories.indexOf(child.id);
            if (index > -1) {
              newCategories.splice(index, 1);
            }
          });
        }
      } else if (child) {
        // If child is being selected/deselected, check if all siblings are selected
        const allChildrenSelected = child.children.every((sibling) =>
          sibling.id === categoryId
            ? !prev.categories.includes(categoryId)
            : newCategories.includes(sibling.id)
        );

        if (allChildrenSelected && !newCategories.includes(child.id)) {
          // If all children are selected, select parent
          newCategories.push(child.id);
        } else if (!allChildrenSelected && newCategories.includes(child.id)) {
          // If not all children are selected, deselect parent
          const parentIndex = newCategories.indexOf(child.id);
          if (parentIndex > -1) {
            newCategories.splice(parentIndex, 1);
          }
        }
      }

      return { ...prev, categories: newCategories };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handlePersonToggle = (personId: string) => {
    setFilters((prev) => ({
      ...prev,
      people: prev.people.includes(personId)
        ? prev.people.filter((id) => id !== personId)
        : [...prev.people, personId],
    }));
  };

  // Select/Unselect all functions
  const handleSelectAllTypes = () => {
    const allSelected = transactionTypes.length === filters.types.length;
    setFilters((prev) => ({
      ...prev,
      types: allSelected ? [] : transactionTypes.map((type) => type.id),
    }));
  };

  const handleSelectAllCategories = () => {
    const allCategoryIds = [
      ...categoryHierarchy.map((parent) => parent.id),
      ...categoryHierarchy.flatMap((parent) =>
        parent.children.map((child) => child.id)
      ),
    ];
    const allSelected = allCategoryIds.length === filters.categories.length;
    setFilters((prev) => ({
      ...prev,
      categories: allSelected ? [] : allCategoryIds,
    }));
  };

  const handleSelectAllTags = () => {
    const allSelected = uniqueTags.length === filters.tags.length;
    setFilters((prev) => ({
      ...prev,
      tags: allSelected ? [] : [...uniqueTags],
    }));
  };

  const handleSelectAllPeople = () => {
    const allPeopleIds = uniquePeople.map(
      (person) => person.id?.toString() || person.name
    );
    const allSelected = allPeopleIds.length === filters.people.length;
    setFilters((prev) => ({
      ...prev,
      people: allSelected ? [] : allPeopleIds,
    }));
  };

  // Filter functions for search within tabs
  const getFilteredTypes = () => {
    return transactionTypes.filter((type) =>
      type.name.toLowerCase().includes(tabSearchTerms.types.toLowerCase())
    );
  };

  const getFilteredCategories = () => {
    return categoryHierarchy.filter(
      (parent) =>
        parent.name
          .toLowerCase()
          .includes(tabSearchTerms.categories.toLowerCase()) ||
        parent.children.some((child) =>
          child.name
            .toLowerCase()
            .includes(tabSearchTerms.categories.toLowerCase())
        )
    );
  };

  const getFilteredTags = () => {
    return uniqueTags.filter((tag) =>
      tag.toLowerCase().includes(tabSearchTerms.tags.toLowerCase())
    );
  };

  const getFilteredPeople = () => {
    return uniquePeople.filter((person) =>
      person.name.toLowerCase().includes(tabSearchTerms.people.toLowerCase())
    );
  };

  const filterTabs = [
    { id: "types", label: "Type", icon: DollarSign },
    { id: "categories", label: "Categories", icon: Folder },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "people", label: "People", icon: User },
    { id: "date", label: "Date", icon: Calendar },
    { id: "amount", label: "Amount", icon: Calculator },
  ];

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

  const handleSortSelect = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    setShowSortModal(false);
  };

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.field === sortField);
    const directionLabel =
      sortDirection === "asc" ? option?.ascLabel : option?.descLabel;
    return `${option?.label || "Date"} (${
      directionLabel || "Newest to Oldest"
    })`;
  };

  const amountOperators = [
    { value: "between", label: "Between" },
    { value: "greater", label: "Greater than" },
    { value: "less", label: "Less than" },
    { value: "equal", label: "Equal to" },
    { value: "not_equal", label: "Not equal to" },
    { value: "greater_equal", label: "Greater than or equal to" },
    { value: "less_equal", label: "Less than or equal to" },
  ];

  return (
    <div className="px-0 py-0 space-y-6">
      {/* Conditional Search Input */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => {
              setSearchTerm("");
              onSearchToggle(false);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Compact Active Filters and Sort Display */}
      {(getActiveFiltersCount() > 0 ||
        sortField !== "date" ||
        sortDirection !== "desc") && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <>
              {filters.types.map((type) => {
                const typeInfo = transactionTypes.find((t) => t.id === type);
                return typeInfo ? (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 flex-shrink-0"
                  >
                    {typeInfo.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-blue-600 hover:text-blue-800"
                      onClick={() => handleTypeToggle(type)}
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  </Badge>
                ) : null;
              })}
              {filters.categories.slice(0, 2).map((categoryId) => {
                // Find category in hierarchy (could be parent or child)
                let category = null;
                for (const parent of categoryHierarchy) {
                  if (parent.id === categoryId) {
                    category = parent;
                    break;
                  }
                  const child = parent.children.find(
                    (c) => c.id === categoryId
                  );
                  if (child) {
                    category = child;
                    break;
                  }
                }
                return category ? (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 flex-shrink-0"
                  >
                    {category.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-purple-600 hover:text-purple-800"
                      onClick={() => handleCategoryToggle(categoryId)}
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  </Badge>
                ) : null;
              })}
              {filters.categories.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 flex-shrink-0"
                >
                  +{filters.categories.length - 2} more
                </Badge>
              )}
              {filters.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs px-2 py-1 flex-shrink-0"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-emerald-600 hover:text-emerald-800"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              ))}
              {filters.tags.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 flex-shrink-0"
                >
                  +{filters.tags.length - 2} more
                </Badge>
              )}
              {filters.people.slice(0, 1).map((personId) => {
                const person = uniquePeople.find(
                  (p) => p.id?.toString() === personId || p.name === personId
                );
                return person ? (
                  <Badge
                    key={personId}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-1 flex-shrink-0"
                  >
                    {person.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-orange-600 hover:text-orange-800"
                      onClick={() => handlePersonToggle(personId)}
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  </Badge>
                ) : null;
              })}
              {filters.people.length > 1 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 flex-shrink-0"
                >
                  +{filters.people.length - 1} more
                </Badge>
              )}
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge
                  variant="secondary"
                  className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 text-xs px-2 py-1 flex-shrink-0"
                >
                  Date
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-cyan-600 hover:text-cyan-800"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { from: "", to: "" },
                      }))
                    }
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              )}
              {filters.amount.value1 && (
                <Badge
                  variant="secondary"
                  className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 text-xs px-2 py-1 flex-shrink-0"
                >
                  Amount
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-pink-600 hover:text-pink-800"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        amount: { operator: "between", value1: "", value2: "" },
                      }))
                    }
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-500 hover:text-slate-700 text-xs px-2 py-1 h-auto flex-shrink-0"
              >
                Clear all
              </Button>
            </>
          )}

          {/* Sort indicator */}
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-xs px-2 py-1 flex-shrink-0 ml-auto"
            onClick={() => setShowSortModal(true)}
          >
            <ArrowDownUp className="w-2 h-2 mr-1" />
            {getSortLabel()}
          </Badge>
        </div>
      )}

      {/* Enhanced Filter Modal */}
      <Dialog open={false} onOpenChange={onFilterModalClose}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Filter Transactions</span>
              {getActiveFiltersCount() > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800"
                >
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Horizontal Scrollable Filter Tabs */}
            <div className="overflow-x-auto">
              <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 min-w-max">
                {filterTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeFilterTab === tab.id ? "default" : "ghost"}
                      size="sm"
                      className={`flex-shrink-0 whitespace-nowrap ${
                        activeFilterTab === tab.id
                          ? "bg-white dark:bg-slate-700 shadow-sm"
                          : "hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => setActiveFilterTab(tab.id)}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      <span className="text-xs">{tab.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-h-80 overflow-y-auto">
              {activeFilterTab === "types" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Transaction Types
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllTypes}
                      className="text-xs flex items-center"
                    >
                      {filters.types.length === transactionTypes.length ? (
                        <>
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Unselect All
                        </>
                      ) : (
                        <>
                          <Square className="w-3 h-3 mr-1" />
                          Select All
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Search within types */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
                    <Input
                      placeholder="Search types..."
                      value={tabSearchTerms.types}
                      onChange={(e) =>
                        setTabSearchTerms((prev) => ({
                          ...prev,
                          types: e.target.value,
                        }))
                      }
                      className="pl-8 h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    {getFilteredTypes().map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            filters.types.includes(type.id)
                              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                          onClick={() => handleTypeToggle(type.id)}
                        >
                          <div
                            className={`w-8 h-8 ${type.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <Icon className={`w-4 h-4 ${type.color}`} />
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
              )}

              {activeFilterTab === "categories" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Categories
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllCategories}
                      className="text-xs flex items-center"
                    >
                      {filters.categories.length ===
                      categoryHierarchy.length +
                        categoryHierarchy.flatMap((p) => p.children).length ? (
                        <>
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Unselect All
                        </>
                      ) : (
                        <>
                          <Square className="w-3 h-3 mr-1" />
                          Select All
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Search within categories */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
                    <Input
                      placeholder="Search categories..."
                      value={tabSearchTerms.categories}
                      onChange={(e) =>
                        setTabSearchTerms((prev) => ({
                          ...prev,
                          categories: e.target.value,
                        }))
                      }
                      className="pl-8 h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-4">
                    {getFilteredCategories().map((parent) => (
                      <div key={parent.id} className="space-y-2">
                        {/* Parent Category */}
                        <div
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            filters.categories.includes(parent.id)
                              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                          onClick={() => handleCategoryToggle(parent.id)}
                        >
                          <div
                            className={`w-8 h-8 ${parent.color} rounded-full flex items-center justify-center`}
                          >
                            <IconRenderer
                              iconName={parent.icon}
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {parent.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {parent.children.length} subcategories
                            </p>
                          </div>
                        </div>

                        {/* Child Categories */}
                        <div className="ml-6 space-y-2">
                          {parent.children
                            .filter((child) =>
                              child.name
                                .toLowerCase()
                                .includes(
                                  tabSearchTerms.categories.toLowerCase()
                                )
                            )
                            .map((child) => (
                              <div
                                key={child.id}
                                className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-all ${
                                  filters.categories.includes(child.id)
                                    ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                                onClick={() => handleCategoryToggle(child.id)}
                              >
                                <div
                                  className={`w-6 h-6 ${child.color} rounded-full flex items-center justify-center`}
                                >
                                  <IconRenderer
                                    iconName={child.icon}
                                    className="w-3 h-3 text-white"
                                  />
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {child.name}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "tags" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Tags
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllTags}
                      className="text-xs flex items-center"
                    >
                      {filters.tags.length === uniqueTags.length ? (
                        <>
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Unselect All
                        </>
                      ) : (
                        <>
                          <Square className="w-3 h-3 mr-1" />
                          Select All
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Search within tags */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
                    <Input
                      placeholder="Search tags..."
                      value={tabSearchTerms.tags}
                      onChange={(e) =>
                        setTabSearchTerms((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      className="pl-8 h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    {getFilteredTags().map((tag) => (
                      <div
                        key={tag}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          filters.tags.includes(tag)
                            ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                          <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {tag}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {
                              transactions.filter((t) => t.tags.includes(tag))
                                .length
                            }{" "}
                            transactions
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "people" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      People
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllPeople}
                      className="text-xs flex items-center"
                    >
                      {filters.people.length === uniquePeople.length ? (
                        <>
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Unselect All
                        </>
                      ) : (
                        <>
                          <Square className="w-3 h-3 mr-1" />
                          Select All
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Search within people */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
                    <Input
                      placeholder="Search people..."
                      value={tabSearchTerms.people}
                      onChange={(e) =>
                        setTabSearchTerms((prev) => ({
                          ...prev,
                          people: e.target.value,
                        }))
                      }
                      className="pl-8 h-8 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    {getFilteredPeople().map((person) => {
                      const personId = person.id?.toString() || person.name;
                      return (
                        <div
                          key={personId}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            filters.people.includes(personId)
                              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                          onClick={() => handlePersonToggle(personId)}
                        >
                          <div className="w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {person.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {
                                transactions.filter(
                                  (t) =>
                                    t.person?.id?.toString() === personId ||
                                    t.member === personId
                                ).length
                              }{" "}
                              transactions
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeFilterTab === "date" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    Filter by Date Range
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date-from">From Date</Label>
                      <Input
                        id="date-from"
                        type="date"
                        value={filters.dateRange.from}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              from: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to">To Date</Label>
                      <Input
                        id="date-to"
                        type="date"
                        value={filters.dateRange.to}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              to: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeFilterTab === "amount" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    Filter by Amount
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount-operator">Condition</Label>
                      <Select
                        value={filters.amount.operator}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            amount: { ...prev.amount, operator: value as any },
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {amountOperators.map((operator) => (
                            <SelectItem
                              key={operator.value}
                              value={operator.value}
                            >
                              {operator.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount-value1">
                        {filters.amount.operator === "between"
                          ? "Minimum Amount"
                          : "Amount"}
                      </Label>
                      <Input
                        id="amount-value1"
                        type="number"
                        placeholder="0.00"
                        value={filters.amount.value1}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            amount: { ...prev.amount, value1: e.target.value },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    {filters.amount.operator === "between" && (
                      <div>
                        <Label htmlFor="amount-value2">Maximum Amount</Label>
                        <Input
                          id="amount-value2"
                          type="number"
                          placeholder="0.00"
                          value={filters.amount.value2 || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              amount: {
                                ...prev.amount,
                                value2: e.target.value,
                              },
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Clear All
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sort Modal */}
      <Dialog open={showSortModal} onOpenChange={setShowSortModal}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Sort Transactions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto">
              <div className="space-y-3">
                {sortOptions.map((option) => (
                  <div key={option.field} className="space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {option.label}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          sortField === option.field && sortDirection === "asc"
                            ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                        onClick={() => handleSortSelect(option.field, "asc")}
                      >
                        <SortAsc className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {option.ascLabel}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Ascending
                          </p>
                        </div>
                        {sortField === option.field &&
                          sortDirection === "asc" && (
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3 h-3 text-white"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          sortField === option.field && sortDirection === "desc"
                            ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                        onClick={() => handleSortSelect(option.field, "desc")}
                      >
                        <SortDesc className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {option.descLabel}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Descending
                          </p>
                        </div>
                        {sortField === option.field &&
                          sortDirection === "desc" && (
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3 h-3 text-white"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transactions List */}
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <SwipeableTransaction
            key={transaction.id}
            onEdit={() => {
              // In a real app, this would open an edit modal
              console.log("Edit transaction:", transaction.id);
              // For now, just show an alert
              alert(`Edit functionality for transaction: ${transaction.title}`);
            }}
            onDelete={() => {
              if (
                confirm(
                  `Are you sure you want to delete "${transaction.title}"?`
                )
              ) {
                onDelete(transaction.id);
              }
            }}
            onClick={() => onTransactionSelect(transaction.id)}
          >
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
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
                      {(transaction.member || transaction.person?.name) && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            with{" "}
                            {transaction.member || transaction.person?.name}
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
              onClick={() => {
                setSearchTerm("");
                clearFilters();
                onSearchToggle(false);
              }}
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
