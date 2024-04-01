import { FC, useEffect } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { SetTransactionData, TransactionData } from '../../services/Classes/dataContext';
import NavBar from '../NavBar/NavBar';
import './Dashboard.scss';

interface DashboardProps {
   handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({handleLogout}) => {
   const updateTransactions = SetTransactionData();
   const transactions = TransactionData();


   const initialzieTransactions = async () => {
      if (transactions === null || transactions === undefined || transactions.length === 0) {
         console.log('Getting transactions');
         const res = await TransactionProcessingLocal.getAllTransactions();
         if (res) {
            updateTransactions(res);
         }
         else {
            console.log('Failed to get transactions');
         }
      }
   }

   useEffect(() => {
      console.log('Dashboard mounted')
      initialzieTransactions();
   }, [transactions, updateTransactions])

   
   return (
   <>
   <NavBar />
      <div>

         <div className='dashboard'>
            <p>Welcome to dashboard</p>
            <button onClick={handleLogout} >Logout</button>
         </div>

      </div>
   </>
   )
   }

export default Dashboard;
