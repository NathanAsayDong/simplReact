import dayjs from "dayjs";

export class Transaction {
    id: number;
    timestamp: number;
    amount: number;
    description: string;
    category: string;
    accountId: string;
    balance: number
    constructor(id: number = -1, timestamp: number, amount: number, description: string, accountId: string, category: string, balance: number) {
        this.id = id;
        this.timestamp = timestamp;
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.accountId = accountId;
        this.balance = balance;
    }
}

export class Budget {
    id: number;
    name: string;
    category: string;
    amount: number;
    constructor(id: number, name: string, category: string, amount: number) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.amount = amount;
    }
}

export const accountSources = [
    'Uccu', 'Chase', 'Discover', 'CapitalOne', 'Venmo', 'CashApp', 'Paypal', 'Cash', 'Other'
];

export class Account {
    id: string;
    name: string;
    type: string;
    source: string
    refDate: string | null;
    refBalance: number;
    accessToken: string = '';
    constructor(id: string, name: string, type: string, source: string, refDate: string = "NA", refBalance: number = 0, accessToken: string = '') {
        this.id = id //provided by plaid
        this.name = name; //user defined
        this.type = type;
        this.source = source; //instution name
        this.refDate = refDate;
        this.refBalance = refBalance;
        this.accessToken = accessToken;
    }

    getAccountSource(): string {
        return this.source;
    }
}

export class DashboardFilterData {
    selectedAccounts: string[];
    selectedCategories: string[];
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    areaChartDateScale: 'day' | 'week' | 'month' | 'year';
    accountOptions: string[];
    categoryOptions: string[];
    lineChartMode: 'netValue' | 'category' | 'account';
    pieChartMode: 'category' | 'account';

    constructor(selectedAccounts: string[], selectedCategories: string[], startDate: Date, endDate: Date, areaChartDateScale: 'day' | 'week' | 'month' | 'year', accountOptions: string[], categoryOptions: string[], lineChartMode: 'netValue' | 'category' | 'account', pieChartMode: 'category' | 'account') {
        this.selectedAccounts = selectedAccounts;
        this.selectedCategories = selectedCategories;
        this.startDate = startDate;
        this.endDate = endDate;
        this.areaChartDateScale = areaChartDateScale;
        this.accountOptions = accountOptions;
        this.categoryOptions = categoryOptions;
        this.lineChartMode = lineChartMode;
        this.pieChartMode = pieChartMode;
    }
}

export const defaultDashboardFilterData = new DashboardFilterData(['All'], ['All'], dayjs().subtract(7, 'day').toDate(), dayjs().toDate(), 'day', [], ['All'], 'netValue', 'category');

export class StripeSubscriptionObject {
    id: string;
    clientSecret: string;
    customerId: string;
    status: string;
    priceId: string;

    constructor(id: string, clientSecret: string, customerId: string, status: string, priceId: string) {
        this.id = id;
        this.clientSecret = clientSecret;
        this.customerId = customerId;
        this.status = status;
        this.priceId = priceId;
    }
}

export enum OnboardingStatus {
    INCOMPLETE = 'INCOMPLETE',
    COMPLETED = 'COMPLETED'
}
