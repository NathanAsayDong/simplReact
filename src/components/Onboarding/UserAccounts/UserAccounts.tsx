import { FC } from 'react';
import { OnboardingData } from '../Onboarding.context';
import './UserAccounts.scss';



interface UserAccountsProps {}

const UserAccounts: FC<UserAccountsProps> = () =>  {
    const OnboardingContext = OnboardingData();

    const testContextData = () => {
        console.log(OnboardingContext.onboardingData);
    }
    
    return (
        <>
            <h1 className='section-title' >Connect Accounts </h1>
            <div className='form-container'>
                <p style={{"color":"black"}}>Plaid integration here</p>
                <button onClick={testContextData}>TEST CONTEXT DATA</button>
            </div>
        </>
    )
}

export default UserAccounts;
