import type { AxiosResponse } from 'axios';
import { BaseService } from './base.service';

export interface Settings {
  currency: string;
  gemini_api_key: string;
}

export interface SettingsInput {
  key: 'currency' | 'gemini_api_key';
  value: string;
}

class SettingsService extends BaseService<Settings> {
  constructor() {
    super('/settings');
  }

  getSettings(): Promise<AxiosResponse<Settings>> {
    return this.api.get<Settings>(this.endpoint);
  }

  updateSettingsItem(key: string, value: unknown): Promise<AxiosResponse<Settings>> {
    return this.api.put(this.endpoint, { [key]: value });
  }
}

export const settingsService = new SettingsService();
