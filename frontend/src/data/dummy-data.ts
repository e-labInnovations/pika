import type { TransactionType } from "@/data/types";

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

type TransactionPerson = {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
};

export interface Account {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  avatar?: string;
  color: string;
  balance: number;
  type: string;
  bank?: string;
}

export interface TransactionAccount {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  type: TransactionType;
  description: string;
  children?: Category[];
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

export interface TransactionTag {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface TransactionAttachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "pdf";
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  account: TransactionAccount;
  tags: TransactionTag[];
  person?: TransactionPerson;
  note: string;
  attachments?: TransactionAttachment[];
}

export interface AnalysisOutput {
  title: string;
  date: string;
  total: number;
  category: Category;
  tags: Tag[];
  notes: string;
}

export interface WeeklyExpense {
  day: string;
  amount: number;
}

export const accounts: Account[] = [
  {
    id: "checking",
    name: "Checking Account",
    icon: "wallet",
    bgColor: "#3B82F6",
    color: "#ffffff",
    balance: 2450.5,
    type: "checking",
    bank: "Chase Bank",
  },
  {
    id: "savings",
    name: "Savings Account",
    icon: "piggy-bank",
    bgColor: "#22C55E",
    color: "#ffffff",
    balance: 8920.0,
    type: "savings",
    bank: "Chase Bank",
  },
  {
    id: "credit",
    name: "Credit Card",
    icon: "credit-card",
    bgColor: "#EF4444",
    color: "#ffffff",
    balance: -1250.75,
    type: "credit",
    bank: "American Express",
  },
];

export const people: Person[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
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
    avatar: "https://i.pravatar.cc/150?u=john",
    email: "john@example.com",
    phone: "+1 (555) 987-6543",
    description: "Work colleague",
    balance: -25.75,
    lastTransaction: "2024-11-15",
    transactionCount: 8,
    totalSpent: 200.0,
    totalReceived: 174.25,
  },
  {
    id: 3,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    description: "College friend and roommate",
    balance: 125.5,
    lastTransaction: "2024-11-15",
    transactionCount: 12,
    totalSpent: 450.75,
    totalReceived: 325.25,
  },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "Food & Dining",
    icon: "shopping-cart",
    bgColor: "#f97316",
    color: "#ffffff",
    type: "expense",
    description: "Food & Dining",
    children: [
      {
        id: "2",
        name: "Restaurants",
        icon: "shopping-cart",
        bgColor: "#f97316",
        color: "#ffffff",
        type: "expense",
        description: "Restaurants",
      },
      {
        id: "3",
        name: "Groceries",
        icon: "shopping-cart",
        bgColor: "#f97316",
        color: "#ffffff",
        type: "expense",
        description: "Groceries",
      },
    ],
  },
  {
    id: "4",
    name: "Transportation",
    icon: "car",
    bgColor: "#3B82F6",
    color: "#ffffff",
    type: "expense",
    description: "Transportation",
    children: [
      {
        id: "5",
        name: "Gas",
        icon: "car",
        bgColor: "#3B82F6",
        color: "#ffffff",
        type: "expense",
        description: "Gas",
      },
      {
        id: "6",
        name: "Public Transit",
        icon: "car",
        bgColor: "#3B82F6",
        color: "#ffffff",
        type: "expense",
        description: "Public Transit",
      },
    ],
  },
  {
    id: "7",
    name: "Income",
    icon: "briefcase",
    bgColor: "#22C55E",
    color: "#ffffff",
    type: "income",
    description: "Income",
    children: [
      {
        id: "8",
        name: "Salary",
        icon: "briefcase",
        bgColor: "#22C55E",
        color: "#ffffff",
        type: "income",
        description: "Salary",
      },
      {
        id: "9",
        name: "Freelance",
        icon: "briefcase",
        bgColor: "#22C55E",
        color: "#ffffff",
        type: "income",
        description: "Freelance",
      },
    ],
  },
];

export const tags: Tag[] = [
  {
    id: "1",
    name: "Coffee",
    icon: "coffee",
    color: "#ffffff",
    bgColor: "#f59e0b",
    description: "Coffee at MalabarBites",
  },
  {
    id: "2",
    name: "MalabarBites",
    icon: "hamburger",
    color: "#ffffff",
    bgColor: "#f97316",
    description: "MalabarBites",
  },
  {
    id: "3",
    name: "CasualTea",
    icon: "coffee",
    color: "#ffffff",
    bgColor: "#2563eb",
    description: "Casual Tea",
  },
  {
    id: "4",
    name: "Birthday",
    icon: "cake",
    color: "#ffffff",
    bgColor: "#10b981",
    description: "Birthday",
  },
  {
    id: "5",
    name: "WeddingGift",
    icon: "gift",
    color: "#ffffff",
    bgColor: "#ef4444",
    description: "Wedding Gift",
  },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    amount: 85.5,
    date: "2024-11-15T14:30:00.000Z",
    type: "expense",
    category: categories[0],
    account: accounts[0],
    tags: [tags[0], tags[1], tags[2], tags[3], tags[4]],
    person: people[1],
    note: "This is a note about the receipt",
    attachments: [
      {
        id: "1",
        name: "receipt.pdf",
        url: "https://example.com/receipt.pdf",
        type: "pdf",
      },
      {
        id: "2",
        name: "payslip.jpg",
        url: "https://placehold.co/600x400",
        type: "image",
      },
    ],
  },
  {
    id: "2",
    title: "Coffee with John",
    amount: 12.75,
    date: "2024-11-15T09:15:00.000Z",
    type: "expense",
    category: categories[1],
    account: accounts[1],
    tags: [tags[1]],
    person: people[1],
    note: "This is a note about the receipt",
  },
  {
    id: "3",
    title: "Salary Deposit",
    amount: 3500.0,
    date: "2024-11-14T08:00:00.000Z",
    type: "income",
    category: categories[2],
    account: accounts[0],
    tags: [tags[0]],
    note: "This is a note about the receipt",
    attachments: [
      {
        id: "2",
        name: "payslip.jpg",
        url: "https://placehold.co/600x400",
        type: "image",
      },
    ],
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

export const weeklyExpenses = [
  { day: "Mon", amount: 45.5 },
  { day: "Tue", amount: 120.0 },
  { day: "Wed", amount: 85.25 },
  { day: "Thu", amount: 200.0 },
  { day: "Fri", amount: 95.75 },
  { day: "Sat", amount: 180.5 },
  { day: "Sun", amount: 65.0 },
];
