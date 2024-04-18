import { FC, useEffect, useRef } from 'react';
import NavBar from '../NavBar/NavBar'; // Make sure the path is correct
import './Dashboard.scss';
// import TransactionsTable from '../TransactionsTable/TransactionsTable';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { SetTransactionData, SetUserAccountData, TransactionData, UserAccountsData } from '../../services/Classes/dataContext';
import SpendingGraph from '../SpendingGraph/SpendingGraph';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ handleLogout }) => {
  const loadingIconRef = useRef<{ start: () => void; stop: () => void }>(null);
  const transactions = TransactionData() || [];
  const updateTransactions = SetTransactionData();
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  
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
      const res = await TransactionProcessingLocal.getAllTransactions();
      if (res) {
        updateTransactions(res);
      } else {
        console.log('Failed to get transactions');
      }
    }
  };

  const initializeAccounts = async () => {
    if (accounts.length === 0) {
      const res = await TransactionProcessingLocal.getAllAccounts();
      if (res) {
        updateAccounts(res);
      } else {
        console.log('Failed to get accounts');
      }
    }
  };

  const initializePage = async () => {
    await initializeTransactions();
    await initializeAccounts();
  };

  useEffect(() => {
    initializePage();
  }, []);


  return (
    <>
      <NavBar />
      <div className='dashboard'>
        <SpendingGraph transactions={transactions} />
        <button onClick={handleLogout}>Logout</button>
        {/* <LoadingIcon ref={loadingIconRef} /> */}
      </div>
    </>
  );
};

export default Dashboard;
