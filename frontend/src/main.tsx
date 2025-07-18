import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './provider/theme-provider.tsx';
import { AuthProvider } from './provider/auth-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </StrictMode>
  </AuthProvider>,
);
