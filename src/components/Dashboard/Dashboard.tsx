import { MenuItem, Select } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { FC, useEffect, useState } from 'react';
import { Account, Transaction } from '../../services/Classes/classes';
import { InitializeDataForContext, TransactionData, UserAccountsData } from '../../services/Classes/dataContext';
import { convertNumberToCurrency } from '../../services/Classes/formatService';
import NavBar from '../NavBar/NavBar'; // Make sure the path is correct
import './Dashboard.scss';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ handleLogout }) => {
  const transactions = TransactionData() || [];
  const accounts = UserAccountsData() || [];
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

  const series = [
    ...accounts.map((account: Account) => ({
      dataKey: account.name,
      label: account.name,
      ...stackStrategy,
    })),
    {
      dataKey: 'sum',
      label: 'Sum',
      // ...stackStrategy,
    },
  ]

  useEffect(() => {
    initializeDataForContext();
  }, [ ])

  useEffect(() => {
    if (transactions.length > 0 && accounts.length > 0) {
      processTransactionsIntoCategories(transactions);
      initializeGraphData();
    }
  }, [transactions, accounts])

  const initializeGraphData = async () => {
    console.log('initializing graph data');
    //STEPS:
    //1. make a set of all the unique dates in the transactions
    //2. process all the accounts into the object of net values using the processTransactionsIntoNetValue function
    //3. for each date starting at the oldest to newest, get the net value of each account for that day, if that value doesnt exist that day then use the most recent value
    //4. create an object for each date with the net value of each account
    //5. go through the object and add a new key called sum that is the sum of all the net values for that day for all the accounts
    //6. set the transactionsByAccount state to the object

    //STEP 1
    const allDates: number[] = [];
    for (const transaction of transactions) {
      allDates.push(transaction.timestamp);
    }
    const uniqueDates = Array.from(new Set(allDates));

    //STEP 2
    const data: any[] = [];
    for (const account of accounts) {
      data.push(await processTransactionsIntoNetValue(transactions, account));
    }

    //STEP 3 & 4
    const organizedData: any[] = [];
    for (const date of uniqueDates) {
      //for every date
      let obj: any = { date };
      for (const account of data) {
        //for every account
        const accountValue = account.amount.find((entry: any) => entry.date === date);
        if (date == uniqueDates[0]) {
          obj[account.account] = accountValue ? accountValue.netValue : account.amount[0].netValue;
        }
        else if (date == uniqueDates[uniqueDates.length - 1]) {
          obj[account.account] = accountValue ? accountValue.netValue : account.amount[account.amount.length - 1].netValue;
        }
        else {
          if (!accountValue) {
            let i = organizedData.length - 1;
            while (i >= 0) {
              if (organizedData[i][account.account]) {
                obj[account.account] = organizedData[i][account.account];
                break;
              }
              i--;
            }
          } else {
            obj[account.account] = accountValue.netValue;
          }
        }
      }
      organizedData.push(obj);
    }

    //STEP 5
    for (let i = 0; i < organizedData.length; i++) {
      let sum = 0;
      for (const account of accounts) {
        sum += organizedData[i][account.name];
      }
      organizedData[i].sum = sum;
    }

    console.log('organized data with sum', organizedData);
    
    //STEP 6
    setTransactionsByAccount(organizedData);


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
      //filter out any transactions not from the account
      transactions = transactions.filter((transaction) => transaction.account === account.name);
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
            series={series}
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
