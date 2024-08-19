import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Account } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { InitializeDataForContext, SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import PlaidService from '../../services/Classes/plaidApiService';
import './Accounts.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  const [newAccountData, setNewAccountData] = useState<any>({name: '', type: '', source: '', refDate: '', refBalance: 0});
  const initializeData = InitializeDataForContext();
  const { open, ready, exit, newAccounts } = PlaidService();

  initializeData();

  useEffect(() => {
    console.log('new accounts detected a change, setting accounts in context', newAccounts);
    newAccounts.forEach((account: Account) => {
      try {
        DataApiService.addAccount(account).then(() => {
          updateAccounts([...accounts, account]);
        });
      } catch (error) {
        console.error('Error adding account:', error);
      }
    });
  }, [newAccounts]);


  const AddPlaidAccounts = async () => {
      if (ready) {
          open();
      } else {
          console.log('Plaid not ready');
      }
  }

  const deleteAccount = async (account: Account) => {
    DataApiService.deleteAccount(account);
    updateAccounts(accounts.filter((acc: Account) => acc !== account));
  }


  return (
    <>
      <div className='body'>
        <div className='row'>
            <h3 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Add Account</h3>
        </div>

        <div className='container'>
          <button className='special-button' onClick={AddPlaidAccounts}>Add Account</button>
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
