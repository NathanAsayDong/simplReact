import { FormControl, MenuItem, Select } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { Account, Category, Transaction } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetTransactionData, TransactionData, UserAccountsData, UserCategoriesData } from '../../services/Classes/dataContext';
import './TransactionsManagement.scss';


interface TransactionsManagementProps {}

const TransactionsManagement: FC<TransactionsManagementProps> = () => {
  //  --------------------- CONTEXT DATA ---------------------
  const transactions: Transaction[] = TransactionData() || [];
  const accounts: Account[] = UserAccountsData() || [];
  const categories: Category[] = UserCategoriesData() || [];
  const updateTransactions = SetTransactionData();

  //  --------------------- VARIABLES ---------------------
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  //  --------------------- FILTER DATA ---------------------
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [dateRanges, setDateRanges] = useState<any>({startDate: dayjs().subtract(2, 'week'), endDate: dayjs()});
  const [filteredCategories, setFilteredCategories] = useState<number[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<number[]>([]);

  const filterStyling = {
    borderRadius: '10px',
    color: 'black',
    padding: '0px',
    width : '100%',
    height: '31px'
  }

  const allUnsureSelected = () => {
    return filteredCategories.includes(-1);
  }

  const getAccountName = (accountId: number) => {
    const name = accounts.find((account: Account) => account.accountId === accountId)?.accountName;
    return name ? name : 'unsure';
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
    // If no filters applied, show all transactions
    if (
      (!dateRanges.startDate && !dateRanges.endDate) &&
      filteredCategories.length === 0 &&
      filteredAccounts.length === 0
    ) {
      setFilteredTransactions(transactions);
    }
    // If "All Unsure" is selected (-1 is in filter), filter transactions with no proper category
    else if (filteredCategories.includes(-1)) {
      const trans = transactions.filter((transaction: Transaction) => {
        return transaction.categoryId === -1 || transaction.categoryId == null;
      });
      setFilteredTransactions(trans);
    }
    // Otherwise apply date, category and account filters
    else {
      const trans = transactions.filter((transaction: Transaction) => {
        return (
          (!dateRanges.startDate || dayjs(transaction.timestamp).isAfter(dateRanges.startDate)) &&
          (!dateRanges.endDate || dayjs(transaction.timestamp).isBefore(dateRanges.endDate)) &&
          (filteredCategories.length === 0 || filteredCategories.includes(transaction.categoryId)) &&
          (filteredAccounts.length === 0 || filteredAccounts.includes(transaction.accountId))
        );
      });
      setFilteredTransactions(trans);
    }
  }, [dateRanges, transactions, filteredCategories, filteredAccounts]);

  const updateCategory = async (transaction: Transaction, event: any) => {
    const updatedCategoryId = event.target.value;
    if (!updatedCategoryId) {
      alert('There was an issue');
      return;
    }
    setLoading(true);
    await DataApiService.updateCategoryForTransaction(transaction, updatedCategoryId).then(
      (res: any) => {
        if (res) {
          updateTransactions(transactions.map((tra: Transaction) => {
            if (tra.transactionId === transaction.transactionId) {
              tra.categoryId = updatedCategoryId;
            }
            return tra;
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
      if (!event.target.value || event.target.value.length === 0) {
        setFilteredCategories([]);
      } else {
        // Only use numeric values (including -1 for unsure)
        const numericCategories = event.target.value.filter((val: any) => typeof val === 'number');
        setFilteredCategories(numericCategories);
      }
    }
    if (event.target.name === 'account') {
      if (!event.target.value || event.target.value.length === 0) {
        setFilteredAccounts([]);
      } else {
        const numericAccounts = event.target.value.filter((val: any) => typeof val === 'number');
        setFilteredAccounts(numericAccounts);
      }
    }
  }

  return (
  <>
    {loading ? <LinearProgress color="inherit" variant='determinate' value={loadingProgress} /> : null}
    
    <div className='page hide-scroll transactions-page'>
      <div className='container-transparent'>
        <div className='filters-row-transaction-managment' style={{gap: '5px', marginTop: '1em'}}>
          <h3 className='page-title' style={{marginRight: 'auto'}} >Transactions</h3>

          <FormControl sx={{ minWidth: 120 }}>
          <p className='label' style={{textAlign: 'start', margin: 0}}>Categories</p>
          <Select
              labelId="category-select"
              id="category-select"
              name='category'
              value={filteredCategories}
              label="Categories"
              onChange={handleFilterSelect}
              sx={filterStyling}
              multiple
              renderValue={(selected: any) =>
                selected.length === 0 ? "All" : selected.join(', ')
              }
            >
            {categories.map((category: Category, index: any) => (
            <MenuItem key={index} value={category.categoryId}>{category.categoryName}</MenuItem>
            ))}
            <MenuItem key={1002} value={-1}>{"All Unsure"}</MenuItem>
          </Select>
          </FormControl>
          { !allUnsureSelected() && <FormControl sx={{ minWidth: 120 }}>
          <p className='label' style={{textAlign: 'start', margin: 0}}>Accounts</p>
          <Select
            labelId="account-select"
            id="account-select"
            name='account'
            value={filteredAccounts}
            label="Accounts"
            onChange={handleFilterSelect}
            sx={filterStyling}
            multiple
            renderValue={(selected: any) =>
              selected.length === 0 ? "All" : selected.join(', ')
            }
            >
            {accounts.map((account: Account, index: any) => (
            <MenuItem key={index} value={account.accountId}>{account.accountName}</MenuItem>
            ))}
          </Select>
          </FormControl> }
          { !allUnsureSelected() && <div>
            <p className='label' style={{textAlign: 'start', margin: 0}}>Start Date:</p>
            <DatePicker
              value={dateRanges.startDate}
              onChange={handleStartDateSelect}
              sx={filterStyling}
            />
          </div> }
          { !allUnsureSelected() && <div>
            <p className='label' style={{textAlign: 'start', margin: 0}}>End Date:</p>
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
                  <select
                    className='select-category'
                    value={transaction.categoryId != null ? transaction.categoryId : -1} // updated default value
                    onChange={(event) => updateCategory(transaction, event)}
                  >
                    <option value={-1}>Unsure</option> {/* added default Unsure option */}
                    {categories.map((category: Category, index: any) => (
                      <option key={index} value={category.categoryId}>
                        {category.categoryName}
                      </option>
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
