import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './provider/theme-provider.tsx';
import { AuthProvider } from './provider/auth-provider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { registerSW } from 'virtual:pwa-register';

registerSW();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: Error & { response?: { status?: number } }) => {
        // Don't retry on 4xx errors (client errors)
        if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="pika-ui-theme">
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </StrictMode>
    </AuthProvider>
  </QueryClientProvider>,
);
