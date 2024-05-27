import { Account, Transaction } from "../../services/Classes/classes";
import { scaleDate } from "../../services/Classes/formatService";

export const getDatesFromTransactions = (transactions: Transaction[], dateScale: string): number[] => {
    const dates = transactions.map((transaction) => {
        return scaleDate(transaction.timestamp, dateScale)
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

export const getFilteredAccounts = (accounts: Account[], filteredTransactions: Transaction[], filterData: any): Account[] => {
    return accounts.filter((account) => {
        if (filterData.account === 'All') {
            return filteredTransactions.some((transaction) => transaction.account === account.name);
        }
        return (account.name === filterData.account) && filteredTransactions.some((transaction) => transaction.account === account.name);
    });
}

//broken
export const processTransactionsIntoNetValue = async (transactions: Transaction[], account: Account) => {
    transactions = transactions.filter((transaction) => transaction.account === account.name);
    const refStartDate = new Date(account.refDate).getTime();
    const refBalance = account.refBalance;
    const data: any[] = [];
    const beforeTrns = transactions.filter((transaction) => transaction.timestamp < refStartDate);
    const afterTrns = transactions.filter((transaction) => transaction.timestamp >= refStartDate);
    let netValue = refBalance;
    let i = 0;
    let j = 0;
    while (i < beforeTrns.length && j < afterTrns.length) {
        if (beforeTrns[i].timestamp < afterTrns[j].timestamp) {
        netValue += beforeTrns[i].amount;
        data.push({ date: beforeTrns[i].timestamp, netValue });
        i++;
    } else {
        netValue -= afterTrns[j].amount;
        data.push({ date: afterTrns[j].timestamp, netValue });
        j++;
        }
    }
    while (i < beforeTrns.length) {
        netValue += beforeTrns[i].amount;
        data.push({ date: beforeTrns[i].timestamp, netValue });
        i++;
    }
    while (j < afterTrns.length) {
        netValue -= afterTrns[j].amount;
        data.push({ date: afterTrns[j].timestamp, netValue });
        j++;
    }

    const filteredData: any[] = [];
    for (let i = 0; i < data.length; i++) {
        const dateIndex = filteredData.findIndex((d) => d.date === data[i].date);
        if (dateIndex === -1) {
        filteredData.push(data[i]);
    } else {
        filteredData[dateIndex] = data[i];
        }
    }
    for (let i = 0; i < filteredData.length; i++) {
        const originalValue = filteredData[i].netValue;
        filteredData[i].netValue = parseFloat(filteredData[i].netValue);
        if (isNaN(filteredData[i].netValue)) {
        console.log(`Invalid netValue at index ${i}: ${originalValue}`);
        }
    }
    return { account: account.name, amount: filteredData };
}



