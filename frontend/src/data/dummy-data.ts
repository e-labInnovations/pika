import type { TransactionType } from '@/lib/transaction-utils';

export interface Person {
  id: string;
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
  id: string;
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
  isSystem: boolean;
  isParent: boolean;
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
  isSystem: boolean;
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
  type: 'image' | 'pdf';
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
  toAccount?: TransactionAccount;
}

export interface AnalysisOutput {
  title: string;
  date: string;
  total: number;
  category: Category;
  tags: Tag[];
  note: string;
}

export interface WeeklyExpense {
  day: string;
  amount: number;
}

export const accounts: Account[] = [
  {
    id: '1',
    name: 'Checking Account',
    icon: 'wallet',
    bgColor: '#3B82F6',
    color: '#ffffff',
    balance: 2450.5,
    type: 'checking',
    bank: 'Chase Bank',
  },
  {
    id: '2',
    name: 'Savings Account',
    icon: 'piggy-bank',
    bgColor: '#22C55E',
    color: '#ffffff',
    balance: 8920.0,
    type: 'savings',
    bank: 'Chase Bank',
  },
  {
    id: '3',
    name: 'Credit Card',
    icon: 'credit-card',
    bgColor: '#EF4444',
    color: '#ffffff',
    balance: -1250.75,
    type: 'credit',
    bank: 'American Express',
  },
];

export const people: Person[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    description: 'College friend and roommate',
    balance: 125.5,
    lastTransaction: '2024-11-15',
    transactionCount: 12,
    totalSpent: 450.75,
    totalReceived: 325.25,
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?u=john',
    email: 'john@example.com',
    phone: '+1 (555) 987-6543',
    description: 'Work colleague',
    balance: -25.75,
    lastTransaction: '2024-11-15',
    transactionCount: 8,
    totalSpent: 200.0,
    totalReceived: 174.25,
  },
  {
    id: '3',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 (555) 123-4567',
    description: 'College friend and roommate',
    balance: 125.5,
    lastTransaction: '2024-11-15',
    transactionCount: 12,
    totalSpent: 450.75,
    totalReceived: 325.25,
  },
  {
    id: '4',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    email: 'michael@example.com',
    phone: '+1 (555) 234-5678',
    description: 'Gym buddy and workout partner',
    balance: -45.25,
    lastTransaction: '2024-11-14',
    transactionCount: 15,
    totalSpent: 325.5,
    totalReceived: 280.25,
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    email: 'emily@example.com',
    phone: '+1 (555) 345-6789',
    description: 'Neighbor and dog sitter',
    balance: 75.0,
    lastTransaction: '2024-11-13',
    transactionCount: 6,
    totalSpent: 150.0,
    totalReceived: 225.0,
  },
  {
    id: '6',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?u=david',
    email: 'david@example.com',
    phone: '+1 (555) 456-7890',
    description: 'Book club member',
    balance: 0.0,
    lastTransaction: '2024-11-12',
    transactionCount: 4,
    totalSpent: 120.0,
    totalReceived: 120.0,
  },
];

export const categories: Category[] = [
  // System Expense Categories
  {
    id: '1',
    name: 'Food & Dining',
    icon: 'shopping-cart',
    bgColor: '#f97316',
    color: '#ffffff',
    type: 'expense',
    description: 'Food & Dining',
    isSystem: true,
    isParent: true,
    children: [
      {
        id: '2',
        name: 'Restaurants',
        icon: 'shopping-cart',
        bgColor: '#8B5CF6',
        color: '#ffffff',
        type: 'expense',
        description: 'Restaurants',
        isSystem: true,
        isParent: false,
      },
      {
        id: '3',
        name: 'Groceries',
        icon: 'shopping-cart',
        bgColor: '#EC4899',
        color: '#ffffff',
        type: 'expense',
        description: 'Groceries',
        isSystem: true,
        isParent: false,
      },
      {
        id: '22',
        name: 'Takeout',
        icon: 'utensils',
        bgColor: '#22C55E',
        color: '#ffffff',
        type: 'expense',
        description: 'Takeout',
        isSystem: true,
        isParent: false,
      },
    ],
  },
  {
    id: '4',
    name: 'Transportation',
    icon: 'car',
    bgColor: '#3B82F6',
    color: '#ffffff',
    type: 'expense',
    description: 'Transportation',
    isSystem: true,
    isParent: true,
    children: [
      {
        id: '5',
        name: 'Gas',
        icon: 'car',
        bgColor: '#14B8A6',
        color: '#ffffff',
        type: 'expense',
        description: 'Gas',
        isSystem: true,
        isParent: false,
      },
      {
        id: '6',
        name: 'Public Transit',
        icon: 'car',
        bgColor: '#F59E0B',
        color: '#ffffff',
        type: 'expense',
        description: 'Public Transit',
        isSystem: true,
        isParent: false,
      },
    ],
  },
  // User Expense Categories
  {
    id: '7',
    name: 'Entertainment',
    icon: 'tv',
    bgColor: '#8B5CF6',
    color: '#ffffff',
    type: 'expense',
    description: 'Entertainment',
    isSystem: false,
    isParent: true,
    children: [
      {
        id: '8',
        name: 'Movies',
        icon: 'film',
        bgColor: '#22C55E',
        color: '#ffffff',
        type: 'expense',
        description: 'Movies',
        isSystem: false,
        isParent: false,
      },
      {
        id: '9',
        name: 'Gaming',
        icon: 'gamepad',
        bgColor: '#EF4444',
        color: '#ffffff',
        type: 'expense',
        description: 'Gaming',
        isSystem: false,
        isParent: false,
      },
    ],
  },
  // System Income Categories
  {
    id: '10',
    name: 'Salary',
    icon: 'briefcase',
    bgColor: '#22C55E',
    color: '#ffffff',
    type: 'income',
    description: 'Salary',
    isSystem: true,
    isParent: true,
    children: [
      {
        id: '11',
        name: 'Monthly Salary',
        icon: 'briefcase',
        bgColor: '#6366F1',
        color: '#ffffff',
        type: 'income',
        description: 'Monthly Salary',
        isSystem: true,
        isParent: false,
      },
      {
        id: '12',
        name: 'Bonus',
        icon: 'gift',
        bgColor: '#F59E0B',
        color: '#ffffff',
        type: 'income',
        description: 'Bonus',
        isSystem: true,
        isParent: false,
      },
    ],
  },
  // User Income Categories
  {
    id: '13',
    name: 'Freelance',
    icon: 'laptop',
    bgColor: '#EC4899',
    color: '#ffffff',
    type: 'income',
    description: 'Freelance',
    isSystem: false,
    isParent: true,
    children: [
      {
        id: '14',
        name: 'Web Development',
        icon: 'code',
        bgColor: '#3B82F6',
        color: '#ffffff',
        type: 'income',
        description: 'Web Development',
        isSystem: false,
        isParent: false,
      },
      {
        id: '15',
        name: 'Consulting',
        icon: 'users',
        bgColor: '#14B8A6',
        color: '#ffffff',
        type: 'income',
        description: 'Consulting',
        isSystem: false,
        isParent: false,
      },
    ],
  },
  // System Transfer Categories
  {
    id: '16',
    name: 'Account Transfer',
    icon: 'arrow-left-right',
    bgColor: '#6366F1',
    color: '#ffffff',
    type: 'transfer',
    description: 'Account Transfer',
    isSystem: true,
    isParent: true,
    children: [
      {
        id: '17',
        name: 'Savings Transfer',
        icon: 'piggy-bank',
        bgColor: '#F59E0B',
        color: '#ffffff',
        type: 'transfer',
        description: 'Savings Transfer',
        isSystem: true,
        isParent: false,
      },
      {
        id: '18',
        name: 'Investment Transfer',
        icon: 'trending-up',
        bgColor: '#EF4444',
        color: '#ffffff',
        type: 'transfer',
        description: 'Investment Transfer',
        isSystem: true,
        isParent: false,
      },
    ],
  },
  // User Transfer Categories
  {
    id: '19',
    name: 'Custom Transfer',
    icon: 'refresh-cw',
    bgColor: '#14B8A6',
    color: '#ffffff',
    type: 'transfer',
    description: 'Custom Transfer',
    isSystem: false,
    isParent: true,
    children: [
      {
        id: '20',
        name: 'Emergency Fund',
        icon: 'shield',
        bgColor: '#8B5CF6',
        color: '#ffffff',
        type: 'transfer',
        description: 'Emergency Fund',
        isSystem: false,
        isParent: false,
      },
      {
        id: '21',
        name: 'Vacation Fund',
        icon: 'plane',
        bgColor: '#EC4899',
        color: '#ffffff',
        type: 'transfer',
        description: 'Vacation Fund',
        isSystem: false,
        isParent: false,
      },
    ],
  },
];

export const tags: Tag[] = [
  {
    id: '0',
    name: 'Recurring',
    icon: 'repeat',
    color: '#ffffff',
    bgColor: '#000000',
    description: 'Recurring transactions',
    isSystem: true,
  },
  {
    id: '1',
    name: 'Coffee',
    icon: 'coffee',
    color: '#ffffff',
    bgColor: '#f59e0b',
    description: 'Coffee at MalabarBites',
    isSystem: false,
  },
  {
    id: '2',
    name: 'MalabarBites',
    icon: 'hamburger',
    color: '#ffffff',
    bgColor: '#f97316',
    description: 'MalabarBites',
    isSystem: false,
  },
  {
    id: '3',
    name: 'CasualTea',
    icon: 'coffee',
    color: '#ffffff',
    bgColor: '#2563eb',
    description: 'Casual Tea',
    isSystem: false,
  },
  {
    id: '4',
    name: 'Birthday',
    icon: 'cake',
    color: '#ffffff',
    bgColor: '#10b981',
    description: 'Birthday',
    isSystem: false,
  },
  {
    id: '5',
    name: 'WeddingGift',
    icon: 'gift',
    color: '#ffffff',
    bgColor: '#ef4444',
    description: 'Wedding Gift',
    isSystem: false,
  },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.5,
    date: '2024-11-15T14:30:00.000Z',
    type: 'expense',
    category: categories[0].children?.[0] as Category,
    account: accounts[0],
    tags: [tags[0], tags[1], tags[2], tags[3], tags[4]],
    person: people[1],
    note: 'This is a note about the receipt',
    attachments: [
      {
        id: '1',
        name: 'receipt.pdf',
        url: 'https://example.com/receipt.pdf',
        type: 'pdf',
      },
      {
        id: '2',
        name: 'payslip.jpg',
        url: 'https://placehold.co/600x400',
        type: 'image',
      },
    ],
  },
  {
    id: '2',
    title: 'Coffee with John',
    amount: 12.75,
    date: '2024-11-15T09:15:00.000Z',
    type: 'expense',
    category: categories[1].children?.[0] as Category,
    account: accounts[1],
    tags: [tags[1]],
    person: people[1],
    note: 'This is a note about the receipt',
  },
  {
    id: '3',
    title: 'Salary Deposit',
    amount: 3500.0,
    date: '2024-11-14T08:00:00.000Z',
    type: 'income',
    category: categories[2].children?.[0] as Category,
    account: accounts[0],
    tags: [tags[0]],
    note: 'This is a note about the receipt',
    attachments: [
      {
        id: '2',
        name: 'payslip.jpg',
        url: 'https://placehold.co/600x400',
        type: 'image',
      },
    ],
  },
  {
    id: '4',
    title: 'Transfer to Savings',
    amount: 500.0,
    date: '2024-11-13T10:00:00.000Z',
    type: 'transfer',
    category: categories[1].children?.[0] as Category,
    account: accounts[0],
    toAccount: accounts[1],
    tags: [],
    note: 'Monthly savings transfer',
  },
  {
    id: '5',
    title: 'Freelance Payment',
    amount: 1200.0,
    date: '2024-11-12T15:45:00.000Z',
    type: 'income',
    category: categories[2].children?.[0] as Category,
    account: accounts[0],
    tags: [tags[0]],
    note: 'Payment for website development project',
    attachments: [
      {
        id: '3',
        name: 'invoice.pdf',
        url: 'https://example.com/invoice.pdf',
        type: 'pdf',
      },
    ],
  },
  {
    id: '6',
    title: 'Restaurant Dinner',
    amount: 65.25,
    date: '2024-11-12T19:30:00.000Z',
    type: 'expense',
    category: categories[1].children?.[1] as Category,
    account: accounts[2],
    tags: [tags[1]],
    person: people[0],
    note: 'Dinner at Italian restaurant',
  },
  {
    id: '7',
    title: 'Credit Card Payment',
    amount: 800.0,
    date: '2024-11-11T09:00:00.000Z',
    type: 'transfer',
    category: categories[1].children?.[0] as Category,
    account: accounts[0],
    toAccount: accounts[2],
    tags: [],
    note: 'Monthly credit card payment',
  },
  {
    id: '8',
    title: 'Gym Membership',
    amount: 45.0,
    date: '2024-11-10T08:00:00.000Z',
    type: 'expense',
    category: categories[0].children?.[0] as Category,
    account: accounts[0],
    tags: [tags[4]],
    note: 'Monthly gym membership fee',
  },
];

export const analysisOutput: AnalysisOutput = {
  title: 'Coffee at MalabarBites',
  date: '2025-06-15',
  total: 15.0,
  category: categories[0].children?.[0] as Category,
  tags: [tags[0] as Tag, tags[1] as Tag],
  note: 'This is a note about the receipt',
};

export const weeklyExpenses = [
  { day: 'Mon', amount: 45.5 },
  { day: 'Tue', amount: 120.0 },
  { day: 'Wed', amount: 85.25 },
  { day: 'Thu', amount: 200.0 },
  { day: 'Fri', amount: 95.75 },
  { day: 'Sat', amount: 180.5 },
  { day: 'Sun', amount: 65.0 },
];
