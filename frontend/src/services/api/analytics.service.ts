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

export interface TagActivity {
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

export interface MonthlyTagActivity {
  data: TagActivity[];
  meta: {
    month: string;
    year: number;
    totalExpenses: number;
    totalIncome: number;
    totalTransfers: number;
  };
}

export interface PersonActivity {
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

export interface MonthlyPersonActivity {
  data: PersonActivity[];
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

  getTagActivity(month: number, year: number): Promise<AxiosResponse<MonthlyTagActivity>> {
    return this.api.get<MonthlyTagActivity>(`${this.endpoint}/monthly-tag-activity`, {
      params: { month, year },
    });
  }

  getPeopleActivity(month: number, year: number): Promise<AxiosResponse<MonthlyPersonActivity>> {
    return this.api.get<MonthlyPersonActivity>(`${this.endpoint}/monthly-person-activity`, {
      params: { month, year },
    });
  }
}

export const analyticsService = new AnalyticsService();
