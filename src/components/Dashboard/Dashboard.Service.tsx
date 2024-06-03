import { Account, DashboardFilterData, Transaction } from "../../services/Classes/classes";
import { scaleDate } from "../../services/Classes/formatService";

export const getDatesFromTransactions = (transactions: Transaction[], dateScale: string): number[] => {
    const dates = transactions.map((transaction) => {
        return scaleDate(transaction.timestamp, dateScale)
    });
    return Array.from(new Set(dates));
}

export const getFilteredTransactions = (transactions: Transaction[], filterData: DashboardFilterData): Transaction[] => {
    let filteredTransaction = transactions.filter((transaction) => {
        if (filterData.selectedAccounts.includes('All') && filterData.selectedCategories.includes('All')) {
            return true;
        } else if (filterData.selectedAccounts.includes('All') && filterData.selectedCategories.includes(transaction.category)) {
            return true;
        } else if (filterData.selectedAccounts.includes(transaction.account) && filterData.selectedCategories.includes('All')) {
            return true;
        } else if (filterData.selectedAccounts.includes(transaction.account) && filterData.selectedCategories.includes(transaction.category)) {
            return true;
        }
        return false;
    });
    return filteredTransaction;
}

export const getFilteredAccounts = (accounts: Account[], filteredTransactions: Transaction[], filterData: DashboardFilterData): Account[] => {
    return accounts.filter((account) => {
        if (filterData.selectedAccounts.includes('All')) {
            return filteredTransactions.some((transaction) => transaction.account === account.name);
        }
        return (filterData.selectedAccounts.includes(account.name)) && filteredTransactions.some((transaction) => transaction.account === account.name);
    });
}

export const processTransactionsIntoNetValue = async (transactions: Transaction[], account: Account) => {
    transactions = transactions.filter((transaction) => transaction.account === account.name);
    const refStartDate = new Date(account.refDate).getTime();
    const data: any[] = [];
    const beforeTrns = transactions.filter((transaction) => transaction.timestamp < refStartDate).sort((a, b) => b.timestamp - a.timestamp);
    const afterTrns = transactions.filter((transaction) => transaction.timestamp >= refStartDate).sort((a, b) => a.timestamp - b.timestamp);
    let netValue = account.refBalance;
    for (let i = 0; i < beforeTrns.length; i++) {
        netValue += beforeTrns[i].amount;
        data.push({ date: beforeTrns[i].timestamp, netValue });
    }
    netValue = account.refBalance;
    for (let j = 0; j < afterTrns.length; j++) {
        netValue -= afterTrns[j].amount;
        data.push({ date: afterTrns[j].timestamp, netValue });
    }
    console.log('data', data) 
    const filteredData: any[] = [];
    for (let i = 0; i < data.length; i++) {
        const dateIndex = filteredData.findIndex((d) => d.date === data[i].date);
        if (dateIndex === -1) {
        filteredData.push(data[i]);
    } else {
        filteredData[dateIndex] = data[i];
        }
    }
    console.log('filtered data', filteredData)
    for (let i = 0; i < filteredData.length; i++) {
        const originalValue = filteredData[i].netValue;
        filteredData[i].netValue = parseFloat(filteredData[i].netValue);
        if (isNaN(filteredData[i].netValue)) {
        console.log(`Invalid netValue at index ${i}: ${originalValue}`);
        }
    }
    return { account: account.name, amount: filteredData };
}



