import { LinearProgress, MenuItem, Select } from '@mui/material';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FC, useEffect, useState } from 'react';
import { Account, Transaction } from '../../services/Classes/classes';
import { InitializeDataForContext, TransactionData, UserAccountsData } from '../../services/Classes/dataContext';
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
  const [filterData, setFilterData] = useState<any>({'account': 'All', 'category': 'All'});
  const [dateRanges, setDateRanges] = useState<any>({startDate: null, endDate: null});

  //GRAPH PARAMETERS:
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
    {
      dataKey: 'sum',
      label: 'Net Value',
      stackId: 'sum',
      id: 'sum',
      color: '#2c5364',
      ...stackStrategy,
    },
  ]

  const graphStyling = {
      [`& .${lineElementClasses.root}`]: {
      },
      '& .MuiAreaElement-series-sum': {
        fill: 'url(#graphGradient)',
      },
  }

  const filterStyling = {
    border: '1px solid white',
    borderRadius: '5px',
    color: 'white',
    padding: '0px',
  }


  useEffect(() => {
    initializeDataForContext();
  }, [ ])

  useEffect(() => {
    if (transactions.length > 0 && accounts.length > 0) {
      processTransactionsIntoCategories(transactions);
      initializeGraphData();
    }
  }, [transactions, accounts, filterData])

  const initializeGraphData = async () => {
    console.log('Initializing graph data');
    const allDates: number[] = [];
    for (const transaction of transactions) {
      allDates.push(transaction.timestamp);
    }
    const uniqueDates = Array.from(new Set(allDates));
    const data: any[] = [];

    const filteredTransactions = transactions.filter((transaction: Transaction) => {
      if (filterData.account !== 'All') {
        return transaction.account === filterData.account;
      }
      if (filterData.category !== 'All') {
        return transaction.category === filterData.category;
      }
      return true;
    });

    let filteredAccounts = accounts.filter((account: Account) => {
      if (filterData.account !== 'All') {
        return account.name === filterData.account && filteredTransactions
          .find((transaction: Transaction) => transaction.account === account.name);
      }
      return filteredTransactions.find((transaction: Transaction) => transaction.account === account.name);
    });

    for (const account of filteredAccounts) {
      data.push(await processTransactionsIntoNetValue(filteredTransactions, account));
    }

    const organizedData: any[] = [];
    for (const date of uniqueDates) {
      let obj: any = { date };
      for (const account of data) {
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
    for (let i = 0; i < organizedData.length; i++) {
      let sum = 0;
      for (const account of filteredAccounts) {
        sum += organizedData[i][account.name];
      }
      organizedData[i].sum = sum;
    }
    setTransactionsByAccount(organizedData);
    setNetValue(organizedData[organizedData.length - 1].sum);
  }


  const test = async () => {
    console.log('Testing');
    console.log('transactions by account', transactionsByAccount);
  };

  const processTransactionsIntoCategories = (transactions: Transaction[]) => {
    const data: any[] = [];
    transactions = transactions.filter((transaction) => {
      if (filterData.account !== 'All') {
        return transaction.account === filterData.account;
      }
      if (filterData.category !== 'All') {
        return transaction.category === filterData.category;
      }
      return true;
    });
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
      return { account: account.name, amount: filteredData };
    }

  const handleFilterSelect = (event: any) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  }

  const handleDataRangeSelect = (event: any) => {
    console.log('Date range selected:', event.target.name);
    setDateRanges({ ...dateRanges, [event.target.name]: event.target.value });
  }

  return (
    <>
      <NavBar />

      {transactionsByAccount.length === 0 ? <LinearProgress color="inherit" /> : null}

      <div className='dashboard'>
        <div className='dashboard-container'>

          <div className='row'>
            <h3 className='special-title'>Total Net Value: {netValue}</h3>

            <div className='filters'>
              <DatePicker
                label="Start Date"
                value={dateRanges.startDate}
                onChange={handleDataRangeSelect}
                sx={filterStyling}
              />
              <DatePicker
                label="End Date"
                value={dateRanges.startDate}
                onChange={handleDataRangeSelect}
                sx={filterStyling}
              />
              <Select
                labelId="account-select"
                id="account-select"
                name='account'
                value={filterData.account}
                label="Account"
                onChange={handleFilterSelect}
                sx={filterStyling}
              >
                <MenuItem value='All'>All</MenuItem>
                {accounts.map((account: Account, index: any) => (
                  <MenuItem key={index} value={account.name}>{account.name}</MenuItem>
                ))}
              </Select>
              <Select
                labelId="category-select"
                id="category-select"
                name='category'
                value={filterData.category}
                label="Category"
                onChange={handleFilterSelect}
                sx={filterStyling}
              >
                <MenuItem value='All'>All</MenuItem>
                {categoryData.map((category: any, index: any) => (
                  <MenuItem key={index} value={category.category}>{category.category}</MenuItem>
                ))}
              </Select>
            </div>

          </div>

          <div className='line-chart container' style={{width: '100%'}}>
          <LineChart
          sx={graphStyling}
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


      <svg style={{ height: 0 }}>
        <defs>
        <linearGradient id="graphGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2c5364', stopOpacity: 1 }} />
        </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default Dashboard;
