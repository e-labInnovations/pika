import axios from 'axios';
import { authKey } from './auth.service';

const api = axios.create({
  baseURL: '/wp-json/pika/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(authKey);
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

export default api;
