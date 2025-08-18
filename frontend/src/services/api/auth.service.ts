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
}

export const authService = new AuthService();
