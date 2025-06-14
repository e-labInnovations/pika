import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight } from "lucide-react";

export const amountOperators = [
  { value: "between", label: "Between", shortLabel: "" },
  { value: "greater", label: "Greater than", shortLabel: "<" },
  { value: "less", label: "Less than", shortLabel: ">" },
  { value: "equal", label: "Equal to", shortLabel: "=" },
  { value: "not_equal", label: "Not equal to", shortLabel: "≠" },
  {
    value: "greater_equal",
    label: "Greater than or equal to",
    shortLabel: "≥",
  },
  { value: "less_equal", label: "Less than or equal to", shortLabel: "≤" },
];

export type TransactionType = "income" | "expense" | "transfer";

export type AmountOperator = (typeof amountOperators)[number]["value"];

export type AmountFilter = {
  operator: AmountOperator;
  value1: string;
  value2?: string; // For "between" operator
};

export type DateFilter = {
  from: string;
  to: string;
};

export type Filter = {
  types: TransactionType[];
  people: string[]; // person id
  categories: string[]; // category id
  tags: string[]; // tag id
  amount: AmountFilter;
  dateRange: DateFilter;
};

export type FilterTab =
  | "types"
  | "categories"
  | "tags"
  | "people"
  | "date"
  | "amount";

export const defaultFilterValues: Filter = {
  types: [] as TransactionType[],
  categories: [] as string[],
  tags: [] as string[],
  people: [] as string[],
  dateRange: { from: "", to: "" } as DateFilter,
  amount: { operator: "between", value1: "", value2: "" } as AmountFilter,
};

type TransactionItemType = {
  id: TransactionType;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
};

export const transactionTypes: TransactionItemType[] = [
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
