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
        OnboardingContext?.setAccounts(newAccounts);
    }, [newAccounts]);

    return (
        <>
            <h1 className='section-title' >Connect Accounts </h1>
            <div className='form-container' style={{height: 368}}>
                <button onClick={openPlaid} className='add-account-button'> Add Account </button>

                {OnboardingContext?.accounts?.map((account: any, idx: any) => (
                    <div className='account' key={idx}>
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
