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

    const test = () => {
        console.log('onboarding context: ', OnboardingContext.onboardingData);
    }

    useEffect(() => {
        console.log('new accounts detected a change, setting accounts in context', newAccounts);
        OnboardingContext?.setAccounts(newAccounts);
    }, [newAccounts]);

    return (
        <>
            <h1 className='section-title' >Connect Accounts </h1>
            <div className='form-container' style={{height: 368}}>
                <button onClick={openPlaid} className='add-account-button'> Add Account </button>
                <button onClick={test} className='add-account-button'> TEST </button>


                {OnboardingContext?.onboardingData?.accounts?.map((account: any, idx: any) => (
                    <div className='account-row-card' key={idx}>
                        <p>{account.name}</p>
                        <p>{account.source}</p>
                        <p>{account.type}</p>
                    </div>
                ))}
            </div>

        </>
    )
}

export default UserAccounts;
