import type { CurrencyCode } from '@/lib/currency-utils';
import axios from 'axios';

const API_URL = 'http://localhost:8000/wp-json/wp/v2';

export const authService = {
  login: async (token: string) => {
    // const response = await axios.get(`${API_URL}/users/me`, {
    //   headers: {
    //     Authorization: `Basic ${token}`,
    //   },
    //   params: {
    //     context: "edit",
    //   },
    // });
    // return response.data;
    const user: User = {
      id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      default_currency: 'INR',
      avatar_urls: {
        24: 'https://via.placeholder.com/24',
        48: 'https://via.placeholder.com/48',
        96: 'https://via.placeholder.com/96',
      },
      meta: [],
      description: '',
      slug: '',
    };
    return user;
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // const response = await axios.get(`${API_URL}/users/me`, {
    //   headers: {
    //     Authorization: `Basic ${token}`,
    //   },
    //   params: {
    //     context: "edit",
    //   },
    // });
    // return response.data;

    const user: User = {
      id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      default_currency: 'INR',
      avatar_urls: {
        24: 'https://via.placeholder.com/24',
        48: 'https://via.placeholder.com/48',
        96: 'https://via.placeholder.com/96',
      },
      meta: [],
      description: '',
      slug: '',
    };
    return user;
  },
};

export type User = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  slug: string;
  default_currency: CurrencyCode;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  meta: [];
};
