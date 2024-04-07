import React, { FC, useEffect, useRef } from 'react';
import LoadingIcon from '../LoadingIcon/loadingIcon'; // Make sure the path is correct
import './Dashboard.scss';
import NavBar from '../NavBar/NavBar'; // Make sure the path is correct
// import TransactionsTable from '../TransactionsTable/TransactionsTable';
import SpendingGraph from '../SpendingGraph/SpendingGraph';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { SetTransactionData, TransactionData } from '../../services/Classes/dataContext';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ handleLogout }) => {
  const loadingIconRef = useRef<{ start: () => void; stop: () => void }>(null);
  const transactions = TransactionData() || []; // Ensure transactions is never null
  const updateTransactions = SetTransactionData();

  useEffect(() => {
    if (loadingIconRef.current) {
      loadingIconRef.current.start();
      const timer = setTimeout(() => {
        loadingIconRef.current?.stop();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const initializeTransactions = async () => {
    if (transactions.length === 0) {
      console.log('Getting transactions');
      const res = await TransactionProcessingLocal.getAllTransactions();
      if (res) {
        updateTransactions(res);
      } else {
        console.log('Failed to get transactions');
      }
    }
  };

  useEffect(() => {
    initializeTransactions();
  }, [transactions, updateTransactions]);

  return (
    <>
      <NavBar />
      <div className='dashboard'>
        <p>Welcome to the dashboard</p>
        <SpendingGraph transactions={transactions} />
        <button onClick={handleLogout}>Logout</button>
        <LoadingIcon ref={loadingIconRef} />
      </div>
    </>
  );
};

export default Dashboard;
