import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { Transaction } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { InitializeDataForContext, SetTransactionData, TransactionData, UserCategoriesData } from '../../services/Classes/dataContext';
import ImportCsv from '../ImportCsv/ImportCsv';
import './TransactionsManagement.scss';


interface TransactionsManagementProps {}

const TransactionsManagement: FC<TransactionsManagementProps> = () => {
  const transactions = TransactionData() || [];
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const updateTransactions = SetTransactionData();
  const [loading, setLoading] = useState<boolean>(false);
  const categories = UserCategoriesData() || [];
  const [potentialUpdatedTransactions, setPotentialUpdatedTransactions] = useState<Transaction[]>([]);
  const initializeDataForContext = InitializeDataForContext();
  const [dateRanges, setDateRanges] = useState<any>({startDate: null, endDate: null});


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

  const filterStyling = {
    border: '1px solid white',
    borderRadius: '5px',
    color: 'white',
    padding: '0px',
  }


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
  }, [dateRanges, transactions])


  const handleNewCategoryChange = (id: number, event: any) => {
    let transaction = transactions.find((transaction: Transaction) => transaction.id === id);
    transaction.category = event.target.value;
    setPotentialUpdatedTransactions([...potentialUpdatedTransactions, transaction]); //we arent checking for pre-exisitng but this is good for now i think
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

  return (
  <>
    {loading ? <LinearProgress color="inherit" /> : null}

    <ImportCsv />

    <div style={{margin: '3%'}}></div>



    <div className='body'>

      <div className='container'>
        <div className='row'>
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

        <div className='container'>
          <div className='row'>
            <h2 className='section-header'>Accounts</h2>
          </div>
          {filteredTransactions.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              filteredTransactions.map((transaction: Transaction, index: any) => (
                <div key={index} className='account-row'>

                  <div className='item' style={{width: '24%'}}>
                    <h3>Description:</h3>
                    <h3>{transaction.description}</h3>
                  </div>

                  <div className='item'>
                    <h3>Amount:</h3>
                    <h3>{transaction.amount}</h3>
                  </div>

                  <div className='item' style={{width: '24%'}}>
                    <h3>Category:</h3>
                    <select onChange={(event) => handleNewCategoryChange(transaction.id, event)}>
                        <option value="none">{transaction.category}</option>
                        {categories.map((category: any, index: any) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                  </div>

                  <div className='item'>
                    <h3>Timestamp:</h3>
                    <h3>{new Date(transaction.timestamp).toLocaleDateString()}</h3>
                  </div>


                  <div className='item'>
                    <h3>Account:</h3>
                    <h3>{transaction.account}</h3>
                  </div>

                  <div className='item' style={{marginRight: '5%', marginLeft: 'auto'}}>
                    <button className='special-button' onClick={() => updateCategory(transaction.id)}>Update Category</button>
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
