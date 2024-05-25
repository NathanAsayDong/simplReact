import { Account, Transaction } from "../../services/Classes/classes";

export const getDatesFromTransactions = (transactions: Transaction[]): number[] => {
    const dates = transactions.map((transaction) => {
        return transaction.timestamp;
    });
    return Array.from(new Set(dates));
}

export const getFilteredTransactions = (transactions: Transaction[], filterData: any): Transaction[] => {
    let filteredTransaction = transactions.filter((transaction) => {
        if (filterData.account === 'All' && filterData.category === 'All') {
            return true;
        } else if (filterData.account === 'All' && transaction.category === filterData.category) {
            return true;
        } else if (filterData.category === 'All' && transaction.account === filterData.account) {
            return true;
        } else if (transaction.account === filterData.account && transaction.category === filterData.category) {
            return true;
        }
        return false;
    });
    return filteredTransaction;
}

export const getFilteredAccounts = (accounts: Account[], filterData: any): Account[] => {
    return accounts.filter((account) => {
        if (filterData.account === 'All') {
            return true;
        }
        return account.name === filterData.account;
    });
}