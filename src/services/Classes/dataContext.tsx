import { createContext, useContext, useState, } from 'react';
import { Transaction } from './classes';

type TransactionDataContextType = Transaction[] | null;

const TransactionsDataContext = createContext<any>(null);
const SetTransactionDataContext = createContext<any>(null);

export function TransactionData() {
    return useContext(TransactionsDataContext);
}

export function SetTransactionData() {
    return useContext(SetTransactionDataContext);
}

export function TransactionsDataProvider({ children }: any){
    const [transactions, setTransactions] = useState<TransactionDataContextType>(null);


    return (
        <TransactionsDataContext.Provider value={ transactions }>
            <SetTransactionDataContext.Provider value={ setTransactions }>
                {children}
            </SetTransactionDataContext.Provider>
        </TransactionsDataContext.Provider>
    );
}