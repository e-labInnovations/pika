import type { TransactionType } from "@/data/types";

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
  accounts: string[]; // account id
};

export type FilterTab =
  | "types"
  | "categories"
  | "tags"
  | "people"
  | "date"
  | "amount"
  | "accounts";

export const defaultFilterValues: Filter = {
  types: [] as TransactionType[],
  categories: [] as string[],
  tags: [] as string[],
  people: [] as string[],
  dateRange: { from: "", to: "" } as DateFilter,
  amount: { operator: "between", value1: "", value2: "" } as AmountFilter,
  accounts: [] as string[],
};
