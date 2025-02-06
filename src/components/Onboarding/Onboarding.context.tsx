import { createContext, useContext, useState } from 'react';
import { Account } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';


type OnboardingDataContextType = OnboardingDataObject | null;
const OnboardingDataContext = createContext<any>(null);

export function OnboardingData() {
    return useContext(OnboardingDataContext);
}

export function OnboardingDataProvider({ children }: any) {
    const [onboardingData, setOnboardingData] = useState<OnboardingDataContextType>(null);

    const updateOnboardingData = (data: OnboardingDataContextType) => {
        setOnboardingData(data);
    }

    const setCategories = (categories: string[]) => {
        setOnboardingData({...onboardingData, categories: categories});
    }

    const setAccounts = (accounts: Account[]) => {
        setOnboardingData({...onboardingData, accounts: accounts});
    }

    const fetchAccounts = async () => {
        if (!!localStorage.getItem('firebaseAuthId')) {
            DataApiService.getAllAccounts().then((accounts: Account[]) => {
                setAccounts(accounts);
            });
        }
    }


    return (
        <OnboardingDataContext.Provider value={{onboardingData, updateOnboardingData, setCategories, setAccounts, fetchAccounts}}>
            {children}
        </OnboardingDataContext.Provider>
    )
}


export class OnboardingDataObject {
    categories?: string[] = [];
    accounts?: Account[] = [];
}