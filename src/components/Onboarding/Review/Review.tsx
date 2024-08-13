import { ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from 'react';
import { Account } from '../../../services/Classes/classes';
import { DataApiService } from '../../../services/Classes/dataApiService.tsx';
import { attemptCreateAccount } from '../../../services/Classes/userApiService';
import { OnboardingData, OnboardingDataObject } from '../Onboarding.context';
import './Review.scss';



interface OnboardingReviewProps { handleLogin: () => void; }

const OnboardingReview: ForwardRefRenderFunction<any, OnboardingReviewProps> = (props, ref) => {
    const onboardingData: OnboardingDataObject = OnboardingData().onboardingData;
    const { handleLogin } = props;
    const [loading, setLoading] = useState<boolean>(false);

    const test = () => {
        console.log('Review')
        handleLogin();
    }

    const getPasswordString = () => {
        if (onboardingData?.password) {
            const length = onboardingData.password.length;
            return length + ' Characters'
        } else {
            return "No Password"
        }
    }

    useImperativeHandle(ref, () => ({
        save
    }))

    const fieldsAreValid = () => {
        if (!onboardingData?.firstName || !onboardingData?.lastName || !onboardingData?.email || !onboardingData?.phone || !onboardingData?.password) {
            return false;
        }
        else if (!onboardingData?.accounts || onboardingData?.accounts?.length == 0) {
            return false;
        }
        else if (!onboardingData?.categories || onboardingData?.categories?.length == 0) {
            return false;
        }
        return true;
    }

    const save = async () => {
        setLoading(true);
        if (!fieldsAreValid()) {
            setLoading(false);
            alert('Please fill out all fields');
            return;
        }
        try {
            const userCreated = await attemptCreateAccount(onboardingData.email, onboardingData.password);
            if (!!userCreated && !!onboardingData.accounts && !!onboardingData.categories) {
                localStorage.setItem('id', userCreated.authToken);
                for (let account of onboardingData.accounts) {
                    const accountCreated = await DataApiService.addAccount(account);
                    if (!accountCreated) {
                        throw new Error('Account Creation Failed');
                    }
                }
                for (let category of onboardingData.categories) {
                    const categoryAdded = await DataApiService.addCategory(category);
                    if (!categoryAdded) {
                        throw new Error('Category Creation Failed');
                    }
                }
                console.log('User Created');
                setLoading(false);
                handleLogin();
            } else {
                throw new Error('Account Creation Failed');
            }
        }
        catch (e) {
            console.error(e);
        }

    }
    
    return (
        <>
            <h1 className='section-title' onClick={test} >Review</h1>
            <div className='form-container hide-scroll' style={{width:900, height: 368, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <div className='column hide-scroll' style={{width: '33%', justifyContent: 'space-evenly'}}>
                    <div className='review-row hide-scroll'>
                        <p className='label archivo-font-bold'>First Name:</p>
                        <p className='value'>{onboardingData?.firstName}</p>
                    </div>
                    <div className='review-row hide-scroll'>
                        <p className='label archivo-font-bold'>Last Name:</p>
                        <p className='value'>{onboardingData?.lastName}</p>
                    </div>
                    <div className='review-row hide-scroll'>
                        <p className='label archivo-font-bold'>Email:</p>
                        <p className='value'>{onboardingData?.email}</p>
                    </div>
                    <div className='review-row hide-scroll'>
                        <p className='label archivo-font-bold'>Phone:</p>
                        <p className='value'>{onboardingData?.phone}</p>
                    </div>
                    <div className='review-row hide-scroll'>
                        <p className='label archivo-font-bold'>Password:</p>
                        <p className='value'>{getPasswordString()}</p>
                    </div>
                </div>
                <div className='divider-vertical'></div>
                <div className='column hide-scroll' style={{width: '33%', justifyContent: 'flex-start',  gap: 11, overflowY: 'scroll'}}>
                    <h2 className='section-header'>Accounts</h2>
                    {!!onboardingData?.accounts &&  onboardingData?.accounts?.map((account: Account, index: any) => {
                        return (
                            <div key={index} className='review-row'>
                                <p className='label'>Account Name:</p>
                                <p>{account.name}</p>
                            </div>
                        )
                    })}
                    {!!onboardingData?.accounts && onboardingData?.accounts?.length == 0 && <p style={{color: 'red'}}>No accounts added</p>}
                </div>
                <div className='divider-vertical'></div>
                <div className='column hide-scroll' style={{width: '33%', justifyContent: 'flex-start', gap: 11, overflowY: 'scroll'}}>
                    <h2 className='section-header'>Categories</h2>
                    {!!onboardingData?.categories &&  onboardingData?.categories?.map((category: String, index: any) => {
                            return (
                                <div key={index} className='review-row' style={{justifyContent: 'center'}}>
                                    <p className='archivo-font-bold'>{category}</p>
                                </div>
                            )
                        })}
                    {(!onboardingData?.categories || onboardingData?.categories?.length == 0) && <p style={{color: 'red'}}>No categories added</p>}
                </div>
            </div>
        </>
    )
}

export default forwardRef(OnboardingReview);

