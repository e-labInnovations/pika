import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight } from "lucide-react";
import type { TransactionType } from "@/data/types";

export type TransactionItemType = {
  id: TransactionType;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  tabBgColor: {
    light: string;
    dark: string;
  };
  icon: React.ElementType;
};

export const transactionTypes: TransactionItemType[] = [
  {
    id: "income",
    name: "Income",
    description: "Money received",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
    tabBgColor: {
      light: "bg-emerald-100",
      dark: "bg-emerald-900",
    },
    icon: ArrowDownLeft,
  },
  {
    id: "expense",
    name: "Expense",
    description: "Money spent",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
    tabBgColor: {
      light: "bg-red-100",
      dark: "bg-red-900",
    },
    icon: ArrowUpRight,
  },
  {
    id: "transfer",
    name: "Transfer",
    description: "Money moved between accounts",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    tabBgColor: {
      light: "bg-blue-100",
      dark: "bg-blue-900",
    },
    icon: ArrowRightLeft,
  },
];
