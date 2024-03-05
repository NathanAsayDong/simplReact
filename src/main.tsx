import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import Budgets from './components/Budgets/Budgets';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>404 Not Found</h1>
  },
  //add new paths here
  // {
  //   path: '/budgets',
  //   element: <Budgets />,
  //   errorElement: <h1>404 Not Found</h1>
  // },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
