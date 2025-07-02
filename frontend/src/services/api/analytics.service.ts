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

class AnalyticsService extends BaseService<unknown> {
  constructor() {
    super('/analytics');
  }

  getWeeklyExpenses(): Promise<AxiosResponse<WeeklyExpenses>> {
    return this.api.get<WeeklyExpenses>(`${this.endpoint}/weekly-expenses`);
  }
}

export const analyticsService = new AnalyticsService();
