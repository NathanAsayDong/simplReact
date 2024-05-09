import { FC, useEffect, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Transaction } from '../../services/Classes/classes';
import { SetTransactionData, SetUserCategoryData, TransactionData, UserCategoriesData } from '../../services/Classes/dataContext';
import NavBar from '../NavBar/NavBar';
import './TransactionsManagement.scss';


interface TransactionsManagementProps {}

const TransactionsManagement: FC<TransactionsManagementProps> = () => {
  const transactions = TransactionData() || [];
  const updateTransactions = SetTransactionData();
  const [loading, setLoading] = useState<boolean>(true);
  const categories = UserCategoriesData() || [];
  const [updateCategoryValue, setUpdateCategoryValue] = useState<string>('');
  const [potentialUpdatedTransactions, setPotentialUpdatedTransactions] = useState<Transaction[]>([]);
  const updateCategories = SetUserCategoryData();



  useEffect(() => {
    if (transactions.length > 0 || categories.length > 0) {
      setLoading(false);
    }
    else {
      setLoading(true);
      initializeTransactions();
      initializeCategories();
    }
  }, [transactions, categories]);


  const initializeTransactions = async () => {
    if (transactions.length === 0) {
      const res = await TransactionProcessingLocal.getAllTransactions();
      if (res) {
        updateTransactions(res);
        setLoading(false);
      }
    }
  };

  const initializeCategories = async () => {
    const res = await TransactionProcessingLocal.getAllCategories();
    if (res) {
      updateCategories(res);
      setLoading(false);
    }
  };

  const handleNewCategoryChange = (id: number, event: any) => {
    setUpdateCategoryValue(event.target.value);
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
    await TransactionProcessingLocal.updateCategoryForTransaction(id, category).then(
      (res: any) => {
        if (res) {
          initializeTransactions();
        }
      }
    );
  }

  return (
  <>
    <NavBar />
    <div className='body'>

        <div className='container'>
          <div className='row'>
            <h2 className='section-header'>Accounts</h2>
          </div>
          {loading ? (
              <div className='loading'>Loading...</div>
            ) : (
              transactions.map((transaction: Transaction, index: any) => (
                <div key={index} className='account-row'>

                  <div className='item' style={{width: '24%'}}>
                    <h3>Description:</h3>
                    <h3>{transaction.description}</h3>
                  </div>

                  <div className='item'>
                    <h3>Amount:</h3>
                    <h3>{transaction.amount * -1}</h3>
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
