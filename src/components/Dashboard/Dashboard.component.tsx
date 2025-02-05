import { faFilter, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Area, AreaChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardConfig } from '../../modals/DashboardConfig/DasboardConfig';
import { Account, Category, DashboardFilterData, Transaction, defaultDashboardFilterData } from '../../services/Classes/classes';
import { TransactionData, UserAccountsData, UserCategoriesData } from '../../services/Classes/dataContext';
import { convertNumberToCurrency, dateFormatPretty } from '../../services/Classes/formatService';
import StripeService from '../../services/Classes/stripeApiService';
import StripePayments from '../StripePayments/StripePayments';
import { account_balance_for_dates, getDates, getFilteredAccounts, getFilteredTransactions, getNetValueFromAccounts } from './Dashboard.Service';
import './Dashboard.component.scss';
import { Margin } from 'recharts/types/util/types';
import Assistant from '../Assistant/Assistant.component';
import { dashboardAccount } from '../../services/Classes/dashboardClasses';

interface DashboardProps {
  handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = () => {

  //VARIABLES:
  const transactions = TransactionData() || []; //context transactions
  const accounts = UserAccountsData() || []; //context accounts
  const categories = UserCategoriesData() || []; //context categories
  const [categoryData, setCategoryData] = useState<any[]>([]); //processed transactions into categories
  const [accountData, setAccountData] = useState<dashboardAccount[]>([]); //processed transactions into accounts
  const [netValue, setNetValue] = useState<number>(0); //some number we use for net value when processing transactions to accounts
  const [lineChartData, setLineChartData] = useState<any[]>([]); //graph date for accounts {date, balance}
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false); //config modal object that we use for filtering, modes, and sorting
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false); //payment modal object that we use for stripe payments
  // const stripeService = StripeService();

  //FILTERS:
  const [dateScale, setDateScale] = useState<any>('day');
  const [dashboardFilterData, setDashboardFilterData] = useState<DashboardFilterData>(defaultDashboardFilterData);

  useEffect(() => {
    if (transactions.length > 0 && accounts.length > 0) {
      setDateScale('day');
      const filteredTransactions = getFilteredTransactions(transactions, dashboardFilterData);
      const filteredAccounts = getFilteredAccounts(accounts, dashboardFilterData);

      processTransactionsIntoCategories(filteredTransactions, categories);
      processTransactionsIntoAccounts(filteredTransactions, filteredAccounts);
      calculateLineChartData();
      calculateNetValue(filteredAccounts);
    }
  }, [transactions, accounts, dateScale, dashboardFilterData])

  // useEffect(() => {
  //   if (stripeService.needsSubscription) {
  //     setShowPaymentModal(true);
  //   }
  // }, [stripeService.needsSubscription]);


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

  const calculateLineChartData = async () => {
    const dates = getDates(dashboardFilterData.startDate, dateScale);
    const net_value_per_day: { [date: number] : number} = {};
    for (const date of dates) {
      net_value_per_day[Number(date)] = 0;
    }
    for (const account of accounts) {
      let balance_log = account_balance_for_dates(dates, account, transactions.filter((transaction: Transaction) => transaction.accountId === account.id));
      if (account.type == 'checking' || account.type == 'savings') {
        for (const date of Object.keys(balance_log)) {
          net_value_per_day[Number(date)] = Number((net_value_per_day[Number(date)] + balance_log[Number(date)]).toFixed(2));
        }
      } else {
        for (const date of Object.keys(balance_log)) {
          net_value_per_day[Number(date)] = Number((net_value_per_day[Number(date)] - balance_log[Number(date)]).toFixed(2));
        }
      }
    }
    const lineChartData = [];
    for (const date of Object.keys(net_value_per_day)) {
      lineChartData.push({ date: Number(date), balance: net_value_per_day[Number(date)] });
    }
    lineChartData.sort((a, b) => a.date - b.date);
    setLineChartData(lineChartData);
  }

  const calculateNetValue = (accounts: Account[]) => {
    setNetValue(getNetValueFromAccounts(accounts));
  }

  const calculateTotalChanges = () => {
    return categoryData.reduce((acc, category) => acc + Math.abs(category.amount), 0).toFixed(2);
  }

  const calculateDivHeight = (amount: number) => {
    const total = categoryData.reduce((acc, category) => acc + Math.abs(category.amount), 0);
    const height = (Math.abs(amount) / total) * 100;
    return `${Math.max(height, 5)}%`;
  }

  const processTransactionsIntoCategories = (transactions: Transaction[], categories: Category[]) => {
    const data: any[] = [];
    transactions.forEach((transaction: Transaction) => {
      const categoryName = categories.find(cat => cat.categoryId === transaction.categoryId)?.categoryName || "Unknown";
      const categoryIndex = data.findIndex((d) => d.category === categoryName);
      if (categoryIndex === -1) {
        data.push({ category: categoryName, amount: transaction.amount });
      } else {
        data[categoryIndex].amount += transaction.amount;
      }
    });
    data.forEach((item) => {
      item.amount = convertNumberToCurrency(item.amount);
    });
    
    setCategoryData(data);
    data.forEach((item) => {
      if (!dashboardFilterData.categoryOptions.includes(item.category)) {
        dashboardFilterData.categoryOptions.push(item.category);
      }
    });
  };

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
    const data: any[] = [];
    console.log('transactions', transactions);
    transactions.forEach((transaction: Transaction) => {
      let account = accounts.find((acc) => acc.accountId === transaction.accountId);
      if (!account) return;
      const signedAmount = account.accountType === 'Credit' ? transaction.amount * -1 : transaction.amount;
      const accountIndex = data.findIndex((d) => d.accountId === transaction.accountId);
      if (accountIndex === -1) {
        let dashboardAcc = new dashboardAccount(transaction.accountId, account.accountName, signedAmount, convertNumberToCurrency(account.refBalance || 0));
        data.push(dashboardAcc);
      } else {
        data[accountIndex].netChange += signedAmount;
      }
    });
    console.log(data);
    setAccountData(data);
  };

  const handleOpenConfigModal = () => setShowConfigModal(true);
  const handleCloseConfigModal = () => setShowConfigModal(false);
  const handleApplyConfigModal = (newFilter: DashboardFilterData) => {
    setDashboardFilterData(newFilter);
    setShowConfigModal(false);
  };

  return (
    <>
      <div className='dashboard'>
          <div className='row' style={{paddingTop: '10px'}}>
            <h1 className='archivo-font-bold' style={{color: 'var(--secondary-color)'}}>Dashboard</h1>
            <div className='filters'>
              <FontAwesomeIcon icon={faFilter} className='icon' onClick={handleOpenConfigModal}/>
            </div>
          </div>



        <div className='row' style={{gap: '10px', paddingTop: '0 !important', height: '390px'}}>
          <div className='graph-container'>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={lineChartData} margin={{ left: 10, right: 10 }}>
                <Tooltip content={<CustomTooltipArea dateFormat={getDateFormat()}/>} />
                <Area dataKey='balance' stroke='var(--secondary-color)' strokeWidth={2} fill='url(#graphGradient)'  type="monotone" />
                <XAxis dataKey="date" tickFormatter={(value) => dateFormatPretty(value, getDateFormat())}
                tick={{ fill: 'var(--secondary-color)', fontSize: 12 }} tickLine={{ stroke: 'none' }} mirror={true} stroke='none'
                ></XAxis>
                <YAxis
                tick={{ fill: 'var(--secondary-color)', fontSize: 12, width: 100 }} tickLine={{ stroke: 'none' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`} mirror={false} stroke='none'
                orientation='left'
                ></YAxis>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className='column' style={{width: '35%'}}>
            <div className='net-value-container'>
              <h3 className='net-value'>Net Value</h3>
              <h3 className='net-value'>${netValue.toFixed(2)}</h3>
            </div>
            <div className='pie-container'>
              <ResponsiveContainer width={'100%'} height={'100%'} style={{display: 'flex', justifyContent: 'center'}}>
                <PieChart margin={PieChartMargin} width={100} height={100}>
                  <Pie data={categoryDataToPositivesOnly(categoryData)} 
                  dataKey="amount"
                  nameKey="category" cx="50%" cy="50%"
                  innerRadius={70} outerRadius={100}
                  fill="url(#graphGradient)" label={(entry) => entry.name}
                  className='pie-label' labelLine={false}/>
                  <Tooltip content={<CustomTooltipPie />} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill='var(--secondary-color)' fontWeight={600} fontSize={20}>
                      ${calculateTotalChanges()}
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className='row' style={{gap: '10px', maxHeight: 'calc(100vh - 200px)', alignItems: 'flex-start'}}>
          <div className='accounts-container'>
                {accountData.sort((a, b) => b.netChange - a.netChange).slice(0,3).map((account: dashboardAccount, index) => (
                <div key={index} className='account'>
                  <div>
                    <h4 className='account-name'>{account.accountName}</h4>
                    <p className='account-balance roboto-light'>Balance: ${account.currentBalance}</p>
                  </div>

                  <div className='account-net-change archivo-font'>
                    <p className='value'>${account.netChange * -1}</p>
                    <FontAwesomeIcon 
                      icon={faPlay} 
                      className={account.netChange < 0 ? 'green-arrow-up' : 'red-arrow-down'}
                    />
                  </div>
                </div>
              ))}
          </div>


          <div className='categories-container'>
              {categoryData.map((category, index) => (
                <div key={index} className='category'>
                  <div className='category-name roboto-bold'>
                    <h4>{category.category}</h4>
                  </div>
                  <div className='category-amount archivo-font'>
                    <p>${category.amount.toFixed(2) * -1}</p>
                  </div>
                  <div style={{ height: calculateDivHeight(category.amount) }} className='category-budget-bar'>
                  </div>
                </div>
              ))}
              <h3 className='budgets-title'>Budgets</h3>
          </div>

          
        </div>
      </div>


      {/* --------------------------------------- CONFIG ITEMS --------------------------------------- */}

      <Modal
        open={showConfigModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <DashboardConfig filterObject={dashboardFilterData} accounts={accounts} onClose={handleCloseConfigModal} onApply={handleApplyConfigModal}/>
        </div>
      </Modal>

      <Modal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      >
        <div>
          <StripePayments />
        </div>
      </Modal>


      <Assistant />

      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="graphGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 0 }} />
          <stop offset="50%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 0.02 }} />
          <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

const PieChartMargin : Margin = {
  top: 20,
  right: 20,
  left: 20,
  bottom: 20
}

const CustomTooltipArea = ({ active, payload, label, dateFormat }: any) => {
  if (active && payload && payload.length) {
    const formattedDate = dateFormatPretty(label, dateFormat);
    return (
      <div className="box">
        <div className='content'>
          <p className='archivo-font-bold'>Date: </p>
          <p>{formattedDate}</p>
        </div>
        <div className='content'>
          <p className='archivo-font-bold'>Value: </p>
          <p>${payload[0]?.value?.toFixed(2)}</p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="box">
        <div className='content'>
          <p className='archivo-font-bold'>Label: </p>
          <p>{payload[0]?.name}</p>
        </div>
        <div className='content'>
          <p className='archivo-font-bold'>Value: </p>
          <p>${payload[0]?.value?.toFixed(2)}</p>
        </div>
      </div>
    );
  }
  return null;
};


export default Dashboard;
