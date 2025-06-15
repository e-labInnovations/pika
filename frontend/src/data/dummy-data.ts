import {
  Briefcase,
  CreditCard,
  PiggyBank,
  Wallet,
  Coffee,
  ShoppingCart,
  Car,
} from "lucide-react";

export interface Transaction {
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

export interface Person {
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

export interface Account {
  id: string;
  name: string;
  icon: any;
  color: string;
  balance: number;
  type: string;
  bank?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  type: "income" | "expense" | "transfer";
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface AnalysisOutput {
  title: string;
  date: string;
  total: number;
  category: Category;
  tags: Tag[];
  notes: string;
}

export const accounts: Account[] = [
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
];

export const transactions: Transaction[] = [
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
];

export const people: Person[] = [
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
];

export const categories: Category[] = [
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
];

export const tags: Tag[] = [
  {
    id: "1",
    name: "Coffee",
    color: "bg-amber-500",
  },
  {
    id: "2",
    name: "MalabarBites",
    color: "bg-orange-500",
  },
];

export const analysisOutput: AnalysisOutput = {
  title: "Coffee at MalabarBites",
  date: "2025-06-15",
  total: 15.0,
  category: categories[0].children?.[0] as Category,
  tags: [tags[0] as Tag, tags[1] as Tag],
  notes: "This is a note about the receipt",
};
