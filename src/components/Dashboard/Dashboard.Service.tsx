import { Account, DashboardFilterData, Transaction } from "../../services/Classes/classes";
import { scaleDate } from "../../services/Classes/formatService";

// --------------------- BASIC HELPERS ---------------------

export const getDatesFromTransactions = (transactions: Transaction[], dateScale: string): number[] => {
    const dates = transactions.map((transaction) => {
        return scaleDate(transaction.timestamp, dateScale)
    });
    return Array.from(new Set(dates));
}

export const getFilteredTransactions = (transactions: Transaction[], filterData: DashboardFilterData): Transaction[] => {
    const startDateNum = filterData.startDate?.getTime() || null;
    const endDateNum = filterData.endDate?.getTime() || null;
    let filteredTransaction = transactions.filter((transaction) => {
        if ((!startDateNum || transaction.timestamp >= startDateNum) && (!endDateNum || transaction.timestamp <= endDateNum)) {
            if (filterData.selectedAccounts.includes('All') && filterData.selectedCategories.includes('All')) {
                return true;
            } else if (filterData.selectedAccounts.includes('All') && filterData.selectedCategories.includes(transaction.category)) {
                return true;
            } else if (filterData.selectedAccounts.includes(transaction.accountId) && filterData.selectedCategories.includes('All')) {
                return true;
            } else if (filterData.selectedAccounts.includes(transaction.accountId) && filterData.selectedCategories.includes(transaction.category)) {
                return true;
            }
        }
        return false;
    });
    return filteredTransaction;
}

export const filterTransactionsByDate = (transactions: Transaction[], filterData: DashboardFilterData): Transaction[] => {
    const startDateNum = filterData.startDate?.getTime() || null;
    const endDateNum = filterData.endDate?.getTime() || null;
    return transactions.filter((transaction) => {
        return (!startDateNum || transaction.timestamp >= startDateNum) && (!endDateNum || transaction.timestamp <= endDateNum);
    });
}

export const filterTransactionsByCategory = (transactions: Transaction[], filterData: DashboardFilterData): Transaction[] => {
    return transactions.filter((transaction) => {
        return filterData.selectedCategories.includes(transaction.category) || filterData.selectedCategories.includes('All');
    });
}

export const filterTransactionsByAccount = (transactions: Transaction[], filterData: DashboardFilterData): Transaction[] => {
    return transactions.filter((transaction) => {
        return filterData.selectedAccounts.includes(transaction.accountId) || filterData.selectedAccounts.includes('All');
    });
}

export const getFilteredAccounts = (accounts: Account[], filteredTransactions: Transaction[], filterData: DashboardFilterData): Account[] => {
    return accounts.filter((account) => {
        if (filterData.selectedAccounts.includes('All')) {
            return filteredTransactions.some((transaction) => transaction.accountId === account.id);
        }
        return (filterData.selectedAccounts.includes(account.name)) && filteredTransactions.some((transaction) => transaction.accountId === account.id);
    });
}

export const getFilteredCategories = (transactions: Transaction[], filterData: DashboardFilterData): string[] => {
    const categories = transactions.map((transaction) => transaction.category);
    return Array.from(new Set(categories)).filter((category) => filterData.selectedCategories.includes(category) || filterData.selectedCategories.includes('All'));
}

export const getNetValueFromAccounts = (accounts: Account[]): number => {
    return accounts.reduce((acc, account) => {
        if (account.type == "checking" || account.type == "savings") {
            return acc + account.refBalance;
        }
        if (account.type == "credit") {
            return acc - account.refBalance;
        }
        else {
            return acc;
        }
    }, 0);
}

// --------------------- PROCESSING ---------------------











// --------------------- LINE CHART ---------------------

export const processTransactionsIntoNetValue = async (transactions: Transaction[], account: Account) => {
    transactions = transactions.filter((transaction) => transaction.accountId === account.id);
    const refStartDate = account.refDate ? new Date(account.refDate).getTime() : new Date().getTime();
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
        filteredData[i].netValue = parseFloat(filteredData[i].netValue);
        if (isNaN(filteredData[i].netValue)) {
        }
    }
    return { account: account.name, amount: filteredData };
}

export const getGraphDataAccount = async (transactions: Transaction[], accounts: Account[], dateScale: string): Promise<any[]> => {
    const dates = getDatesFromTransactions(transactions, dateScale); //get dates
    const data: any[] = [];
    for (let i = 0; i < accounts.length; i++) { //for all the accounts get an attribute thats an array of their net values
        const accountData = await processTransactionsIntoNetValue(transactions, accounts[i]);
        data.push(accountData);
    }
    const graphData: any[] = [];
    for (const date of dates) { //for everyday, for each account check if it has a value, if it doenst add 0's
        let obj: any = { date };
        for (const account of data) {
            const accountValue = account.amount.find((entry: any) => scaleDate(entry.date, dateScale) === date);
            if (date == dates[0]) {
                obj[account.account] = accountValue ? accountValue?.netValue : account.amount[0]?.netValue;
            }
            else if (date == dates[dates.length - 1]) {
                obj[account.account] = accountValue ? accountValue?.netValue : account.amount[account.amount.length - 1]?.netValue;
            }
            else {
                if (!accountValue) {
                let i = graphData.length - 1;
                while (i >= 0) {
                    if (graphData[i][account.account]) {
                    obj[account.account] = graphData[i][account.account];
                    break;
                    }
                    i--;
                }
                } else {
                obj[account.account] = accountValue?.netValue;
                }
            }
        }
        graphData.push(obj);
    }
    for (let i = 0; i < graphData.length; i++) { //for each day, sum all the accounts
        let sum = 0;
        for (const account of accounts) {
            if (graphData[i][account.name]) {
                sum += graphData[i][account.name];
            }
        }
        graphData[i].sum = sum;
    }
    console.log(graphData);
    return graphData;
}







