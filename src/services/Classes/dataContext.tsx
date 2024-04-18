import { createContext, useContext, useState, } from 'react';
import { Account, Transaction } from './classes';

type TransactionDataContextType = Transaction[] | null;
type UserAccountsDataContextType = Account[] | null;

const TransactionsDataContext = createContext<any>(null);
const SetTransactionDataContext = createContext<any>(null);
const UserAccountsDataContext = createContext<any>(null);
const SetUserAccountDataContext = createContext<any>(null);

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

export function AppDataProvider({ children }: any){
    const [transactions, setTransactions] = useState<TransactionDataContextType>(null);
    const [userAccounts, setUserAccounts] = useState<UserAccountsDataContextType>(null);

    const updateTransactions = (data: TransactionDataContextType) => {
        setTransactions(data);
    }

    const updateAccounts = (data: UserAccountsDataContextType) => {
        setUserAccounts(data);
    }


    return (
        <TransactionsDataContext.Provider value={ transactions }>
            <SetTransactionDataContext.Provider value={ updateTransactions }>
                <UserAccountsDataContext.Provider value={ userAccounts }>
                    <SetUserAccountDataContext.Provider value={ updateAccounts }>
                        {children}
                    </SetUserAccountDataContext.Provider>
                </UserAccountsDataContext.Provider>
            </SetTransactionDataContext.Provider>
        </TransactionsDataContext.Provider>
    );
}