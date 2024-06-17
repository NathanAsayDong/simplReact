import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker } from '@mui/x-date-pickers';
import { FC, useState } from 'react';
import { Account, accountSources, accountTypes } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { InitializeDataForContext, SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import './Accounts.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  const [newAccountData, setNewAccountData] = useState<any>({name: '', type: '', source: '', refDate: '', refBalance: 0});
  const initializeData = InitializeDataForContext();

  initializeData();
  
  const handleNewAccountDataChange = (e: any) => {
    setNewAccountData({...newAccountData, [e.target.name]: e.target.value});
  }

  const addAccount = async () => {
    console.log('new account: ', newAccountData)
    if (newAccountData.name === '' || newAccountData.type === '' || newAccountData.source === '' || newAccountData.refDate === '' || newAccountData.refBalance === 0) {
      alert('Please fill out all fields');
      return;
    }
    else {
      const account = new Account(newAccountData.name, newAccountData.type, newAccountData.source, newAccountData.refDate , newAccountData.refBalance);
      DataApiService.addAccount(account).then(() => {
        updateAccounts(accounts.concat(account));
      });
    }
  }

  const deleteAccount = async (account: Account) => {
    DataApiService.deleteAccount(account);
    updateAccounts(accounts.filter((acc: Account) => acc !== account));
  }

  const handleNewRefDate = (newValue: any) => {
    setNewAccountData({...newAccountData, refDate: newValue.$d.toLocaleDateString()});
  }


  return (
    <>
      <div className='body'>
        <div className='row'>
            <h3 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Add Account</h3>
        </div>

        <div className='container'>
          <div className='row'>
            <div className='item' style={{width: '80%', gap: '1em', marginLeft: '1em'}}>
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

        <div className='row'>
            <h3 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Accounts</h3>
        </div>
        <div className='container-transparent'>
          {accounts.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              accounts.map((account: Account, index: any) => (
                <div key={index} className='transaction-row'>

                  <div className='item' style={{width: '15%', maxWidth: '15%',marginLeft: '2%'}}> 
                    <h3 className='roboto-bold'>Account:</h3>
                    <h3>{account.name}</h3>
                  </div>

                  <div className='item' style={{width: '15%'}}>
                    <h3 className='roboto-bold'>Type:</h3>
                    <h3>{account.type}</h3>
                  </div>

                  <div className='item' style={{width: '15%'}}>
                    <h3 className='roboto-bold'>Source:</h3>
                    <h3>{account.source}</h3>
                  </div>

                  <div className='item'>
                    <h3 className='roboto-bold'>Reference Date:</h3>
                    <h3>{account.refDate}</h3>
                  </div>

                  <div className='item'>
                    <h3 className='roboto-bold'>Reference Balance:</h3>
                    <h3>${account.refBalance.toFixed(2)}</h3>
                  </div>

                  <div className='item' style={{marginRight: '2em', marginLeft: 'auto'}}>
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
