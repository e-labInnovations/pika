import api from './axios';

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar_url: string;
  settings: {
    currency: string;
    is_api_key_set: boolean;
  };
}

export interface Session {
  uuid: string;
  app_id: string;
  name: string;
  created: string;
  last_used?: string;
  last_ip?: string;
  is_currently_using: boolean;
  device_info: {
    device_type: string; // smartphone, desktop, tablet, bot, unknown etc
    brand?: string; // Apple, Samsung, Google, etc
    model?: string; // iPhone 13, Galaxy S20, etc
    client_type?: string; // browser, app, etc
    client_name?: string; // Chrome, Safari, Firefox, etc
    os_name?: string; // iOS, Android, Windows, etc
  };
}

export interface LoginCredentials {
  user_login: string;
  password: string;
}

class AuthService {
  login(credentials: LoginCredentials) {
    return api.post<User>('/auth/login', credentials);
  }

  getMe() {
    return api.get<User>('/auth/me');
  }

  logout() {
    return api.post<{ message: string }>('/auth/logout');
  }

  getSessions() {
    return api.get<Session[]>('/auth/sessions');
  }

  revokeSession(uuid: string) {
    return api.post<{ message: string }>(`/auth/sessions/revoke`, { uuid });
  }
}

export const authService = new AuthService();
