import type { AxiosResponse } from 'axios';
import { BaseService } from './base.service';

export interface Settings {
  currency: string;
}

export interface SettingsInput {
  key: 'currency';
  value: string;
}

class SettingsService extends BaseService<Settings> {
  constructor() {
    super('/settings');
  }

  getSettings(): Promise<AxiosResponse<Settings>> {
    return this.api.get<Settings>(this.endpoint);
  }

  updateSettingsItem(data: SettingsInput): Promise<AxiosResponse<Settings>> {
    return this.api.put(this.endpoint, data);
  }
}

export const settingsService = new SettingsService();
