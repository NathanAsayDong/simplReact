import { MenuItem, Select } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { FC, useEffect, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Account, Transaction } from '../../services/Classes/classes';
import { InitializeDataForContext, SetTransactionData, SetUserAccountData, TransactionData, UserAccountsData } from '../../services/Classes/dataContext';
import { convertNumberToCurrency } from '../../services/Classes/formatService';
import NavBar from '../NavBar/NavBar'; // Make sure the path is correct
import './Dashboard.scss';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ handleLogout }) => {
  const transactions = TransactionData() || [];
  const updateTransactions = SetTransactionData();
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [netValue, setNetValue] = useState<number>(0);
  const [transactionsByAccount, setTransactionsByAccount] = useState<any[]>([]);
  const initializeDataForContext = InitializeDataForContext();

  //FILTERS:
  const [filteredAccount, setFilteredAccount] = useState<string>('All');
  const [filteredCategory, setFilteredCategory] = useState<string>('All');

  const customize = {
    height: 300,
    legend: { hidden: true },
    margin: { top: 5 },
    stackingOrder: 'descending',
  };

  const stackStrategy = {
    stack: 'total',
    area: true,
    stackOffset: 'none',
  } as const;

  useEffect(() => {
    initializeDataForContext();
  }, [])

  useEffect(() => {
    if (transactions.length > 0 && accounts.length > 0) {
      processTransactionsIntoCategories(transactions);
      initializeTransactionsByAccount(transactions);
    }
  }, [transactions, accounts])


  const initializeTransactionsByAccount = async (transactions: Transaction[]) => {
    const data: any[] = [];
    let organizedData: any[] = [];
    for (const transaction of transactions) {
      if (data.find((obj) => obj.account === transaction.account)) {
        data.find((obj) => obj.account === transaction.account).transactions.push(transaction);
      }
      else {
        data.push({ account: transaction.account, transactions: [transaction] });
      }
    }
    const accounts = await TransactionProcessingLocal.getAllAccounts();
    for (const obj of data) {
      const account = accounts.find((account: any) => account.name === obj.account);
      organizedData.push(await processTransactionsIntoNetValue(obj.transactions, account));
    }
    organizedData = organizedData.map(account => ({
      account: account.account,
      data: account.amount.map((entry: any) => ({
        ...entry,
        netValue: parseFloat(entry.netValue)
      }))
    }));
    const allDates: number[] = [];
    for (const account of organizedData) {
      for (const entry of account.data) {
        allDates.push(entry.date);
      }
    }
    const uniqueDates = Array.from(new Set(allDates));
    const allAccounts = organizedData.map(account => account.account);
    const organizedData2: any[] = [];
    for (const date of uniqueDates) {
      let obj: any = { date };
      for (const account of allAccounts) {
        const accountData = organizedData.find((data) => data.account === account);
        const accountValue = accountData.data.find((entry: any) => entry.date === date);
        if (date == uniqueDates[0]) {
          obj[account] = accountValue ? accountValue.netValue : accountData.data[0].netValue;
        }
        if (date == uniqueDates[uniqueDates.length - 1]) {
          obj[account] = accountValue ? accountValue.netValue : accountData.data[accountData.data.length - 1].netValue;
        }
        else {
          obj[account] = accountValue ? accountValue.netValue : null;
        }
      }
      organizedData2.push(obj);
    }
    setTransactionsByAccount(organizedData2);
  }


  const test = async () => {
    console.log('Testing');
    console.log('transactions by account', transactionsByAccount);
  };

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

  const processTransactionsIntoNetValue = async (transactions: Transaction[], account: Account) => {
      const refStartDate = new Date(account.refDate).getTime();
      const refBalance = account.refBalance;
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
        const originalValue = filteredData[i].netValue;
        filteredData[i].netValue = parseFloat(filteredData[i].netValue.toFixed(2));
        if (isNaN(filteredData[i].netValue)) {
          console.log(`Invalid netValue at index ${i}: ${originalValue}`);
        }
      }
      const decimalNetValue = convertNumberToCurrency(netValue);
      setNetValue(decimalNetValue);
      return { account: account.name, amount: filteredData };
    }

  const handleAccountSelect = (event: any) => {
    setFilteredAccount(event.target.value);
    //to do
  }

  const handleCategorySelect = (event: any) => {
    setFilteredCategory(event.target.value);
    //to do
  }


  return (
    <>
      <NavBar />
      <div className='dashboard'>
        <div className='dashboard-container'>
          <div className='row'>
            <h3 className='special-title'>Total Net Value: {netValue}</h3>
            <div className='filters'>
              <Select
                labelId="account-select"
                id="account-select"
                value={filteredAccount}
                label="Account"
                onChange={handleAccountSelect}
              >
                <MenuItem value='All'>All</MenuItem>
                {accounts.map((account: Account, index: any) => (
                  <MenuItem key={index} value={account.name}>{account.name}</MenuItem>
                ))}
              </Select>
              <Select
                labelId="category-select"
                id="category-select"
                value={filteredCategory}
                label="Category"
                onChange={handleCategorySelect}
              >
                <MenuItem value='All'>All</MenuItem>
                {categoryData.map((category: any, index: any) => (
                  <MenuItem key={index} value={category.category}>{category.category}</MenuItem>
                ))}
              </Select>
              {/* <DateRangePicker
                defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
              /> */}
            </div>
          </div>
          <div className='line-chart container' style={{width: '100%'}}>
          <LineChart
          dataset={transactionsByAccount}
          {...customize}
            xAxis={[{dataKey: 'date', scaleType: 'time', label: 'Date'}]}
            series={accounts.map((account: Account) => ({
              dataKey: account.name,
              label: account.name,
              ...stackStrategy,
            }))}
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
                  <h3>{category.amount * -1}</h3>
                </div>
              </div>
            ))}
          </div>


        </div>


        <div style={{margin: '5%'}}></div>

        <button onClick={handleLogout}>Logout</button>
        <button onClick={test}>TEST</button>
      </div>
    </>
  );
};

export default Dashboard;
