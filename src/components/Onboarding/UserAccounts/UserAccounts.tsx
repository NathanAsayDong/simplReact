import { FC, useEffect } from 'react';
import PlaidService from '../../../services/Classes/plaidApiService';
import { OnboardingData } from '../Onboarding.context';
import './UserAccounts.scss';

interface UserAccountsProps {}

const UserAccounts: FC<UserAccountsProps> = () =>  {
    const OnboardingContext = OnboardingData();
    const { open, ready, exit, newAccounts } = PlaidService();

    const openPlaid = () => {
        if (ready) {
            open();
        } else {
            alert('Plaid not ready');
            exit();
        }
    }

    useEffect(() => {
        localStorage.removeItem('lastSync')
        OnboardingContext?.setAccounts([
            ...(OnboardingContext?.onboardingData?.accounts ?? []),
            ...(newAccounts ?? []),
        ]);
    }, [newAccounts]);

    useEffect(() => {
        OnboardingContext.fetchAccounts();
    }, [open, ready]);

    const updateAccountName = (e: any, index: any) => {
        const updatedAccounts = OnboardingContext?.onboardingData?.accounts;
        updatedAccounts[index].name = e.target.value;
        OnboardingContext?.setAccounts(updatedAccounts);
    }

    const removeAccount = (accountId: any) => {
        const accounts = OnboardingContext?.onboardingData?.accounts;
        if (accounts) {
            const newAccounts = accounts.filter((acc: any) => acc.id !== accountId);
            OnboardingContext?.setAccounts(newAccounts);
        }
    }

    const addTestAccount = () => {
        OnboardingContext?.setAccounts([
            ...(OnboardingContext?.onboardingData?.accounts ?? []),
            {
                id: 'test',
                name: 'Test Account',
                source: 'Test Source',
                type: 'Test Type',
            }
        ]);
    }

    return (
        <>
            <h1 className='section-title' >Connect Accounts </h1>
            <button onClick={addTestAccount} >Test</button>
            <p>Connect to all your financial insitutions so Simpl can access your financial data.</p>
            <div className='form-container hide-scroll' style={{height: 450}}>
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
