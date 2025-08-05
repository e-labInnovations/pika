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

export const authKey = 'pika-auth-token';

class AuthService {
  getMe() {
    return api.get('/auth/me', {
      headers: {
        Authorization: `Basic ${localStorage.getItem(authKey)}`,
      },
    });
  }
}

export const authService = new AuthService();
