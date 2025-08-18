import axios from 'axios';

const api = axios.create({
  baseURL: '/wp-json/pika/v1',
  withCredentials: true, // Enable sending cookies
});

// Interceptor to strip out wordpress_logged_in_* cookies
api.interceptors.request.use((config) => {
  // Filter out wordpress_logged_in_* cookies if they exist
  if (config.headers?.Cookie) {
    config.headers.Cookie = config.headers.Cookie.split(';')
      .map((c: string) => c.trim())
      .filter((c: string) => !c.startsWith('wordpress_logged_in_'))
      .join('; ');
  }

  return config;
});

export default api;
