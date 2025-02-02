import { FC } from 'react';
import './Settings.scss';
import { DataApiService } from '../../services/Classes/dataApiService';


interface SettingsProps {}

const Settings: FC<SettingsProps> = () =>  {
    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    }

    const migrateAccounts = async () => {
        await DataApiService.migrateAccounts();
        alert('Accounts Migrated');
    }

    const migrateCategories = async () => {
        await DataApiService.migrateCategories();
        alert('Categories Migrated');
    }

    const migrateTransactions = () => {
        DataApiService.migrateTransactions();
        alert('Transactions Migrated');
    }

    return (
        <>
            <div className="settings-page" >
                <button onClick={logout}>Logout</button>

                <div className='row'>
                    <h2>Migrate Accounts</h2>
                    <button onClick={migrateAccounts}>Migrate Accounts</button>
                </div>

                <div className='row'>
                    <h2>Migrate Categories</h2>
                    <button onClick={migrateCategories}>Migrate Categories</button>
                </div>

                <div className='row'>
                    <h2>Migrate Transactions</h2>
                    <button onClick={migrateTransactions}>Migrate Transactions</button>
                </div>
            </div>
        </>
    );
}

export default Settings;