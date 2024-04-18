import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import Accounts from './components/Accounts/Accounts';
import Budgets from './components/Budgets/Budgets';
import UploadTransactions from './components/uploadTransactions/uploadTransactions';
import './index.css';
import { AppDataProvider } from './services/Classes/dataContext';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>404 Not Found</h1>
  },
  {
    path: '/budgets',
    element: <Budgets />,
    errorElement: <h1>404 Not Found</h1>
  },
  {
    path: '/upload',
    element: <UploadTransactions />,
    errorElement: <h1>404 Not Found</h1>
  },
  {
    path: '/accounts',
    element: <Accounts />,
    errorElement: <h1>404 Not Found</h1>
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppDataProvider>
      <RouterProvider router={router} />
    </AppDataProvider>
  </React.StrictMode>,
);
