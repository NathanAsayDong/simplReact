import { Account, DashboardFilterData, Transaction } from "../../services/Classes/classes";
import { scaleDate } from "../../services/Classes/formatService";

// --------------------- BASIC HELPERS ---------------------

export const getDatesFromTransactions = (transactions: Transaction[], dateScale: string): number[] => {
    const dates = transactions.map((transaction) => {
        return scaleDate(transaction.timestamp, dateScale)
    });
    return Array.from(new Set(dates));
}

export const getDates = (startDate: Date | null | undefined, dateScale: string): number[] => {
    const dates: number[] = [];
    if (!startDate) {
        return dates;
    }

    let current = new Date(startDate.getTime());
    let currentDate = new Date();

    current.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    while (current <= currentDate) {
        dates.push(current.getTime());
        switch (dateScale) {
            case 'day':
                current.setDate(current.getDate() + 1);
                break;
            case 'week':
                current.setDate(current.getDate() + 7);
                break;
            case 'month':
                current.setMonth(current.getMonth() + 1);
                break;
            case 'year':
                current.setFullYear(current.getFullYear() + 1);
                break;
            default:
                break;
        }
    }
    return dates;
};


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

export const getFilteredAccounts = (accounts: Account[], filterData: DashboardFilterData): Account[] => {
    return accounts.filter((account) => {
        if (filterData.selectedAccounts.includes('All')) {
            return true;
        }
        return (filterData.selectedAccounts.includes(account.name));
    });
}

export const getFilteredCategories = (transactions: Transaction[], filterData: DashboardFilterData): string[] => {
    const categories = transactions.map((transaction) => transaction.category);
    return Array.from(new Set(categories)).filter((category) => filterData.selectedCategories.includes(category) || filterData.selectedCategories.includes('All'));
}

export const getNetValueFromAccounts = (accounts: Account[]): number => {
    return accounts.reduce((acc, account) => {
        if (account.type == "checking" || account.type == "savings" || account.type == "brokerage") {
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

// --------------------- LINE CHART ---------------------

export const getRunningBalanceForAccount = async (transactions: Transaction[], account: Account) => {
    transactions = transactions.filter((transaction) => transaction.accountId === account.id).sort((a, b) => b.timestamp - a.timestamp); //most recent to least recent
    const data: any[] = [];
    let accountBalance = account.refBalance;
    for (let i = 0; i < transactions.length; i++) {
        accountBalance -= transactions[i].amount;
        data.push({ date: transactions[i].timestamp, accountBalance });
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
    return { account: account.name, running_log: filteredData }; //filteredData is type { date: number, accountBalance: number }[]
}

export const getMapOfDatesToAccountBalances = async (transactions: Transaction[], accounts: Account[], dateScale: string, filterData: DashboardFilterData): Promise<{ [date : number] : { [account: string] : number}}> => {
    //1) Get all the dates, scaled and in range
    const dates = getDates(filterData.startDate, dateScale); //Gets a scaled date array from now to the end date
    console.log(dates);
    //2) For each account, process a changing accoung balance as time goes on in an array
    const account_running_logs: { [key: string]: any[] } = {};
    for (const account of accounts) {
        const accountData = await getRunningBalanceForAccount(transactions, account);
        account_running_logs[account.name] = accountData.running_log;
    }
    //3) For each account, create a map of date to running account balance
    let account_to_day_value_map :{ [accountName: string]: { [date: number]: number } } = {};
    for (const accountName of Object.keys(account_running_logs)) {
        const account = accounts.find((account) => account.name === accountName);
        if (!account) {
            continue;
        }
        let date_to_netValue: { [date: number]: number } = {};
        let running_balance = account?.refBalance;
        for (const date of dates) {
            const accountValue = account_running_logs[accountName].find((entry: any) => entry.date === date);
            if (accountValue) {
                running_balance = accountValue.accountBalance;
            }
            date_to_netValue[date] = running_balance;
        }
        account_to_day_value_map[accountName] = date_to_netValue;
    }
    //4) For each date, calculate the total net value
    account_to_day_value_map['total'] = {};
    for (const date of dates) {
        let net = computeNetForDate(account_to_day_value_map, accounts, filterData, date);
        account_to_day_value_map['total'][date] = net;
    }
    //5) convert the map from account to day to day to account
    let return_map : { [date: number] : { [account: string] : number} } = {};
    for (const date of dates) {
        let account_to_value_map : { [account: string] : number } = {};
        for (const accountName of Object.keys(account_to_day_value_map)) {
            account_to_value_map[accountName] = account_to_day_value_map[accountName][date];
        }
        return_map[date] = account_to_value_map;
    }
    return return_map;
}

export const computeNetForDate = (account_to_running_balance_map : { [account: string] : { [date : number]: number }}, accounts: Account[], filterData : DashboardFilterData, date: number): any => {
    let total = 0;
    for (const account of accounts) {
        if (filterData.selectedAccounts.includes(account.name) || filterData.selectedAccounts.includes('All')) {
            if (account.name in account_to_running_balance_map && date in account_to_running_balance_map[account.name]) {
                if (account.type === 'checking' || account.type === 'savings') {
                    total += account_to_running_balance_map[account.name][date];
                }
                if (account.type === 'credit') {
                    total -= account_to_running_balance_map[account.name][date];
                }
            }
        }
    }
    return total;
}

export const convertMapToRunningBalanceArray = (account_to_running_balance_map : { [ date : number ] : { [ account : string] : number }} ): any[] => {
    let return_array : any[] = [];
    for (const date of Object.keys(account_to_running_balance_map)) {
        return_array.push({ date: Number(date), running_balance: account_to_running_balance_map[Number(date)]['total'] });
    }
    return return_array;
}

export const account_balance_for_dates = (dates: number[], account: Account, transactions: Transaction[]): { [date : number] : number} => {
    transactions = transactions.sort((a, b) => a.timestamp - b.timestamp);
    let account_balance = account.refBalance;
    let res: { [date : number] : number} = [];
    
    for (let i = dates.length - 1; i >= 0; i--) {
        const date = dates[i];
        let transactions_for_date = transactions.filter((transaction) => transaction.timestamp === date && transaction.accountId === account.id);
        for (const transaction of transactions_for_date) {
            if (account.type == "checking" || account.type == "savings") {
                account_balance += transaction.amount;
            }
            else {
                account_balance -= transaction.amount;
            }
        }
        account_balance = Math.round(account_balance * 100) / 100;
        res[date] = account_balance;
    }
    return res;
}







