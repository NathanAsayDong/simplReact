import { FC, useEffect } from 'react';
import PlaidService from '../../../services/Classes/plaidApiService';
import { OnboardingData } from '../Onboarding.context';
import './UserAccounts.scss';

interface UserAccountsProps {}

const UserAccounts: FC<UserAccountsProps> = () =>  {
    const OnboardingContext = OnboardingData();
    const { open, ready, exit, newAccounts } = PlaidService();

    const openPlaid = () => {
        console.log('Open Plaid');
        if (ready) {
            open();
        } else {
            console.log('Plaid not ready');
        }
    }

    useEffect(() => {
        console.log('new accounts detected a change, setting accounts in context', newAccounts);
        OnboardingContext?.setAccounts(newAccounts);
    }, [newAccounts]);

    const updateAccountName = (e: any, index: any) => {
        const updatedAccounts = OnboardingContext?.onboardingData?.accounts;
        updatedAccounts[index].name = e.target.value;
        OnboardingContext?.setAccounts(updatedAccounts);
    }

    const removeAccount = (accountId: any) => {
        console.log('Remove Account', accountId);
        const accounts = OnboardingContext?.onboardingData?.accounts;
        console.log('accounts: ', accounts);
        if (accounts) {
            const newAccounts = accounts.filter((acc: any) => acc.id !== accountId);
            OnboardingContext?.setAccounts(newAccounts);
        }
    }

    return (
        <>
            <h1 className='section-title' >Connect Accounts </h1>
            <div className='form-container hide-scroll' style={{height: 368}}>
                <button onClick={openPlaid} className='add-account-button' style={{marginBottom: 10}}> Add Account </button>

                {OnboardingContext?.onboardingData?.accounts?.map((account: any, idx: any) => (
                    <div className='account-row-card' key={idx}>
                        <input type="text" value={account.name} onChange={(e) => updateAccountName(e, idx)} className='account-name'/>
                        <div className='row' style={{height: 38}}>
                            <p>Institution</p>
                            <p className='highlight'>{account.source}</p>
                        </div>
                        <div className='row' style={{height: 38}}>
                            <p>Type</p>
                            <p className='highlight'>{account.type}</p>
                        </div>
                        <button className='remove-account-button' onClick={() => removeAccount(account.id)}>Remove Account</button>
                    </div>
                ))}
            </div>

        </>
    )
}

export default UserAccounts;
