import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker } from '@mui/x-date-pickers';
import { FC, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Account, accountSources, accountTypes } from '../../services/Classes/classes';
import { InitializeDataForContext, SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import NavBar from '../NavBar/NavBar';
import './Accounts.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();


  const [newRefDate, setNewRefDate] = useState<string>(new Date().toLocaleDateString());
  const [newAccountData, setNewAccountData] = useState<any>({name: '', type: '', source: '', refDate: '', refBalance: 0});

  // I dont actually need to use an effect here becuase i only want to initialize the data once
  InitializeDataForContext();
  
  const handleNewAccountDataChange = (e: any) => {
    setNewAccountData({...newAccountData, [e.target.name]: e.target.value});
  }

  const addAccount = async () => {
    if (newAccountData.name === '' || newAccountData.type === '' || newAccountData.source === '' || newAccountData.refDate === '' || newAccountData.refBalance === 0) {
      alert('Please fill out all fields');
      return;
    }
    else {
      const account = new Account(newAccountData.name, newAccountData.type, newAccountData.source, newRefDate, newAccountData.refBalance);
      TransactionProcessingLocal.addAccount(account);
      updateAccounts(accounts.append(account));
    }
  }

  const deleteAccount = async (account: Account) => {
    TransactionProcessingLocal.deleteAccount(account);
    updateAccounts(accounts.filter((acc: Account) => acc !== account));
  }

  const handleNewRefDate = (newValue: any) => {
    setNewRefDate(newValue.$d.toLocaleDateString());
  }


  return (
    <>
      <NavBar />
      <div className='body'>

        <div className='container'>
          <div className='row'>
            <div className='item' style={{width: '75%'}}>
              <h2 className='section-header'>Add Account</h2>
              <input type='text' name='name' placeholder='Account Name' onChange={handleNewAccountDataChange}/>
              <select onChange={handleNewAccountDataChange} name='type'>
                <option value="None">Select Type</option>
                {accountTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <select onChange={handleNewAccountDataChange} name='source'>
                <option value="None">Select Type</option>
                {accountSources.map((source, index) => (
                  <option key={index} value={source}>{source}</option>
                ))}
              </select>
              <div style={{width: '32%'}}>
                <DatePicker label="Reference Date" onChange={(date) => handleNewRefDate(date)}/>
              </div>
              <input type='number' name='refBalance' placeholder='Reference Balance' onChange={handleNewAccountDataChange}/>
            </div>
            <button className='special-button' onClick={addAccount}>Add Account</button>
          </div>
        </div>

        <div className='container'>
          <div className='row'>
            <h2 className='section-header'>Accounts</h2>
          </div>
          {accounts.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              accounts.map((account: Account, index: any) => (
                <div key={index} className='account-row'>

                  <div className='item'>
                    <h3>Account:</h3>
                    <h3>{account.name}</h3>
                  </div>

                  <div className='item'>
                    <h3>Type:</h3>
                    <h3>{account.type}</h3>
                  </div>

                  <div className='item'>
                    <h3>Source:</h3>
                    <h3>{account.source}</h3>
                  </div>

                  <div className='item'>
                    <h3>Reference Date:</h3>
                    <h3>{account.refDate}</h3>
                  </div>

                  <div className='item'>
                    <h3>Reference Balance:</h3>
                    <h3>{account.refBalance}</h3>
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
