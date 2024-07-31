import { FC } from 'react';
import { PlaidService } from '../../../services/Classes/plaidApiService';
import { OnboardingData } from '../Onboarding.context';
import './UserAccounts.scss';



interface UserAccountsProps {}

const UserAccounts: FC<UserAccountsProps> = () =>  {
    const OnboardingContext = OnboardingData();
    const plaidservice = PlaidService();


    const testContextData = () => {
        console.log(OnboardingContext.onboardingData);
    }

    const openPlaid = () => {
        if (plaidservice.ready) {
            plaidservice.open();
        }
    }

    const exitPlaid = () => {
        plaidservice.exit();
    }

    
    return (
        <>
            <h1 className='section-title' >Connect Accounts </h1>
            <div className='form-container'>
                <p style={{"color":"black"}}>Plaid integration here</p>
                <button onClick={testContextData}>TEST CONTEXT DATA</button>
                <button onClick={openPlaid}>OPEN PLAID</button>
            </div>
        </>
    )
}

export default UserAccounts;
