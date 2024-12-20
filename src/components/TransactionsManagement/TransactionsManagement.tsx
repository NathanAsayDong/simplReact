import { FormControl, MenuItem, Select } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { Account, Transaction } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetTransactionData, TransactionData, UserAccountsData, UserCategoriesData } from '../../services/Classes/dataContext';
import './TransactionsManagement.scss';


interface TransactionsManagementProps {}

const TransactionsManagement: FC<TransactionsManagementProps> = () => {
  //  --------------------- CONTEXT DATA ---------------------
  const transactions = TransactionData() || [];
  const accounts = UserAccountsData() || [];
  const categories = UserCategoriesData() || [];
  const updateTransactions = SetTransactionData();

  //  --------------------- VARIABLES ---------------------
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  //  --------------------- FILTER DATA ---------------------
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [dateRanges, setDateRanges] = useState<any>({startDate: dayjs().subtract(2, 'week'), endDate: dayjs()});
  const [filteredCategories, setFilteredCategories] = useState<string[]>(['All']);
  const [filteredAccounts, setFilteredAccounts] = useState<string[]>(['All']);

  const filterStyling = {
    border: '1px solid white',
    borderRadius: '5px',
    color: 'white',
    padding: '0px',
    width : '100%',
    height: '31px'
  }

  const allUnsureSelected = () => {
    return filteredCategories.includes('All Unsure');
  }

  const getAccountName = (id: string) => {
    const name = accounts.find((account: Account) => account.id === id)?.name;
    return name ? name : 'Unknown';
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

  useEffect(() => {
    if (!dateRanges.startDate && !dateRanges.endDate && filteredCategories.includes('All') && filteredAccounts.includes('All')) {
      setFilteredTransactions(transactions);
    }
    else if (filteredCategories.includes('All Unsure')) {
      let trans = transactions.filter((transaction: Transaction) => {
        return transaction.category == "unsure";
      });
      setFilteredTransactions(trans)
    }
    else {
      let trans = transactions.filter((transaction: Transaction) => {
        return ((!dateRanges.startDate || dayjs(transaction.timestamp).isAfter(dateRanges.startDate)))
        && (!dateRanges.endDate || dayjs(transaction.timestamp).isBefore(dateRanges.endDate))
        && (filteredCategories.includes('All') || filteredCategories.includes(transaction.category))
        && ((filteredAccounts.includes('All') || filteredAccounts.includes(getAccountName(transaction.accountId))));
      });
      setFilteredTransactions(trans)
    }
  }, [dateRanges, transactions, filteredCategories, filteredAccounts]);

  const updateCategory = async (id: number, event: any, accountId: string) => {
    const category = event.target.value;
    if (!category) {
      alert('There was an issue');
      return;
    }
    setLoading(true);
    await DataApiService.updateCategoryForTransaction(id, category, accountId).then(
      (res: any) => {
        if (res) {
          updateTransactions(transactions.map((transaction: Transaction) => {
            if (transaction.id === id) {
              transaction.category = category;
            }
            return transaction;
          }));
        }
        for (let i = 0; i <+ 100; i++) {
          setTimeout(() => {
            setLoadingProgress(i);
          }, 1000);
        }
        setTimeout(() => {
          setLoadingProgress(0);
          setLoading(false);
        }, 1000);
      }
    ).catch(() => {
      setLoading(false);
      setLoadingProgress(100);
      setTimeout(() => {
        setLoadingProgress(0);
      }, 1000);
      alert('There was an issue');
    }
    );
  }

  const handleFilterSelect = (event: any) => {
    if (event.target.name === 'category') {
      if (event.target.value.length === 0 || event.target.value == null) {
        setFilteredCategories(['All']);
      } else if (event.target.value.includes('All') && !filteredCategories.includes('All')) {
        setFilteredCategories(['All']);
      } else if (event.target.value.includes('All') && filteredCategories.includes('All')) {
        setFilteredCategories(event.target.value.filter((category: string) => category !== 'All'));
      } else if (event.target.value.includes('All Unsure') && !filteredCategories.includes('All Unsure')) {
          setFilteredCategories(['All Unsure']);
          setFilteredAccounts(['All']);
      } else {
        setFilteredCategories(event.target.value);
      }
    }
    if (event.target.name === 'account') {
      if (event.target.value.length === 0 || event.target.value == null) {
        setFilteredAccounts(['All']);
      } else if (event.target.value.includes('All') && !filteredAccounts.includes('All')) {
        setFilteredAccounts(['All']);
      } else if (event.target.value.includes('All') && filteredAccounts.includes('All')) {
        setFilteredAccounts(event.target.value.filter((account: string) => account !== 'All'));
      } else {
        setFilteredAccounts(event.target.value);
      }
    }
  }

  const test = () => {
    console.log('filters', filteredCategories, filteredAccounts, dateRanges);
  }

  return (
  <>
    {loading ? <LinearProgress color="inherit" variant='determinate' value={loadingProgress} /> : null}
    
    <div className='page'>
      <div className='container-transparent'>
        <div className='filters-row-transaction-managment' style={{gap: '5px', marginTop: '2em'}}>
          <h3 className='special-title' style={{ marginLeft: '3%', marginBottom: '10px', color: 'white', marginRight: 'auto'}} onClick={test}>Transactions</h3>

          <FormControl sx={{ minWidth: 120 }}>
          <p className='label' style={{textAlign: 'start', color: 'white', margin: 0}}>Categories</p>
          <Select
              labelId="category-select"
              id="category-select"
              name='category'
              value={filteredCategories}
              label="Categories"
              onChange={handleFilterSelect}
              sx={filterStyling}
              multiple
            >
            <MenuItem key={1000} value={'All'}>{"All"}</MenuItem>
            {categories.map((category: string, index: any) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
            ))}
            <MenuItem key={1001} value={'unsure'}>{"unsure"}</MenuItem>
            <MenuItem key={1002} value={"All Unsure"}>{"All Unsure"}</MenuItem>
          </Select>
          </FormControl>
          { !allUnsureSelected() && <FormControl sx={{ minWidth: 120 }}>
          <p className='label' style={{textAlign: 'start', color: 'white', margin: 0}}>Accounts</p>
          <Select
            labelId="account-select"
            id="account-select"
            name='account'
            value={filteredAccounts}
            label="Accounts"
            onChange={handleFilterSelect}
            sx={filterStyling}
            multiple
            >
            <MenuItem key={1000} value={'All'}>{"All"}</MenuItem>
            {accounts.map((account: Account, index: any) => (
            <MenuItem key={index} value={account.name}>{account.name}</MenuItem>
            ))}
          </Select>
          </FormControl> }
          { !allUnsureSelected() && <div>
            <p className='label' style={{textAlign: 'start', color: 'white', margin: 0}}>Start Date:</p>
            <DatePicker
              value={dateRanges.startDate}
              onChange={handleStartDateSelect}
              sx={filterStyling}
            />
          </div> }
          { !allUnsureSelected() && <div>
            <p className='label' style={{textAlign: 'start', color: 'white', margin: 0}}>Start Date:</p>
            <DatePicker
              value={dateRanges.endDate}
              onChange={handleEndDateSelect}
              sx={filterStyling}
            />
          </div> }
        </div>
      </div>
      <div className='container-transparent'>
        {filteredTransactions.length == 0 ? (
            <div className='loading'>No Transactions</div>
          ) : (
            filteredTransactions.slice().reverse().map((transaction: Transaction, index: any) => (
              <div key={index} className='transaction-row'>

                <div className='item' style={{width: '24%', maxWidth: '24%',marginLeft: '2%'}}>
                  <h3 className='roboto-bold'>Description:</h3>
                  <h3 className='description-text hide-scroll'>{transaction.description}</h3>
                </div>

                <div className='item' style={{width: '18%'}}>
                  <h3 className='roboto-bold'>Amount:</h3>
                  <h3>${(transaction.amount * -1).toFixed(2)}</h3>
                </div>

                <div className='item' style={{width: '18%', marginRight: '2%'}}>
                  <h3 className='roboto-bold'>Category:</h3>
                  <select className='select-category' value={transaction.category} onChange={(event) => updateCategory(transaction.id, event, transaction.accountId)}>
                      <option value="none">{transaction.category}</option>
                      {categories.map((category: any, index: any) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                </div>

                <div className='item' style={{width: '18%'}}>
                  <h3 className='roboto-bold'>Timestamp:</h3>
                  <h3>{new Date(transaction.timestamp).toLocaleDateString()}</h3>
                </div>


                <div className='item'>
                  <h3 className='roboto-bold'>Account:</h3>
                  <h3>{getAccountName(transaction.accountId)}</h3>
                </div>

              </div>
            ))
          )}
      </div>
    </div>
  </>
  )
};

export default TransactionsManagement;
