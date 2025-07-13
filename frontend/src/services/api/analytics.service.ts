import type { AxiosResponse } from 'axios';
import { BaseService } from './base.service';

export interface WeeklyExpenses {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  monthName: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
  savingsRate: number;
  avgDaily: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
}

export interface DailySummary {
  date: string;
  balance: number;
  income: number;
  expenses: number;
  transfers: number;
  transactionCount: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
  transferTransactionCount: number;
}

export interface DailySummaries {
  data: Record<string, DailySummary>;
  meta: {
    month: string;
    year: number;
  };
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  categoryBgColor: string;
  isParent: boolean;
  isSystem: boolean;
  parentId: string | null;
  amount: number;
  transactionCount: number;
  averagePerTransaction: number;
  highestTransaction: number;
  lowestTransaction: number;
  description: string;
}

export interface MonthlyCategorySpending {
  data: CategorySpending[];
  meta: {
    month: string;
    year: number;
    totalExpenses: number;
  };
}

export interface TagSpending {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
  isSystem: boolean;
  totalAmount: number; // Net amount (income - expenses)
  totalTransactionCount: number;
  expenseAmount: number;
  expenseTransactionCount: number;
  incomeAmount: number;
  incomeTransactionCount: number;
  transferAmount: number;
  transferTransactionCount: number;
  averagePerTransaction: number;
  highestTransaction: number;
  lowestTransaction: number;
}

export interface MonthlyTagSpending {
  data: TagSpending[];
  meta: {
    month: string;
    year: number;
    totalExpenses: number;
    totalIncome: number;
    totalTransfers: number;
  };
}

export interface PersonSpending {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  avatarUrl: string | null;
  balance: number; // Overall balance (positive = they owe you, negative = you owe them)
  totalAmount: number; // Net amount for this month (income - expenses)
  totalTransactionCount: number;
  expenseAmount: number;
  expenseTransactionCount: number;
  incomeAmount: number;
  incomeTransactionCount: number;
  averagePerTransaction: number;
  highestTransaction: number;
  lowestTransaction: number;
  lastTransactionAt: string | null;
}

export interface MonthlyPersonSpending {
  data: PersonSpending[];
  meta: {
    month: string;
    year: number;
    totalExpenses: number;
    totalIncome: number;
    totalTransfers: number;
  };
}

class AnalyticsService extends BaseService<unknown> {
  constructor() {
    super('/analytics');
  }

  getWeeklyExpenses(): Promise<AxiosResponse<WeeklyExpenses>> {
    return this.api.get<WeeklyExpenses>(`${this.endpoint}/weekly-expenses`);
  }

  getMonthlySummary(month: number, year: number): Promise<AxiosResponse<MonthlySummary>> {
    return this.api.get<MonthlySummary>(`${this.endpoint}/monthly-summary`, {
      params: { month, year },
    });
  }

  getDailySummaries(month: number, year: number): Promise<AxiosResponse<DailySummaries>> {
    return this.api.get<DailySummaries>(`${this.endpoint}/daily-summaries`, {
      params: { month, year },
    });
  }

  getCategorySpending(month: number, year: number): Promise<AxiosResponse<MonthlyCategorySpending>> {
    return this.api.get<MonthlyCategorySpending>(`${this.endpoint}/monthly-category-spending`, {
      params: { month, year },
    });
  }

  getTagSpending(month: number, year: number): Promise<AxiosResponse<MonthlyTagSpending>> {
    return this.api.get<MonthlyTagSpending>(`${this.endpoint}/monthly-tag-spending`, {
      params: { month, year },
    });
  }

  getPeopleSpending(month: number, year: number): Promise<AxiosResponse<MonthlyPersonSpending>> {
    return this.api.get<MonthlyPersonSpending>(`${this.endpoint}/monthly-person-spending`, {
      params: { month, year },
    });
  }
}

export const analyticsService = new AnalyticsService();
