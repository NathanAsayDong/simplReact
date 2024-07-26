import { createContext, useContext, useState } from 'react';


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

    const setFirstName = (firstName: string) => {
        setOnboardingData({...onboardingData, firstName: firstName});
    }

    const setLastName = (lastName: string) => {
        setOnboardingData({...onboardingData, lastName: lastName});
    }

    const setEmail = (email: string) => {
        setOnboardingData({...onboardingData, email: email});
    }

    const setPhone = (phone: string) => {
        setOnboardingData({...onboardingData, phone: phone});
    }

    const setPassword = (password: string) => {
        setOnboardingData({...onboardingData, password: password});
    }


    return (
        <OnboardingDataContext.Provider value={onboardingData}>
            <OnboardingDataContext.Provider value={[updateOnboardingData, setFirstName, setLastName, setEmail, setPhone, setPassword]}>
                {children}
            </OnboardingDataContext.Provider>
        </OnboardingDataContext.Provider>
    )
}


export class OnboardingDataObject {
    firstName?: string = '';
    lastName?: string = '';
    email?: string = '';
    phone?: string = '';
    password?: string = '';
}