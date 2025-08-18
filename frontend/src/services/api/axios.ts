import axios from 'axios';
import { authKey } from './auth.service';

const api = axios.create({
  baseURL: '/wp-json/pika/v1',
  withCredentials: false, // Don't send cookies by default
});

// Interceptor to strip out wordpress_logged_in_* cookies
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(authKey);
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }

  // Filter out wordpress_logged_in_* cookies if they exist
  console.log('config.headers.Cookie - before', config.headers.Cookie);
  if (config.headers?.Cookie) {
    config.headers.Cookie = config.headers.Cookie.split(';')
      .map((c: string) => c.trim())
      .filter((c: string) => !c.startsWith('wordpress_logged_in_'))
      .join('; ');
    console.log('config.headers.Cookie - after', config.headers.Cookie);
  }

  return config;
});

export default api;
