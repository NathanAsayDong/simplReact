import { faCheck, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Account } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetUserAccountData, UserAccountsData } from '../../services/Classes/dataContext';
import PlaidService from '../../services/Classes/plaidApiService';
import './Accounts.component.scss';
import { Modal } from '@mui/material';
import ConfirmModal from '../../modals/ConfirmModal/ConfirmModal';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const updateAccounts = SetUserAccountData();
  const { open, ready, newAccounts } = PlaidService();
  const [updatedAccountNamesMap, setUpdatedAccountNamesMap] = useState<Map<number, string>>(new Map());
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    const newAccountsFiltered = newAccounts.filter((newAccount: Account) => !accounts.some((account: Account) => account.accountId === newAccount.accountId));
    localStorage.removeItem('lastSync')
    updateAccounts([...accounts, ...newAccountsFiltered]);
  }, [newAccounts]);

  const AddPlaidAccounts = async () => {
      if (ready) {
          open();
      } else {
          console.log('Plaid not ready');
      }
  }

  const requestDeleteAccount = (account: Account) => {
    setSelectedAccount(account);
    setShowConfirmModal(true);
  }

  const deleteAccount = async () => {
    if (!selectedAccount) return;
    DataApiService.deleteAccount(selectedAccount);
    updateAccounts(accounts.filter((acc: Account) => acc !== selectedAccount));
  }

  const updateAccountName = (accountId: number, name: string) => {
    const updatedAccountNames = new Map(updatedAccountNamesMap);
    updatedAccountNames.set(accountId, name);
    setUpdatedAccountNamesMap(updatedAccountNames);
  }

  const canSave = (accountId: number) => {
    return updatedAccountNamesMap.has(accountId);
  }

  const saveName = async (accountId: number) => {
    const name = updatedAccountNamesMap.get(accountId);
    const updatedAccounts = accounts.map((account: Account) => {
      if (account.accountId === accountId && name) {
        account.accountName = name;
      }
      return account;
    });
    updateAccounts(updatedAccounts);
    const updatedAccount = accounts.find((account: Account) => account.accountId === accountId);
    await DataApiService.updateAccountName(updatedAccount);
    const updatedAccountNames = new Map(updatedAccountNamesMap);
    updatedAccountNames.delete(accountId);
    setUpdatedAccountNamesMap(updatedAccountNames);
  }

  const resetName = (accountId: number) => {
    const originalName = accounts.find((account: Account) => account.accountId === accountId)?.name;
    if (originalName) {
      const updatedAccountNames = new Map(updatedAccountNamesMap);
      updatedAccountNames.delete(accountId);
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
                    <input className='account-name-input' value={updatedAccountNamesMap.has(account.accountId) ? updatedAccountNamesMap.get(account.accountId) : account.accountName} onChange={(event) => updateAccountName(account.accountId, event.target.value)}/>
                  </div>

                  <div className='item hide-scroll' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Type:</h3>
                    <h3>{account.accountType}</h3>
                  </div>

                  <div className='item hide-scroll' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Current Balance:</h3>
                    <h3>${account.refBalance}</h3>
                  </div>

                  <div className='item hide-scroll' style={{width: 'auto'}}>
                    <h3 className='roboto-bold'>Source:</h3>
                    <h3 style={{whiteSpace: 'nowrap'}}>{account.accountSource}</h3>
                  </div>

                  {!canSave(account.accountId) && (
                    <div className='item hide-scroll' style={{marginRight: '8%'}}>
                      <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => requestDeleteAccount(account)}/>
                    </div>
                  )}

                  {canSave(account.accountId) && (
                    <div className='item hide-scroll' style={{marginRight: '8%'}}>
                      <FontAwesomeIcon icon={faCheck} className='upload-icon' onClick={() => saveName(account.accountId)}/>
                      <FontAwesomeIcon icon={faTimes} className='cancel-icon' onClick={() => resetName(account.accountId)}/>
                    </div>
                  )}

                </div>
              ))
            )}
        </div>
      </div>

      <Modal open={showConfirmModal} onClose={() => {setShowConfirmModal(false)}}>
          <div>
              <ConfirmModal prompt="Are you sure you want to delete this account?"
              onCancel={() => {setShowConfirmModal(false)}}
              onConfirm={() => {deleteAccount()}}/>
          </div>
      </Modal>

    </>
  );
}

export default Accounts;
