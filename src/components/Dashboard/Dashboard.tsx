import { FC, useEffect, useRef, useState } from 'react';
import NavBar from '../NavBar/NavBar'; // Make sure the path is correct
import './Dashboard.scss';
// import TransactionsTable from '../TransactionsTable/TransactionsTable';
import { LineChart } from '@mui/x-charts/LineChart';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Transaction } from '../../services/Classes/classes';
import { SetTransactionData, SetUserAccountData, TransactionData, UserAccountsData } from '../../services/Classes/dataContext';
import { convertNumberToCurrency } from '../../services/Classes/formatService';

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
  const [netValueOverTime, setNetValueOverTime] = useState<any[]>([]);

  
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

  useEffect(() => {
    console.log('net value over time', netValueOverTime);
  }, [netValueOverTime]);

  const initializeTransactions = async () => {
    if (transactions.length === 0) {
      const res = await TransactionProcessingLocal.getAllTransactions();
      if (res) {
        await initializeAccounts();
        await processTransactionsIntoDates(res);
        await processTransactionsIntoCategories(res);
        await processTransactionsIntoNetValue(res);
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
        console.log(res);
        updateAccounts(res);
      } else {
        console.log('Failed to get accounts');
      }
    }
  };

  const initializePage = async () => {
    await initializeTransactions();
  };

  const test = async () => {
    console.log('Testing');
    console.log(transactions);
    console.log(timelineData);
  };

  const processTransactionsIntoDates = (transactions: Transaction[]) => {
    const data: any[] = [];
    transactions.forEach((transaction: Transaction) => {
      const dateIndex = data.findIndex((d) => d.date === transaction.timestamp);
      if (dateIndex === -1) {
        data.push({ date: transaction.timestamp, amount: transaction.amount });
      } else {
        data[dateIndex].amount += transaction.amount;
      }
    });
    data.sort((a, b) => a.date - b.date);
    setTimelineData(data);
  }

  const processTransactionsIntoCategories = (transactions: Transaction[]) => {  
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

  const processTransactionsIntoNetValue = async (transactions: Transaction[]) => {
      const refAccount = await TransactionProcessingLocal.getAllAccounts();
      const refStartDate = new Date(refAccount[0].refDate).getTime();
      const refBalance = refAccount[0].refBalance;
      const data: any[] = [];
      const beforeTrns = transactions.filter((transaction) => transaction.timestamp < refStartDate);
      const afterTrns = transactions.filter((transaction) => transaction.timestamp >= refStartDate);
      let netValue = refBalance;
      let i = 0;
      let j = 0;
      while (i < beforeTrns.length && j < afterTrns.length) {
        if (beforeTrns[i].timestamp < afterTrns[j].timestamp) {
          netValue += beforeTrns[i].amount;
          data.push({ date: beforeTrns[i].timestamp, netValue });
          i++;
        } else {
          netValue -= afterTrns[j].amount;
          data.push({ date: afterTrns[j].timestamp, netValue });
          j++;
        }
      }
      while (i < beforeTrns.length) {
        netValue += beforeTrns[i].amount;
        data.push({ date: beforeTrns[i].timestamp, netValue });
        i++;
      }
      while (j < afterTrns.length) {
        netValue -= afterTrns[j].amount;
        data.push({ date: afterTrns[j].timestamp, netValue });
        j++;
      }

      const filteredData: any[] = [];
      for (let i = 0; i < data.length; i++) {
        const dateIndex = filteredData.findIndex((d) => d.date === data[i].date);
        if (dateIndex === -1) {
          filteredData.push(data[i]);
        } else {
          filteredData[dateIndex] = data[i];
        }
      }
      for (let i = 0; i < filteredData.length; i++) {
        filteredData[i].netValue = convertNumberToCurrency(filteredData[i].netValue);
      }
      setNetValueOverTime(filteredData);
      const decimalNetValue = convertNumberToCurrency(netValue);
      setNetValue(decimalNetValue);
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
          dataset={netValueOverTime}
            xAxis={[{dataKey: 'date', scaleType: 'time', label: 'Date'}]}
            series={[{dataKey: 'netValue', area: true, color: 'rgb(104, 133, 183)', showMark: true,}]}
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
