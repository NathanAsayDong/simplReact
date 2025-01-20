import { faCheck, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Account } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import PlaidService from '../../services/Classes/plaidApiService';
import './Accounts.component.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  const { open, ready, exit, newAccounts } = PlaidService();
  const [updatedAccountNamesMap, setUpdatedAccountNamesMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const newAccountsFiltered = newAccounts.filter((newAccount: Account) => !accounts.some((account: Account) => account.id === newAccount.id));
    localStorage.removeItem('lastSync')
    updateAccounts([...accounts, ...newAccountsFiltered]);
    console.log('exit', exit); //this is bad, i just added this so i could build
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
    const originalName = accounts.find((account: Account) => account.id === id)?.name;
    if (originalName) {
      const updatedAccountNames = new Map(updatedAccountNamesMap);
      updatedAccountNames.delete(id);
      setUpdatedAccountNamesMap(updatedAccountNames);
    }
  }


  return (
    <>
      <div className='page hide-scroll'>
        <div className='row' style={{paddingTop: '1em'}}>
            <h3 className='page-title'>Accounts</h3>
            <button className='add-button-accounts' onClick={AddPlaidAccounts}><FontAwesomeIcon icon={faPlus} size='lg' /></button>
        </div>
        <div className='container-transparent'>
          {accounts.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              accounts.map((account: Account, index: any) => (
                <div key={index} className='account-row hide-scroll'>

                  <div className='item hide-scroll' style={{marginLeft: '2%'}}> 
                    <h3 className='roboto-bold'>Account:</h3>
                    <input className='account-name-input' value={updatedAccountNamesMap.has(account.id) ? updatedAccountNamesMap.get(account.id) : account.name} onChange={(event) => updateAccountName(account.id, event.target.value)}/>
                  </div>

                  <div className='item hide-scroll' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Type:</h3>
                    <h3>{account.type}</h3>
                  </div>

                  <div className='item hide-scroll' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Current Balance:</h3>
                    <h3>${account.refBalance}</h3>
                  </div>

                  <div className='item hide-scroll' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Source:</h3>
                    <h3 style={{whiteSpace: 'nowrap'}}>{account.source}</h3>
                  </div>

                  {!canSave(account.id) && (
                    <div className='item hide-scroll' style={{marginRight: '8%'}}>
                      <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => deleteAccount(account)}/>
                    </div>
                  )}

                  {canSave(account.id) && (
                    <div className='item hide-scroll' style={{marginRight: '8%'}}>
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
