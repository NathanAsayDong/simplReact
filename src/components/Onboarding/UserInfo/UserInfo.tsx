import { FC, useState } from 'react';
import { OnboardingData } from '../Onboarding.context';
import './UserInfo.scss';



interface UserInfoProps {}

const UserInfo: FC<UserInfoProps> = () =>  {
    const OnboardingContext = OnboardingData();
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const updateFirstName = (e: any) => {
        OnboardingContext.setFirstName(e.target.value);
    }

    const updateLastName = (e: any) => {
        OnboardingContext.setLastName(e.target.value);
    }

    const updateEmail = (e: any) => {
        OnboardingContext.setEmail(e.target.value);
    }

    const updatePhone = (e: any) => {
        OnboardingContext.setPhone(e.target.value);
    }

    const updatePassword = (e: any) => {
        OnboardingContext.setPassword(e.target.value);
    }

    const updateConfirmPassword = (e: any) => {
        setConfirmPassword(e.target.value);
    }

    const passwordMatch = () => {
        return OnboardingContext.onboardingData?.password === confirmPassword || confirmPassword === '';
    }


    
    return (
        <>
            <h1 className='section-title roboto-bold' >USER INFO</h1>
            <div className='form-container hide-scroll'>
                <input type='text' placeholder='First Name' onChange={updateFirstName}/>
                <input type='text' placeholder='Last Name' onChange={updateLastName} />
                <input type='email' placeholder='Email' onChange={updateEmail}/>
                <input type='tel' placeholder='Phone' onChange={updatePhone} />
                <input type='password' placeholder='Password' onChange={updatePassword}/>
                {passwordMatch() ? null : <p className='alert-text'>**Passwords do not match</p>}
                <input type='password' placeholder='Confirm Password' required={true} onChange={updateConfirmPassword}/>
            </div>
        </>
    )
}

export default UserInfo;