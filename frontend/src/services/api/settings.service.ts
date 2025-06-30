import api from './axios';

export interface Settings {
  currency: string;
}

export interface SettingsInput {
  currency: string;
}

class SettingsService {
  getSettings() {
    return api.get('/settings', {
      headers: {
        Authorization: `Basic ${localStorage.getItem('api_key')}`,
      },
    });
  }

  updateSettings(settings: Settings) {
    return api.put('/settings', settings, {
      headers: {
        Authorization: `Basic ${localStorage.getItem('api_key')}`,
      },
    });
  }
}

export const settingsService = new SettingsService();
