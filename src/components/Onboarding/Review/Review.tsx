import { ForwardRefRenderFunction, Key, forwardRef, useImperativeHandle, useState } from 'react';
import { DataApiService } from '../../../services/Classes/dataApiService.tsx';
import { updateUserOnboardStatus } from '../../../services/Classes/userApiService';
import { OnboardingData, OnboardingDataObject } from '../Onboarding.context';
import './Review.scss';
import GeneratingAccount from '../GeneratingAccount/GeneratingAccount.tsx';
import { OnboardingStatus } from '../../../services/Classes/classes.tsx';



interface OnboardingReviewProps { handleLogin: () => void; setLoading: (loading: boolean) => void; }

const OnboardingReview: ForwardRefRenderFunction<any, OnboardingReviewProps> = (props, ref) => {
    const onboardingData: OnboardingDataObject = OnboardingData().onboardingData;
    const [settingUpAccount, setSettingUpAccount] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const handleLogin = props.handleLogin;
    const setLoading = props.setLoading;

    useImperativeHandle(ref, () => ({
        save
    }))

    const fieldsAreValid = () => {
        if (!onboardingData?.categories || onboardingData?.categories?.length == 0) {
            return false;
        }
        if (!onboardingData?.accounts || onboardingData?.accounts?.length == 0) {
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
        setSettingUpAccount(true);
        setProgress(10);
        try {
            if (!onboardingData) {
                throw new Error('User Data Missing');
            }
            for (let category of (onboardingData?.categories ?? [])) {
                const categoryAdded = await DataApiService.addCategory(category);
                if (!categoryAdded) {
                    throw new Error('Category Creation Failed');
                }
            }
            setProgress(50);
            await updateUserOnboardStatus(localStorage.getItem('firebaseAuthId') as string,  true);
            setProgress(75);
            await DataApiService.syncData();
            setProgress(100);
            setLoading(false);
            setSettingUpAccount(false);
            setProgress(0);
            handleLogin();
        }
        catch (e) {
            console.error(e);
            setLoading(false);
            setSettingUpAccount(false);
            setProgress(0);
        }
    }

    const updateOnboardingStatusComplete = async () => {
        await updateUserOnboardStatus(localStorage.getItem('firebaseAuthId') as string, true);
    }
    
    return (
        <>
            {!settingUpAccount && (
                <>
                    <h1 className='section-title' onClick={updateOnboardingStatusComplete} >Review</h1>
                    <p className='section-subtitle'>Take one last look before we create your account!</p>
                    <div className='review-container'>
                        <div className='form-container hide-scroll' style={{height: 450}}>
                            <h2>Spending Categories</h2>
                            <div className='categories hide-scrollbar'>
                                {onboardingData?.categories?.map((category: string, idx: Key | null | undefined) => (
                                    <div className='category' key={idx} >
                                        <p style={{margin: 0}}>{category}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='form-container hide-scroll' style={{height: 450}}>
                            <h2>Financial Accounts</h2>
                            {onboardingData?.accounts?.map((account: any, idx: any) => (
                                <div className='account-row-card' key={idx}>
                                    <input type="text" value={account.accountName} className='account-name'/>
                                    <div className='row' style={{height: 38}}>
                                        <p>Institution</p>
                                        <p className='highlight'>{account.accountSource}</p>
                                    </div>
                                    <div className='row' style={{height: 38}}>
                                        <p>Type</p>
                                        <p className='highlight'>{account.accountType}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}


            {settingUpAccount && (
                <>
                    <GeneratingAccount progress={progress} />
                </>
            )}
        </>
    )
}

export default forwardRef(OnboardingReview);

