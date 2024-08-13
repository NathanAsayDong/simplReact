import { ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react';
import { Account } from '../../../services/Classes/classes';
import { OnboardingData, OnboardingDataObject } from '../Onboarding.context';
import './Review.scss';



interface OnboardingReviewProps {}

const OnboardingReview: ForwardRefRenderFunction<any, OnboardingReviewProps> = (props, ref) => {
    const onboardingData: OnboardingDataObject = OnboardingData().onboardingData;

    const test = () => {
        console.log('Review')
        console.log(onboardingData)
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
        test
    }))
    
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
