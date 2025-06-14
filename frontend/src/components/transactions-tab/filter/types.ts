export const amountOperators = [
  { value: "between", label: "Between" },
  { value: "greater", label: "Greater than" },
  { value: "less", label: "Less than" },
  { value: "equal", label: "Equal to" },
  { value: "not_equal", label: "Not equal to" },
  { value: "greater_equal", label: "Greater than or equal to" },
  { value: "less_equal", label: "Less than or equal to" },
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

export const defaultFilterValues: Filter = {
  types: [] as TransactionType[],
  categories: [] as string[],
  tags: [] as string[],
  people: [] as string[],
  dateRange: { from: "", to: "" } as DateFilter,
  amount: { operator: "between", value1: "", value2: "" } as AmountFilter,
};
