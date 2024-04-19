import { FC, useEffect, useState } from 'react';
import { Account, accountTypes } from '../../services/Classes/classes';
import { UserAccountsData } from '../../services/Classes/dataContext';
import NavBar from '../NavBar/NavBar';
import './Accounts.scss';

interface AccountsProps {}

const Accounts: FC<AccountsProps> = () =>  {
  const accounts = UserAccountsData() || [];
  const [accountsState, setAccountsState] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const accountTypeOptions = useState<string[]>(accountTypes);

  useEffect(() => {
    if (accounts.length > 0) {
      setAccountsState(accounts);
      setLoading(false);
    }
  }, [accounts]);


  const test = async () => {
    console.log('test');
    console.log(accounts);
    console.log(accounts[0].type);
  };
  

// available account types
//   export class AccountTypes {
//     value : string = 'Uccu' || 'Chase' || 'Discover' || 'CapitalOne' || 'Venmo' || 'CashApp' || 'Paypal' || 'Cash' || 'Other';
//     constructor(value: string) {
//         this.value = value;
//     }
// }

  return (
    <>
      <NavBar />
      <div className='body'>

        <div className='container'>
          <div className='row'>
            <div className='item' style={{width: '75%'}}>
              <h2 className='section-header'>Add Account</h2>
              <input type='text' placeholder='Account Name' />
              <select>
                {accountTypeOptions[0].map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
            </select>
            </div>
            <button className='special-button'>Add Account</button>
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

                  <div className='item'>
                    <h3>Account:</h3>
                    <h3>{account.name}</h3>
                  </div>

                  <div className='item'>
                    <h3>Type:</h3>
                    <h3>{account.type.toString()}</h3>
                  </div>

                  <h3  style={{marginRight: "5%", marginLeft: "auto"}}>Balance Not Available</h3>
                </div>
              ))
            )}
        </div>
        
      </div>

    </>
  );
}

export default Accounts;
