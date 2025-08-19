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
  last_used: string;
  last_ip: string;
  is_currently_using: boolean;
}

export interface AppInfo {
  name: string;
  version: string;
  description: string;
  app_id: string;
  base_url: string;
}

export interface LoginCredentials {
  user_login: string;
  password: string;
}

class AuthService {
  getAppInfo() {
    return api.get<AppInfo>('/auth/app-info');
  }

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
