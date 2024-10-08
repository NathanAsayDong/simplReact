import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createContext, useContext, useState } from 'react';
import { Account, Transaction } from './classes';
import { DataApiService } from './dataApiService';


type TransactionDataContextType = Transaction[] | null;
type UserAccountsDataContextType = Account[] | null;
type UserCategoriesDataContextType = string[] | null;

const TransactionsDataContext = createContext<any>(null);
const SetTransactionDataContext = createContext<any>(null);
const UserAccountsDataContext = createContext<any>(null);
const SetUserAccountDataContext = createContext<any>(null);
const UserCategoriesDataContext = createContext<any>(null);
const SetUserCategoryDataContext = createContext<any>(null);
const InitializeDataContext = createContext<any>(null);

export function TransactionData() {
    return useContext(TransactionsDataContext);
}

export function SetTransactionData() {
    return useContext(SetTransactionDataContext);
}

export function UserAccountsData() {
    return useContext(UserAccountsDataContext);
}

export function SetUserAccountData() {
    return useContext(SetUserAccountDataContext);
}

export function UserCategoriesData() {
    return useContext(UserCategoriesDataContext);
}

export function SetUserCategoryData() {
    return useContext(SetUserCategoryDataContext);
}

export function InitializeDataForContext() {
    return useContext(InitializeDataContext);
}

export function AppDataProvider({ children }: any){
    const [transactions, setTransactions] = useState<TransactionDataContextType>(null);
    const [userAccounts, setUserAccounts] = useState<UserAccountsDataContextType>(null);
    const [userCategories, setUserCategories] = useState<UserCategoriesDataContextType>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const updateTransactions = (data: TransactionDataContextType) => {
        setTransactions(data);
    }

    const updateAccounts = (data: UserAccountsDataContextType) => {
        setUserAccounts(data);
    }

    const updateCategories = (data: UserCategoriesDataContextType) => {
        setUserCategories(data);
    }

    const syncWithPlaid = async () => {
        const lastSync = localStorage.getItem('lastSync');
        if ((lastSync && (Date.now() - parseInt(lastSync) > 86400000)) || !lastSync) {
            await DataApiService.syncData();
            localStorage.setItem('lastSync', Date.now().toString());
        }
    }

    const initializeTransactions = async () => {
        if (!transactions) {
            DataApiService.getAllTransactions().then((transactions) => {
                if (transactions) {
                    setTransactions(transactions);
                }
            });
        }
    }

    const initializeAccounts = async () => {
        if (!userAccounts) {
            DataApiService.getAllAccounts().then((accounts) => {
                if (accounts) {
                    setUserAccounts(accounts);
                }
            });
        }
    }

    const initializeCategories = async () => {
        if (!userCategories) {
            DataApiService.getAllCategories().then((categories) => {
                if (categories) {
                    setUserCategories(categories);
                }
            });
        }
    }

    const initializeData = async () => {
        setLoading(true);
        await syncWithPlaid();
        await initializeTransactions();
        await initializeAccounts();
        await initializeCategories();
        setLoading(false);
    }


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TransactionsDataContext.Provider value={ transactions }>
                <SetTransactionDataContext.Provider value={ updateTransactions }>
                    <UserAccountsDataContext.Provider value={ userAccounts }>
                        <SetUserAccountDataContext.Provider value={ updateAccounts }>
                            <UserCategoriesDataContext.Provider value={ userCategories }>
                                <SetUserCategoryDataContext.Provider value={ updateCategories }>
                                    <InitializeDataContext.Provider value={{ initializeData, loading, setLoading }}>
                                            {children}
                                    </InitializeDataContext.Provider>
                                </SetUserCategoryDataContext.Provider>
                            </UserCategoriesDataContext.Provider>
                        </SetUserAccountDataContext.Provider>
                    </UserAccountsDataContext.Provider>
                </SetTransactionDataContext.Provider>
            </TransactionsDataContext.Provider>
        </LocalizationProvider>
    );
}