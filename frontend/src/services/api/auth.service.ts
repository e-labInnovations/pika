import api from './axios';

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar_url: string;
  settings: {
    currency: string;
  };
}

class AuthService {
  getMe() {
    return api.get('/auth/me', {
      headers: {
        Authorization: `Basic ${localStorage.getItem('api_key')}`,
      },
    });
  }
}

export const authService = new AuthService();
