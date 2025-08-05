import './App.css';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import router from './router';
import GlobalDialogLoader from '@/components/global-dialog-loader';
import GlobalErrorDialog from '@/components/global-error-dialog';
import GlobalConfirmDialog from '@/components/global-confirm-dialog';
import axios from 'axios';

function App() {
  useEffect(() => {
    setupIcons();
  }, []);

  const setupIcons = async () => {
    const response = await axios.get('/pika/lucide.svg', { responseType: 'text' });
    const svg = response.data;
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = svg;
    document.body.insertBefore(div, document.body.firstChild);
  };

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors duration={3000} />
      <GlobalDialogLoader />
      <GlobalErrorDialog />
      <GlobalConfirmDialog />
    </>
  );
}

export default App;
