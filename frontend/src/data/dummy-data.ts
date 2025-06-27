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
  description?: string;
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
    description: 'Chase Bank',
  },
  {
    id: '2',
    name: 'Savings Account',
    icon: 'piggy-bank',
    bgColor: '#22C55E',
    color: '#ffffff',
    balance: 8920.0,
    description: 'Federal Bank',
    avatar: 'https://i.postimg.cc/sD6vsdSz/image.webp',
  },
  {
    id: '3',
    name: 'Credit Card',
    icon: 'credit-card',
    bgColor: '#EF4444',
    color: '#ffffff',
    balance: -1250.75,
    description: 'American Express',
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
  {
    id: '1',
    name: 'Food & Dining',
    icon: 'utensils-crossed',
    color: '#FFFFFF',
    bgColor: '#E53E3E',
    description: 'Food and dining expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '2',
        name: 'Dining Out',
        icon: 'utensils',
        color: '#FFFFFF',
        bgColor: '#DD6B20',
        description: 'Restaurant and dining out expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '3',
        name: 'Groceries',
        icon: 'shopping-basket',
        color: '#FFFFFF',
        bgColor: '#38A169',
        description: 'Grocery shopping expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '4',
        name: 'Coffee & Snacks',
        icon: 'coffee',
        color: '#FFFFFF',
        bgColor: '#975A16',
        description: 'Coffee and snack expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '5',
    name: 'Shopping',
    icon: 'shopping-cart',
    color: '#FFFFFF',
    bgColor: '#D53F8C',
    description: 'Shopping expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '6',
        name: 'Clothing',
        icon: 'shirt',
        color: '#FFFFFF',
        bgColor: '#805AD5',
        description: 'Clothing and apparel expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '7',
        name: 'Electronics',
        icon: 'monitor-speaker',
        color: '#FFFFFF',
        bgColor: '#2B6CB0',
        description: 'Electronics and gadgets',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '8',
        name: 'Home Goods',
        icon: 'sofa',
        color: '#FFFFFF',
        bgColor: '#B83280',
        description: 'Home and furniture expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '9',
    name: 'Transportation',
    icon: 'car',
    color: '#FFFFFF',
    bgColor: '#3182CE',
    description: 'Transportation expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '10',
        name: 'Fuel',
        icon: 'fuel',
        color: '#FFFFFF',
        bgColor: '#C53030',
        description: 'Fuel and gas expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '11',
        name: 'Public Transit',
        icon: 'bus',
        color: '#FFFFFF',
        bgColor: '#2C5282',
        description: 'Public transportation expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '12',
        name: 'Maintenance',
        icon: 'wrench',
        color: '#FFFFFF',
        bgColor: '#744210',
        description: 'Vehicle maintenance expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '13',
    name: 'Housing',
    icon: 'home',
    color: '#FFFFFF',
    bgColor: '#319795',
    description: 'Housing expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '14',
        name: 'Rent',
        icon: 'key',
        color: '#FFFFFF',
        bgColor: '#2D3748',
        description: 'Rent payments',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '15',
        name: 'Mortgage',
        icon: 'building-2',
        color: '#FFFFFF',
        bgColor: '#2A4365',
        description: 'Mortgage payments',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '16',
        name: 'Maintenance',
        icon: 'hammer',
        color: '#FFFFFF',
        bgColor: '#B7791F',
        description: 'Home maintenance expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '17',
    name: 'Utilities',
    icon: 'zap',
    color: '#000000',
    bgColor: '#F6E05E',
    description: 'Utility bills',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '18',
        name: 'Electricity',
        icon: 'plug-zap',
        color: '#000000',
        bgColor: '#ECC94B',
        description: 'Electricity bills',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '19',
        name: 'Water',
        icon: 'droplet',
        color: '#FFFFFF',
        bgColor: '#0987A0',
        description: 'Water bills',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '20',
        name: 'Internet',
        icon: 'wifi',
        color: '#FFFFFF',
        bgColor: '#553C9A',
        description: 'Internet and phone bills',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '21',
    name: 'Entertainment',
    icon: 'film',
    color: '#FFFFFF',
    bgColor: '#ED64A6',
    description: 'Entertainment expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '22',
        name: 'Movies',
        icon: 'clapperboard',
        color: '#FFFFFF',
        bgColor: '#702459',
        description: 'Movie and theater expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '23',
        name: 'Games',
        icon: 'gamepad-2',
        color: '#FFFFFF',
        bgColor: '#4C51BF',
        description: 'Gaming expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '24',
        name: 'Music',
        icon: 'music',
        color: '#FFFFFF',
        bgColor: '#9F7AEA',
        description: 'Music and concerts',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '25',
        name: 'Sports',
        icon: 'volleyball',
        color: '#FFFFFF',
        bgColor: '#F56500',
        description: 'Sports and fitness expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '26',
    name: 'Healthcare',
    icon: 'heart-pulse',
    color: '#FFFFFF',
    bgColor: '#E53E3E',
    description: 'Healthcare expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '27',
        name: 'Medical',
        icon: 'stethoscope',
        color: '#FFFFFF',
        bgColor: '#C53030',
        description: 'Medical expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '28',
        name: 'Pharmacy',
        icon: 'pill',
        color: '#FFFFFF',
        bgColor: '#2B6CB0',
        description: 'Pharmacy expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '29',
    name: 'Education',
    icon: 'graduation-cap',
    color: '#FFFFFF',
    bgColor: '#4299E1',
    description: 'Education expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '30',
        name: 'Tuition',
        icon: 'school',
        color: '#FFFFFF',
        bgColor: '#3182CE',
        description: 'Tuition fees',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '31',
        name: 'Books',
        icon: 'book',
        color: '#FFFFFF',
        bgColor: '#2C5282',
        description: 'Books and supplies',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '32',
        name: 'Courses',
        icon: 'notebook-pen',
        color: '#FFFFFF',
        bgColor: '#2A4365',
        description: 'Online courses and training',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '33',
    name: 'Personal Care',
    icon: 'smile',
    color: '#FFFFFF',
    bgColor: '#48BB78',
    description: 'Personal care expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '34',
        name: 'Hair Care',
        icon: 'scissors',
        color: '#FFFFFF',
        bgColor: '#38A169',
        description: 'Hair care and styling',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '35',
        name: 'Skincare',
        icon: 'sparkles',
        color: '#FFFFFF',
        bgColor: '#68D391',
        description: 'Skincare and beauty',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '36',
        name: 'Fitness',
        icon: 'dumbbell',
        color: '#FFFFFF',
        bgColor: '#2F855A',
        description: 'Fitness and gym expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '37',
    name: 'Gifts',
    icon: 'gift',
    color: '#FFFFFF',
    bgColor: '#E53E3E',
    description: 'Gift expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '38',
        name: 'Birthday',
        icon: 'cake',
        color: '#FFFFFF',
        bgColor: '#ED8936',
        description: 'Birthday gifts',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '39',
        name: 'Holiday',
        icon: 'tent-tree',
        color: '#FFFFFF',
        bgColor: '#38A169',
        description: 'Holiday gifts',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '40',
        name: 'Special Occasion',
        icon: 'party-popper',
        color: '#FFFFFF',
        bgColor: '#D69E2E',
        description: 'Special occasion gifts',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '41',
    name: 'Travel',
    icon: 'plane',
    color: '#FFFFFF',
    bgColor: '#3182CE',
    description: 'Travel expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '42',
        name: 'Flights',
        icon: 'plane-takeoff',
        color: '#FFFFFF',
        bgColor: '#2B6CB0',
        description: 'Flight expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '43',
        name: 'Hotels',
        icon: 'hotel',
        color: '#FFFFFF',
        bgColor: '#B7791F',
        description: 'Hotel and accommodation',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
      {
        id: '44',
        name: 'Activities',
        icon: 'umbrella',
        color: '#FFFFFF',
        bgColor: '#319795',
        description: 'Travel activities and tours',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '45',
    name: 'Uncategorized',
    icon: 'receipt-text',
    color: '#FFFFFF',
    bgColor: '#718096',
    description: 'Uncategorized expenses',
    isSystem: true,
    isParent: true,
    type: 'expense',
    children: [
      {
        id: '46',
        name: 'Other',
        icon: 'receipt-text',
        color: '#FFFFFF',
        bgColor: '#4A5568',
        description: 'Other expenses',
        isSystem: true,
        isParent: false,
        type: 'expense',
        children: [],
      },
    ],
  },
  {
    id: '47',
    name: 'Work',
    icon: 'briefcase',
    color: '#FFFFFF',
    bgColor: '#38A169',
    description: 'Work-related income',
    isSystem: true,
    isParent: true,
    type: 'income',
    children: [
      {
        id: '48',
        name: 'Salary',
        icon: 'dollar-sign',
        color: '#FFFFFF',
        bgColor: '#48BB78',
        description: 'Regular salary income',
        isSystem: true,
        isParent: false,
        type: 'income',
        children: [],
      },
      {
        id: '49',
        name: 'Bonus',
        icon: 'gem',
        color: '#FFFFFF',
        bgColor: '#ECC94B',
        description: 'Bonus and incentives',
        isSystem: true,
        isParent: false,
        type: 'income',
        children: [],
      },
      {
        id: '50',
        name: 'Freelance',
        icon: 'laptop',
        color: '#FFFFFF',
        bgColor: '#4299E1',
        description: 'Freelance income',
        isSystem: true,
        isParent: false,
        type: 'income',
        children: [],
      },
      {
        id: '51',
        name: 'Investment',
        icon: 'trending-up',
        color: '#FFFFFF',
        bgColor: '#2F855A',
        description: 'Investment returns',
        isSystem: true,
        isParent: false,
        type: 'income',
        children: [],
      },
    ],
  },
  {
    id: '52',
    name: 'Uncategorized',
    icon: 'receipt-text',
    color: '#FFFFFF',
    bgColor: '#718096',
    description: 'Uncategorized income',
    isSystem: true,
    isParent: true,
    type: 'income',
    children: [
      {
        id: '53',
        name: 'Other',
        icon: 'receipt-text',
        color: '#FFFFFF',
        bgColor: '#4A5568',
        description: 'Other income sources',
        isSystem: true,
        isParent: false,
        type: 'income',
        children: [],
      },
    ],
  },
  {
    id: '54',
    name: 'Transfer',
    icon: 'piggy-bank',
    color: '#FFFFFF',
    bgColor: '#319795',
    description: 'Transfer expenses',
    isSystem: true,
    isParent: true,
    type: 'transfer',
    children: [
      {
        id: '55',
        name: 'Bank Transfer',
        icon: 'landmark',
        color: '#FFFFFF',
        bgColor: '#2C5282',
        description: 'Bank transfers',
        isSystem: true,
        isParent: false,
        type: 'transfer',
        children: [],
      },
      {
        id: '56',
        name: 'ATM',
        icon: 'hand-coins',
        color: '#FFFFFF',
        bgColor: '#B7791F',
        description: 'ATM withdrawals',
        isSystem: true,
        isParent: false,
        type: 'transfer',
        children: [],
      },
      {
        id: '57',
        name: 'CDM',
        icon: 'badge-dollar-sign',
        color: '#FFFFFF',
        bgColor: '#D69E2E',
        description: 'Cash deposit machine',
        isSystem: true,
        isParent: false,
        type: 'transfer',
        children: [],
      },
    ],
  },
  {
    id: '58',
    name: 'Uncategorized',
    icon: 'receipt-text',
    color: '#FFFFFF',
    bgColor: '#718096',
    description: 'Uncategorized transfer',
    isSystem: true,
    isParent: true,
    type: 'transfer',
    children: [
      {
        id: '59',
        name: 'Other',
        icon: 'receipt-text',
        color: '#FFFFFF',
        bgColor: '#4A5568',
        description: 'Other transfers',
        isSystem: true,
        isParent: false,
        type: 'transfer',
        children: [],
      },
    ],
  },
];

export const tags: Tag[] = [
  {
    id: '1',
    name: 'Initial Balance',
    color: '#FFFFFF',
    bgColor: '#38A169',
    icon: 'plus-circle',
    description: 'Initial account balance transaction',
    isSystem: true,
  },
  {
    id: '2',
    name: 'Recurring',
    color: '#FFFFFF',
    bgColor: '#3182CE',
    icon: 'repeat',
    description: 'Recurring transactions',
    isSystem: true,
  },
  {
    id: '3',
    name: 'Urgent',
    color: '#FFFFFF',
    bgColor: '#E53E3E',
    icon: 'alert-circle',
    description: 'Urgent transactions',
    isSystem: true,
  },
  {
    id: '4',
    name: 'Shared',
    color: '#FFFFFF',
    bgColor: '#805AD5',
    icon: 'users',
    description: 'Shared expenses',
    isSystem: true,
  },
  {
    id: '5',
    name: 'Personal',
    color: '#FFFFFF',
    bgColor: '#DD6B20',
    icon: 'user',
    description: 'Personal transactions',
    isSystem: true,
  },
  {
    id: '6',
    name: 'Business',
    color: '#FFFFFF',
    bgColor: '#2D3748',
    icon: 'briefcase-business',
    description: 'Business transactions',
    isSystem: true,
  },
  {
    id: '7',
    name: 'Coffee',
    icon: 'coffee',
    color: '#ffffff',
    bgColor: '#f59e0b',
    description: 'Coffee at MalabarBites',
    isSystem: false,
  },
  {
    id: '8',
    name: 'MalabarBites',
    icon: 'cookie',
    color: '#ffffff',
    bgColor: '#f97316',
    description: 'MalabarBites',
    isSystem: false,
  },
  {
    id: '9',
    name: 'CasualTea',
    icon: 'coffee',
    color: '#ffffff',
    bgColor: '#2563eb',
    description: 'Casual Tea',
    isSystem: false,
  },
  {
    id: '10',
    name: 'Birthday',
    icon: 'cake',
    color: '#ffffff',
    bgColor: '#10b981',
    description: 'Birthday',
    isSystem: false,
  },
  {
    id: '11',
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
