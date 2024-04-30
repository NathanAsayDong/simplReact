import { FC, useEffect, useRef, useState } from 'react';
import NavBar from '../NavBar/NavBar'; // Make sure the path is correct
import './Dashboard.scss';
// import TransactionsTable from '../TransactionsTable/TransactionsTable';
import { LineChart } from '@mui/x-charts/LineChart';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Transaction } from '../../services/Classes/classes';
import { SetTransactionData, SetUserAccountData, TransactionData, UserAccountsData } from '../../services/Classes/dataContext';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ handleLogout }) => {
  const loadingIconRef = useRef<{ start: () => void; stop: () => void }>(null);
  const transactions = TransactionData() || [];
  const updateTransactions = SetTransactionData();
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();


  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [netValue, setNetValue] = useState<number>(0);

  
  //TO DO: In order to do the loading icon we should acutally use something called react suspense
  // useEffect(() => { 
  //   if (loadingIconRef.current) {
  //     loadingIconRef.current.start();
  //     const timer = setTimeout(() => {
  //       loadingIconRef.current?.stop();
  //     }, 3500);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  const initializeTransactions = async () => {
    if (transactions.length === 0) {
      const res = await TransactionProcessingLocal.getAllTransactions();
      console.log('this is res', res)
      if (res) {
        updateTransactions(res);
        processTransactionsIntoDates(res);
        processTransactionsIntoCategories(res);
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

  const test = async () => {
    console.log('Testing');
    console.log(transactions);
    console.log(timelineData);
  };

  const processTransactionsIntoDates = (transactions: Transaction[]) => {
    console.log('Processing transactions to dates');
    console.log('this is transactions', transactions)
    const data: any[] = [];
    transactions.forEach((transaction: Transaction) => {
      const dateIndex = data.findIndex((d) => d.date === transaction.timestamp);
      if (dateIndex === -1) {
        data.push({ date: transaction.timestamp, amount: transaction.amount });
      } else {
        data[dateIndex].amount += transaction.amount;
      }
    });
    //order the data by date
    data.sort((a, b) => a.date - b.date);
    setTimelineData(data);
    console.log('this is data', data);
  }

  const processTransactionsIntoCategories = (transactions: Transaction[]) => {  
    console.log('Processing transactions to categories');
    const data: any[] = [];
    transactions.forEach((transaction: Transaction) => {
      const categoryIndex = data.findIndex((d) => d.category === transaction.category);
      if (categoryIndex === -1) {
        data.push({ category: transaction.category, amount: transaction.amount });
      } else {
        data[categoryIndex].amount += transaction.amount;
      }
    });
    setCategoryData(data);
  }

  useEffect(() => {
    initializePage();
  }, []);


  return (
    <>
      <NavBar />
      <div className='dashboard'>
        <div className='dashboard-container'>
          <div className='row'>
            <h3 className='special-title'>Total Net Value: {netValue}</h3>
          </div>
          <div className='line-chart container' style={{width: '100%'}}>
          <LineChart
          dataset={timelineData}
            xAxis={[{dataKey: 'date', scaleType: 'time', label: 'Date'}]}
            series={[{dataKey: 'amount', area: true, color: 'rgb(104, 133, 183)', showMark: true,}]}
            tooltip={{ trigger: 'item' }}
            width={1500}
            height={400}
          />
          </div>

          <div style={{margin: '5%'}}></div>

          <div className='row'>
            <h3 className='special-title'>Categories</h3>
          </div>

          <div className='container' style={{width: '100%'}}>
            {categoryData.map((category, index) => (
              <div key={index} className='inner-row' style={{justifyContent: 'space-between'}}>
                <div className='item'>
                  <h3>Category:</h3>
                  <h3>{category.category}</h3>
                </div>
                <div className='item'>
                  <h3>Amount:</h3>
                  <h3>{category.amount}</h3>
                </div>
              </div>
            ))}
          </div>


        </div>


        <div style={{margin: '5%'}}></div>

        <button onClick={handleLogout}>Logout</button>
        <button onClick={test}>TEST</button>
        {/* <LoadingIcon ref={loadingIconRef} /> */}
      </div>
    </>
  );
};

export default Dashboard;
