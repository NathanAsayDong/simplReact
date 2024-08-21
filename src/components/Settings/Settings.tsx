import { FC } from 'react';
import './Settings.scss';


interface SettingsProps {}

const Settings: FC<SettingsProps> = () =>  {

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    }

    return (
        <>
            <div style={{height: '81vh'}}>
                <button onClick={logout}>Logout</button>
            </div>
        </>
    );
}

export default Settings;