import { faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Account } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import PlaidService from '../../services/Classes/plaidApiService';
import './Accounts.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  const { open, ready, exit, newAccounts } = PlaidService();
  const [updatedAccountNamesMap, setUpdatedAccountNamesMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const newAccountsFiltered = newAccounts.filter((newAccount: Account) => !accounts.some((account: Account) => account.id === newAccount.id));
    newAccountsFiltered.forEach(async (account: Account) => {
      await DataApiService.addAccount(account);
      console.log('added account', account);
    });
    console.log('updating accounts context');
    updateAccounts([...accounts, ...newAccountsFiltered]);
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

  const updateAccountName = (id: string, name: string) => {
    const updatedAccountNames = new Map(updatedAccountNamesMap);
    updatedAccountNames.set(id, name);
    setUpdatedAccountNamesMap(updatedAccountNames);
  }

  const canSave = (id: string) => {
    return updatedAccountNamesMap.has(id);
  }

  const saveName = async (id: string) => {
    const name = updatedAccountNamesMap.get(id);
    const updatedAccounts = accounts.map((account: Account) => {
      if (account.id === id && name) {
        account.name = name;
      }
      return account;
    });
    updateAccounts(updatedAccounts);
    const updatedAccount = accounts.find((account: Account) => account.id === id);
    //TODO: loading
    await DataApiService.updateAccount(updatedAccount);
    const updatedAccountNames = new Map(updatedAccountNamesMap);
    updatedAccountNames.delete(id);
    setUpdatedAccountNamesMap(updatedAccountNames);
  }

  const resetName = (id: string) => {
    console.log('resetting name', id);
    const originalName = accounts.find((account: Account) => account.id === id)?.name;
    if (originalName) {
      const updatedAccountNames = new Map(updatedAccountNamesMap);
      updatedAccountNames.delete(id);
      setUpdatedAccountNamesMap(updatedAccountNames);
    }
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
                <div key={index} className='account-row'>

                  <div className='item' style={{marginLeft: '2%'}}> 
                    <h3 className='roboto-bold'>Account:</h3>
                    <input className='account-name-input' value={updatedAccountNamesMap.has(account.id) ? updatedAccountNamesMap.get(account.id) : account.name} onChange={(event) => updateAccountName(account.id, event.target.value)}/>
                  </div>

                  <div className='item' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Type:</h3>
                    <h3>{account.type}</h3>
                  </div>

                  <div className='item' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Source:</h3>
                    <h3 style={{whiteSpace: 'nowrap'}}>{account.source}</h3>
                  </div>

                  {!canSave(account.id) && (
                    <div className='item' style={{marginRight: '8%'}}>
                      <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => deleteAccount(account)}/>
                    </div>
                  )}

                  {canSave(account.id) && (
                    <div className='item' style={{marginRight: '8%'}}>
                      <FontAwesomeIcon icon={faCheck} className='upload-icon' onClick={() => saveName(account.id)}/>
                      <FontAwesomeIcon icon={faTimes} className='cancel-icon' onClick={() => resetName(account.id)}/>
                    </div>
                  )}

                </div>
              ))
            )}
        </div>
        
      </div>

    </>
  );
}

export default Accounts;
