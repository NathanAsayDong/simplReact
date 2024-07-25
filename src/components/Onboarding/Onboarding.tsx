import { FC } from 'react';
import './Onboarding.scss';


interface OnboardingProps { toggleCreateAccount: () => void; }

const Onboarding: FC<OnboardingProps> = ({ toggleCreateAccount }) =>  {

    const login = () => {
        toggleCreateAccount();
    }


    return (
        <>
            <div className="onboarding">
                <h1>Onboarding</h1>
            </div>

            <button onClick={login}>Already have an account?</button>
        </>
    );

};

export default Onboarding;