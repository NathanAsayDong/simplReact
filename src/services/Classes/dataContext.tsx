import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createContext, useContext, useState } from 'react';
import { Account, Budget, Category, Transaction } from './classes';
import { DataApiService } from './dataApiService';


type TransactionDataContextType = Transaction[] | null;
type UserAccountsDataContextType = Account[] | null;
type UserCategoriesDataContextType = Category[] | null;
type UserBudgetsDataContext = Budget[] | null;

const CACHE_KEYS = {
    TRANSACTIONS: 'cached_transactions',
    ACCOUNTS: 'cached_accounts',
    CATEGORIES: 'cached_categories',
    BUDGETS: 'cached_budgets'
};

const TransactionsDataContext = createContext<any>(null);
const SetTransactionDataContext = createContext<any>(null);
const UserAccountsDataContext = createContext<any>(null);
const SetUserAccountDataContext = createContext<any>(null);
const UserCategoriesDataContext = createContext<any>(null);
const SetUserCategoryDataContext = createContext<any>(null);
const UserBudgetsDataContext = createContext<any>(null);
const SetUserBudgetDataContext = createContext<any>(null);
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

export function UserBudgetsData() {
    return useContext(UserBudgetsDataContext);
}

export function SetUserBudgetData() {
    return useContext(SetUserBudgetDataContext);
}

export function InitializeDataForContext() {
    return useContext(InitializeDataContext);
}

export function AppDataProvider({ children }: any){
    const [transactions, setTransactions] = useState<TransactionDataContextType>(null);
    const [userAccounts, setUserAccounts] = useState<UserAccountsDataContextType>(null);
    const [userCategories, setUserCategories] = useState<UserCategoriesDataContextType>(null);
    const [userBudgets, setUserBudgets] = useState<UserBudgetsDataContext>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadCachedData = () => {
        try {
            const cachedTransactions = localStorage.getItem(CACHE_KEYS.TRANSACTIONS);
            const cachedAccounts = localStorage.getItem(CACHE_KEYS.ACCOUNTS);
            const cachedCategories = localStorage.getItem(CACHE_KEYS.CATEGORIES);
            const cachedBudgets = localStorage.getItem(CACHE_KEYS.BUDGETS);

            if (cachedTransactions) setTransactions(JSON.parse(cachedTransactions));
            if (cachedAccounts) setUserAccounts(JSON.parse(cachedAccounts));
            if (cachedCategories) setUserCategories(JSON.parse(cachedCategories));
            if (cachedBudgets) setUserBudgets(JSON.parse(cachedBudgets));
        } catch (error) {
            console.error('Error loading cached data:', error);
        }
    }

    const updateTransactions = (data: TransactionDataContextType) => {
        setTransactions(data);
        if (data) localStorage.setItem(CACHE_KEYS.TRANSACTIONS, JSON.stringify(data));
    }

    const updateAccounts = (data: UserAccountsDataContextType) => {
        setUserAccounts(data);
        if (data) localStorage.setItem(CACHE_KEYS.ACCOUNTS, JSON.stringify(data));
    }

    const updateCategories = (data: UserCategoriesDataContextType) => {
        setUserCategories(data);
        if (data) localStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(data));
    }

    const updateBudgets = (data: UserBudgetsDataContext) => {
        setUserBudgets(data);
        if (data) localStorage.setItem(CACHE_KEYS.BUDGETS, JSON.stringify(data));
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
            const response = await DataApiService.getAllTransactions();
            if (response) {
                updateTransactions(response);
            }
        };
    }

    const initializeAccounts = async () => {
        if (!userAccounts) {
            const response = await DataApiService.getAllAccounts();
            if (response) {
                updateAccounts(response);
            }
        }
    }

    const initializeCategories = async () => {
        if (!userCategories) {
            const response = await DataApiService.getAllCategories();
            if (response) {
                updateCategories(response);
            }
        }
    }

    const initializeBudgets = async () => {
        if (!userBudgets) {
            const response = await DataApiService.getAllBudgets();
            if (response) {
                updateBudgets(response);
            }
        }
    }

    const refreshCategories = async () => {
        const response = await DataApiService.getAllCategories();
        if (response) {
            updateCategories(response);
        }
    }

    const initializeData = async () => {
        const firebaseAuthId = localStorage.getItem('firebaseAuthId');
        if (!firebaseAuthId) return;
        setLoading(true);
        loadCachedData();
        await syncWithPlaid();
        await initializeTransactions();
        await initializeAccounts();
        await initializeCategories();
        await initializeBudgets();
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
                                    <InitializeDataContext.Provider value={{ initializeData, loading, setLoading, refreshCategories }}>
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