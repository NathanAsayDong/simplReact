import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { Account, Transaction } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { InitializeDataForContext, SetTransactionData, TransactionData, UserAccountsData, UserCategoriesData } from '../../services/Classes/dataContext';
import ImportCsv from '../ImportCsv/ImportCsv';
import './TransactionsManagement.scss';


interface TransactionsManagementProps {}

const TransactionsManagement: FC<TransactionsManagementProps> = () => {
  //  --------------------- CONTEXT DATA ---------------------
  const transactions = TransactionData() || [];
  const accounts = UserAccountsData() || [];
  const categories = UserCategoriesData() || [];
  const initializeDataForContext = InitializeDataForContext();
  const updateTransactions = SetTransactionData();

  //  --------------------- VARIABLES ---------------------
  const [loading, setLoading] = useState<boolean>(false);
  const [potentialUpdatedTransactions, setPotentialUpdatedTransactions] = useState<Transaction[]>([]);

  //  --------------------- FILTER DATA ---------------------
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [dateRanges, setDateRanges] = useState<any>({startDate: null, endDate: null});
  const [filteredCategories, setFilteredCategories] = useState<string[]>(['All']);
  const [filteredAccounts, setFilteredAccounts] = useState<string[]>(['All']);

  const filterStyling = {
    border: '1px solid white',
    borderRadius: '5px',
    color: 'white',
    padding: '0px',
    width : '100%'
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
      setLoading(true);
      initializeDataForContext();
      setLoading(false);
  }, [transactions, categories]);

  useEffect(() => {
    if (!dateRanges.startDate && !dateRanges.endDate) {
      setFilteredTransactions(transactions);
    } 
    if (dateRanges.startDate && !dateRanges.endDate) {
      setFilteredTransactions(transactions.filter((transaction: Transaction) => {
        return dayjs(transaction.timestamp).isAfter(dateRanges.startDate);
      }));
    }
    if (!dateRanges.startDate && dateRanges.endDate) {
      setFilteredTransactions(transactions.filter((transaction: Transaction) => {
        return dayjs(transaction.timestamp).isBefore(dateRanges.endDate);
      }));
    }
    if (dateRanges.startDate && dateRanges.endDate) {
      setFilteredTransactions(transactions.filter((transaction: Transaction) => {
        return dayjs(transaction.timestamp).isAfter(dateRanges.startDate) && dayjs(transaction.timestamp).isBefore(dateRanges.endDate);
      }));
    }
  }, [dateRanges, transactions, filteredCategories, filteredAccounts]);


  const handleNewCategoryChange = (id: number, event: any) => {
    let transaction = transactions.find((transaction: Transaction) => transaction.id === id);
    transaction.category = event.target.value;
    setPotentialUpdatedTransactions([...potentialUpdatedTransactions, transaction]);
    updateCategory(id);
  }

  const updateCategory = async (id: number) => {
    const category = potentialUpdatedTransactions.find((transaction: Transaction) => transaction.id === id)?.category;
    if (!category) {
      alert('There was an issue');
      return;
    }
    setLoading(true);
    await DataApiService.updateCategoryForTransaction(id, category).then(
      (res: any) => {
        if (res) {
          updateTransactions(transactions.map((transaction: Transaction) => {
            if (transaction.id === id) {
              transaction.category = category;
            }
            return transaction;
          }));
        }
        setLoading(false);
      }
    ).catch(() => {
      setLoading(false);
      alert('There was an issue');
    }
    );
  }

  const handleFilterSelect = (event: any) => {
    if (event.target.name === 'category') {
      setFilteredCategories(event.target.value);
    }
    if (event.target.name === 'account') {
      setFilteredAccounts(event.target.value);
    }
  }

  return (
  <>
    {loading ? <LinearProgress color="inherit" /> : null}

    <ImportCsv />

    <div className='body'>
      <div className='row'>
            <h3 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Transactions</h3>
      </div>
      <div className='container-transparent'>
        <div className='row' style={{gap: '5px'}}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="category-select">Categories</InputLabel>
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
          </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="account-select">Accounts</InputLabel>
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
          </FormControl>
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
        </div>
      </div>
      <div className='container-transparent'>
        {filteredTransactions.length == 0 ? (
            <div className='loading'>Loading...</div>
          ) : (
            filteredTransactions.slice().reverse().map((transaction: Transaction, index: any) => (
              <div key={index} className='transaction-row'>

                <div className='item' style={{width: '24%', maxWidth: '24%',marginLeft: '2%'}}>
                  <h3 className='roboto-bold'>Description:</h3>
                  <h3 className='description-text'>{transaction.description}</h3>
                </div>

                <div className='item' style={{width: '18%'}}>
                  <h3 className='roboto-bold'>Amount:</h3>
                  <h3>${transaction.amount.toFixed(2)}</h3>
                </div>

                <div className='item' style={{width: '18%', marginRight: '2%'}}>
                  <h3 className='roboto-bold'>Category:</h3>
                  <select className='select-category' onChange={(event) => handleNewCategoryChange(transaction.id, event)}>
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
                  <h3>{transaction.account}</h3>
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
