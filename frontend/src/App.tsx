import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import './App.css';
import router from './router';
import GlobalDialogLoader from '@/components/global-dialog-loader';
import GlobalErrorDialog from '@/components/global-error-dialog';
import GlobalConfirmDialog from '@/components/global-confirm-dialog';

function App() {
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
