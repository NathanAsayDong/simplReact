import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinearProgress, MenuItem, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Account, Transaction } from '../../services/Classes/classes';
import { TransactionData, UserAccountsData } from '../../services/Classes/dataContext';
import { dateFormatPretty, scaleDate } from '../../services/Classes/formatService';
import { getDatesFromTransactions, getFilteredAccounts, getFilteredTransactions, processTransactionsIntoNetValue } from './Dashboard.Service';
import './Dashboard.scss';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ handleLogout }) => {
  const transactions = TransactionData() || [];
  const accounts = UserAccountsData() || [];
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [accountData, setAccountData] = useState<any[]>([]);
  const [netValue, setNetValue] = useState<number>(0);
  const [netValueByAccount, setNetValueByAccount] = useState<any[]>([]);

  //FILTERS:
  const [filterData, setFilterData] = useState<any>({'account': 'All', 'category': 'All'});
  const [dateRanges, setDateRanges] = useState<any>({startDate: null, endDate: null});
  const [dateScale, setDateScale] = useState<any>('day');


  const filterStyling = {
    border: '1px solid white',
    borderRadius: '5px',
    color: 'white',
    padding: '0px',
  }

  useEffect(() => {
    if (transactions.length > 0 && accounts.length > 0) {
      console.log('transactions', transactions);
      processTransactionsIntoCategories(transactions);
      processTransactionsIntoAccounts(transactions, accounts);
      initializeGraphData();
    }
  }, [transactions, accounts, filterData, dateRanges, dateScale])

  const changeDateScale = (event: any) => {
    setDateScale(event.target.value);
  }

  const getDateFormat = () => {
    switch (dateScale) {
      case 'week':
        return 'MM/DD/YYYY';
      case 'month':
        return 'MMM YYYY';
      case 'year':
        return 'YYYY';
      default:
        return 'MM/DD/YYYY';
    }
  };

  const initializeGraphData = async () => {
    const dates: number[] = getDatesFromTransactions(transactions, dateScale);
    const filteredTransactions = getFilteredTransactions(transactions, filterData);
    const filteredAccounts = getFilteredAccounts(accounts, filteredTransactions, filterData);
    const data: any[] = [];

    for (const account of filteredAccounts) {
      data.push(await processTransactionsIntoNetValue(filteredTransactions, account));
    }

    let  organizedData: any[] = [];
    for (const date of dates) {
      let obj: any = { date };
      for (const account of data) {
        const accountValue = account.amount.find((entry: any) => scaleDate(entry.date, dateScale) === date);
        if (date == dates[0]) {
          obj[account.account] = accountValue ? accountValue?.netValue : account.amount[0]?.netValue;
        }
        else if (date == dates[dates.length - 1]) {
          obj[account.account] = accountValue ? accountValue?.netValue : account.amount[account.amount.length - 1]?.netValue;
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
            obj[account.account] = accountValue?.netValue;
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

    if (dateRanges.startDate) {
      organizedData = organizedData.filter((entry) => entry.date >= dateRanges.startDate.toDate().getTime());
    }
    if (dateRanges.endDate) {
      organizedData = organizedData.filter((entry) => entry.date <= dateRanges.endDate.toDate().getTime());
    }

    console.log('organizedData', organizedData);
    setNetValueByAccount(organizedData);
    setNetValue(organizedData[organizedData.length - 1].sum);
  }


  const test = async () => {
    console.log('Testing');
    console.log('api url', __API_URL__);
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

  const processTransactionsIntoAccounts = (transactions: Transaction[], accounts: Account[]) => {
    const data: any[] = []; // {name: 'Uccu', amount: 100}
    transactions.forEach((transaction: Transaction) => {
      const accountIndex = data.findIndex((d) => d.name === transaction.account);
      let accountType = accounts.find((account) => account.name === transaction.account)?.type;
      const amount = accountType === 'Credit' ? transaction.amount * -1 : transaction.amount;
      if (accountIndex === -1) {
        data.push({ name: transaction.account, amount: amount });
      } else {
        data[accountIndex].amount += transaction.amount;
      }
    });
    setAccountData(data);
  }

  const handleFilterSelect = (event: any) => {
    setFilterData({ ...filterData, [event.target.name]: event.target.value });
  }

  const handleStartDateSelect = (date: any) => {
    if (date && dayjs(date).isValid()) {
      setDateRanges((prev: any) => ({ ...prev, startDate: date }));
    }
  };

  const handleEndDateSelect = (date: any) => {
    if (date && dayjs(date).isValid()) {
      setDateRanges((prev: any) => ({ ...prev, endDate: date }));
    }
  };

  return (
    <>
      {netValueByAccount.length === 0 ? <LinearProgress color="inherit" /> : null}

      <div className='dashboard'>
          <div className='row'>
            <h3 className='special-title'>Net Value: ${netValue.toFixed(2)}</h3>

            <div className='filters'>
              <DatePicker
                label="Start Date"
                value={dateRanges.startDate}
                onChange={handleStartDateSelect}
                sx={filterStyling}
              />
              <DatePicker
                label="End Date"
                value={dateRanges.endDate}
                onChange={handleEndDateSelect}
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

        <div className='row'>
          <div className='graph-container'>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={netValueByAccount}>
                <Tooltip content={<CustomTooltip dateFormat={getDateFormat()}/>} />
                <Area dataKey='sum' stroke='white' fill='url(#graphGradient)' type="monotone"/>
                <XAxis dataKey="date" tickFormatter={(value) => dateFormatPretty(value, getDateFormat())}
                tick={{ fill: 'white' }} tickLine={{ stroke: 'white' }}
                ></XAxis>
                <YAxis
                tick={{ fill: 'white', fontSize: 12, width: 300 }} tickLine={{ stroke: 'white' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                orientation='right'
                ></YAxis>
              </AreaChart>
            </ResponsiveContainer>
          </div>


        </div>

        <div className='date-scale-options'>
          <button className='scale-option' value='day' onClick={changeDateScale}>Day</button>
          <button className='scale-option' value='week' onClick={changeDateScale}>Week</button>
          <button className='scale-option' value='month' onClick={changeDateScale}>Month</button>
          <button className='scale-option' value='year' onClick={changeDateScale}>Year</button>
        </div>

          <div className='row'>
            <h3 className='special-title'>Categories</h3>
          </div>

          <div className='swiper-row'>
            {categoryData.map((category, index) => (
              <div key={index} className='category-card'>
                <div className='card-name archivo-font'>
                  <h3>{category.category}</h3>
                </div>
                <div className='card-amount roboto-light'>
                  <p>${category.amount * -1}</p>
                </div>
                <FontAwesomeIcon icon={faEllipsis} className='card-more-dots'/>
              </div>
            ))}
          </div>

          <div className='row'>
            <h3 className='special-title'>Accounts</h3>
          </div>

          <div className='container-transparent'>
            {accountData.map((account, index) => (
              <div key={index} className='inner-row' style={{justifyContent: 'space-between'}}>
                <div className='item'>
                  <h3>{account.name}</h3>
                </div>
                <div className='item'>
                  <h3>Difference:</h3>
                  <h3>${(account.amount * -1).toFixed(2)}</h3>
                </div>
              </div>
            ))}
          </div>

      </div>

        <div style={{margin: '5%'}}></div>

        <button onClick={handleLogout}>Logout</button>
        <button onClick={test}>TEST</button>

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

const CustomTooltip = ({ active, payload, label, dateFormat }: any) => {
  if (active && payload && payload.length) {
    const formattedDate = dateFormatPretty(label, dateFormat);
    return (
      <div className="custom-tooltip">
        <p className="label">{`Date : ${formattedDate}`}</p>
        <p className="intro">{`Value : $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

export default Dashboard;
