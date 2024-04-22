import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Account, AccountTypes, accountTypes } from '../../services/Classes/classes';
import { SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import NavBar from '../NavBar/NavBar';
import './Accounts.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const [accountsState, setAccountsState] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const accountTypeOptions = useState<string[]>(accountTypes);
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountType, setNewAccountType] = useState<AccountTypes>(new AccountTypes('None'));
  const updateAccounts = SetUserAccountData();

  
  useEffect(() => {
    if (accounts.length > 0) {
      setAccountsState(accounts);
      setLoading(false);
    }
    else {
      setLoading(true);
      initializeAccounts();
    }
  }, [accounts]);

  const handleAccountNameChange = (e: any) => {
    console.log(e.target.value);
    setNewAccountName(e.target.value);
  }

  const handleAccountTypeChange = (e: any) => {
    console.log(e.target.value);
    setNewAccountType(e.target.value);
  }

  const initializeAccounts = async () => {
    if (accounts.length === 0) {
      const res = await TransactionProcessingLocal.getAllAccounts();
      if (res) {
        updateAccounts(res);
        setLoading(false);
      } else {
        console.log('Failed to get accounts');
      }
    }
  };

  const test = async () => {
    console.log('test');
    console.log(accounts);
    console.log(accounts[0].type);
  };
  
  const addAccount = async () => {
    console.log('addAccount');
    if (newAccountName === '' || newAccountType.value === 'None') {
      alert('Please fill out all fields');
      return;
    }
    else {
      const account = new Account(newAccountName, newAccountType);
      TransactionProcessingLocal.addAccount(account);
      setAccountsState([...accountsState, account]);
    }
  };

  const deleteAccount = async (account: Account) => {
    console.log('deleteAccount');
    console.log(account);
    TransactionProcessingLocal.deleteAccount(account);
    setAccountsState(accountsState.filter((acc) => acc !== account));
  }

  return (
    <>
      <NavBar />
      <div className='body'>

        <div className='container'>
          <div className='row'>
            <div className='item' style={{width: '75%'}}>
              <h2 className='section-header'>Add Account</h2>
              <input type='text' placeholder='Account Name' onChange={handleAccountNameChange}/>
              <select onChange={handleAccountTypeChange}>
                <option value="None">Select Type</option>
                {accountTypeOptions[0].map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
            </select>
            </div>
            <button className='special-button' onClick={addAccount}>Add Account</button>
          </div>
        </div>

        <div className='container'>
          <div className='row'>
            <h2 className='section-header'>Accounts</h2>
          </div>
          {loading ? (
              <div className='loading'>Loading...</div>
            ) : (
              accountsState.map((account, index) => (
                <div key={index} className='account-row'>

                  <div className='item' style={{width: '24%'}}>
                    <h3>Account:</h3>
                    <h3>{account.name}</h3>
                  </div>

                  <div className='item'>
                    <h3>Type:</h3>
                    <h3>{account.type.toString()}</h3>
                  </div>

                  <div className='item' style={{marginRight: '5%', marginLeft: 'auto'}}>
                    <h3>Balance Unavailable</h3>
                    <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => deleteAccount(account)}/>
                  </div>
                </div>
              ))
            )}
        </div>
        
      </div>

    </>
  );
}

export default Accounts;
