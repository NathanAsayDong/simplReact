import { faEllipsis, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinearProgress, Modal } from '@mui/material';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { Area, AreaChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardConfig } from '../../modals/DashboardConfig/DasboardConfig';
import { Account, DashboardFilterData, Transaction, defaultDashboardFilterData } from '../../services/Classes/classes';
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
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  //FILTERS:
  const [dateScale, setDateScale] = useState<any>('day');
  const [dashboardFilterData, setDashboardFilterData] = useState<DashboardFilterData>(defaultDashboardFilterData);

  const test = async () => {
    console.log('Testing');
    console.log('api url', __API_URL__);
  };

  useEffect(() => {
    if (transactions.length > 0 && accounts.length > 0) {
      processTransactionsIntoCategories(transactions);
      processTransactionsIntoAccounts(transactions, accounts);
      initializeGraphData();
    }
  }, [transactions, accounts, dateScale, dashboardFilterData])

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
    const filteredTransactions = getFilteredTransactions(transactions, dashboardFilterData);
    const filteredAccounts = getFilteredAccounts(accounts, filteredTransactions, dashboardFilterData);
    const data: any[] = [];

    for (const account of filteredAccounts) {
      data.push(await processTransactionsIntoNetValue(filteredTransactions, account));
    }
    console.log('data', data);

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

    if (dashboardFilterData.startDate !== null && dashboardFilterData.startDate !== undefined) {
      organizedData = organizedData.filter((entry) => {
        return dayjs(entry.date).unix() >= dayjs(dashboardFilterData.startDate).unix()!
      });
    }
    if (dashboardFilterData.endDate !== null && dashboardFilterData.endDate !== undefined) {
      organizedData = organizedData.filter((entry) => { return dayjs(entry.date).unix() <= dayjs(dashboardFilterData.endDate!).unix() });
    }

    console.log('organizedData', organizedData);
    setNetValueByAccount(organizedData);
    setNetValue(organizedData[organizedData.length - 1].sum);
  }

  const processTransactionsIntoCategories = (transactions: Transaction[]) => {
    const data: any[] = [];
    transactions = transactions.filter((transaction) => {
      if (!dashboardFilterData.selectedAccounts.includes('All')) {
        return dashboardFilterData.selectedAccounts.includes(transaction.account);
      }
      if (!dashboardFilterData.selectedCategories.includes('All')) {
        return dashboardFilterData.selectedCategories.includes(transaction.category);
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
    data.forEach((category) => {
      if (!dashboardFilterData.categoryOptions.includes(category.category)) {
        dashboardFilterData.categoryOptions.push(category.category);
      }
    });
  }

  const categoryDataToPositivesOnly = (categoryData: any[]) => {
    const data: any[] = [];
    categoryData.forEach((category) => {
      if (category.amount < 0) {
        data.push({ category: category.category, amount: category.amount * -1 });
      }
      else {
        data.push(category);
      }
    });
    return data;
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
    data.forEach((account) => {
      if (!dashboardFilterData.accountOptions.includes(account.name)) {
        dashboardFilterData.accountOptions.push(account.name);
      }
    });
  }

  const handleOpenConfigModal = () => setShowConfigModal(true);
  const handleCloseConfigModal = () => setShowConfigModal(false);
  const handleApplyConfigModal = (newFilter: DashboardFilterData) => {
    setDashboardFilterData(newFilter);
    setShowConfigModal(false);
  };

  return (
    <>
      {netValueByAccount.length === 0 ? <LinearProgress color="inherit" /> : null}

      <div className='dashboard'>
          <div className='row'>
            <h3 className='special-title'>Net Value: ${netValue.toFixed(2)}</h3>

            <div className='filters'>
              <FontAwesomeIcon icon={faGear} className='icon' onClick={handleOpenConfigModal}/>
            </div>

          </div>

        <div className='row' style={{gap: '10px', padding: '10px'}}>
          <div className='graph-container'>
            <ResponsiveContainer width="100%" height={500} style={{scale: '1.01'}}>
              <AreaChart data={netValueByAccount}>
                <Tooltip content={<CustomTooltip dateFormat={getDateFormat()}/>} />
                <Area dataKey='sum' stroke='white' strokeWidth={2} fill='url(#graphGradient)'  type="monotone" />
                <XAxis dataKey="date" tickFormatter={(value) => dateFormatPretty(value, getDateFormat())}
                tick={{ fill: 'white' }} tickLine={{ stroke: 'none' }} mirror={true} stroke='none'
                ></XAxis>
                <YAxis
                tick={{ fill: 'white', fontSize: 12, width: 300 }} tickLine={{ stroke: 'none' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`} mirror={true} stroke='none'
                orientation='right'
                ></YAxis>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='pie-container'>
            <ResponsiveContainer width="100%" height={500} style={{scale: '1.11'}}>
              <PieChart >
                <Pie data={categoryDataToPositivesOnly(categoryData)} dataKey="amount" nameKey="category" cx="50%" cy="50%" fill="url(#graphGradient2)" />
                <Tooltip content={<CustomTooltip dateFormat={getDateFormat()}/>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='row'>
          <div className='date-scale-options'>
            <button className='scale-option' value='day' onClick={changeDateScale}>Day</button>
            <button className='scale-option' value='week' onClick={changeDateScale}>Week</button>
            <button className='scale-option' value='month' onClick={changeDateScale}>Month</button>
            <button className='scale-option' value='year' onClick={changeDateScale}>Year</button>
          </div>
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
                  <p>${category.amount.toFixed(2) * -1}</p>
                </div>
                <FontAwesomeIcon icon={faEllipsis} className='card-more-dots'/>
              </div>
            ))}
          </div>

          <div className='row'>
            <h3 className='special-title'>Accounts</h3>
          </div>

          <div className='swiper-row'>
            {accountData.map((account, index) => (
              <div key={index} className='category-card'>
                <div className='card-name archivo-font'>
                  <h3>{account.name}</h3>
                </div>
                <div className='card-amount roboto-light'>
                  <p>${account.amount.toFixed(2) * -1}</p>
                </div>
                <FontAwesomeIcon icon={faEllipsis} className='card-more-dots'/>
              </div>
            ))}
          </div>

      </div>

        <div style={{margin: '5%'}}></div>

        <button onClick={handleLogout}>Logout</button>
        <button onClick={test}>TEST</button>


      {/* --------------------------------------- CONFIG ITEMS --------------------------------------- */}


      <Modal
        open={showConfigModal}
        // onClose={handleConfigModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DashboardConfig filterObject={dashboardFilterData} onClose={handleCloseConfigModal} onApply={handleApplyConfigModal}/>
      </Modal>

      <svg style={{ height: 0 }}>
        <defs>
        <linearGradient id="graphGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="graphGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: 'white', stopOpacity: .7 }} />
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
