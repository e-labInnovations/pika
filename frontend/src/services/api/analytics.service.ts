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

export interface MonthlyExpenses {
  year: number;
  month: string;
  monthName: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export interface DailyExpense {
  date: string;
  balance: number;
  income: number;
  expenses: number;
  transfers: number;
  transactionCount: number;
}

export interface DailyExpenses {
  data: Record<string, DailyExpense>;
  meta: {
    month: string;
    year: number;
  };
}

class AnalyticsService extends BaseService<unknown> {
  constructor() {
    super('/analytics');
  }

  getWeeklyExpenses(): Promise<AxiosResponse<WeeklyExpenses>> {
    return this.api.get<WeeklyExpenses>(`${this.endpoint}/weekly-expenses`);
  }

  getMonthlyExpenses(): Promise<AxiosResponse<MonthlyExpenses[]>> {
    return this.api.get<MonthlyExpenses[]>(`${this.endpoint}/monthly-expenses`);
  }

  getDailyExpenses(month: number, year: number): Promise<AxiosResponse<DailyExpenses>> {
    return this.api.get<DailyExpenses>(`${this.endpoint}/daily-expenses`, {
      params: { month, year },
    });
  }
}

export const analyticsService = new AnalyticsService();
