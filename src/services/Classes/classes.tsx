import dayjs from "dayjs";

export class Transaction {
    transactionId: number;
    plaidTransactionId: number;
    timestamp: number;
    amount: number;
    description: string;
    categoryId: number;
    accountId: number;
    userId: number;
    constructor(transactionId: number = -1, plaidTransactionId: number = -1, timestamp: number, amount: number, description: string, accountId: number, categoryId: number, userId: number) {
        this.transactionId = transactionId;
        this.plaidTransactionId = plaidTransactionId;
        this.timestamp = timestamp;
        this.amount = amount;
        this.description = description;
        this.categoryId = categoryId;
        this.accountId = accountId;
        this.userId = userId;
    }
}

export const accountSources = [
    'Uccu', 'Chase', 'Discover', 'CapitalOne', 'Venmo', 'CashApp', 'Paypal', 'Cash', 'Other'
];

export class Account {
    accountId: number;
    plaidAccountId: string;
    accountName: string;
    accountType: string;
    accountSource: string
    refDate: string | null;
    refBalance: number;
    accessToken: string = '';
    userId: number | null;
    constructor(accountId: number, plaidAccountId: string, accountName: string, accountType: string, accountSource: string, refDate: string = "NA", refBalance: number = 0, accessToken: string = '', userId: number | null = null) {
        this.accountId = accountId;
        this.plaidAccountId = plaidAccountId //provided by plaid
        this.accountName = accountName; //user defined
        this.accountType = accountType;
        this.accountSource = accountSource; //instution name
        this.refDate = refDate;
        this.refBalance = refBalance;
        this.accessToken = accessToken;
        this.userId = userId
    }

    getAccountSource(): string {
        return this.accountSource;
    }
}

export class Category {
    categoryId: number;
    categoryName: string;
    parentCategoryId: number;
    userId: string;
    constructor(categoryId: number, categoryName: string, parentCategoryId: number, userId: string) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.parentCategoryId = parentCategoryId;
        this.userId = userId;
    }
}

export class Budget {
    budgetId: number | null;
    budgetName: string | null;
    userId: number | null;
    categoryIds: number[] | null;
    amount: number | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
    
    constructor(
        budgetId?: number, 
        budgetName?: string,
        userId?: number, 
        categoryIds?: number[], 
        amount?: number, 
        startDate?: string, 
        endDate?: string, 
        description?: string
    ) {
        this.budgetId = budgetId ?? null;
        this.budgetName = budgetName ?? null;
        this.userId = userId ?? null;
        this.categoryIds = categoryIds ?? null;
        this.amount = amount ?? null;
        this.startDate = startDate ?? null;
        this.endDate = endDate ?? null;
        this.description = description ?? null;
    }
}

export class DashboardFilterData {
    selectedAccountIds: number[];
    selectedCategoryIds: number[];
    startDate: Date | null | undefined;
    endDate: Date | null | undefined;
    areaChartDateScale: 'day' | 'week' | 'month' | 'year';
    accountOptions: Account[];
    categoryOptions: Category[];
    lineChartMode: 'netValue' | 'category' | 'account';
    pieChartMode: 'category' | 'account';

    constructor(selectedAccountIds: number[], selectedCategoryIds: number[], startDate: Date, endDate: Date, areaChartDateScale: 'day' | 'week' | 'month' | 'year', accountOptions: Account[], categoryOptions: Category[], lineChartMode: 'netValue' | 'category' | 'account', pieChartMode: 'category' | 'account') {
        this.selectedAccountIds = selectedAccountIds;
        this.selectedCategoryIds = selectedCategoryIds;
        this.startDate = startDate;
        this.endDate = endDate;
        this.areaChartDateScale = areaChartDateScale;
        this.accountOptions = accountOptions;
        this.categoryOptions = categoryOptions;
        this.lineChartMode = lineChartMode;
        this.pieChartMode = pieChartMode;
    }
}

export const defaultDashboardFilterData = new DashboardFilterData([], [], dayjs().subtract(7, 'day').toDate(), dayjs().toDate(), 'day', [], [], 'netValue', 'category');

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
    COMPLETE = 'COMPLETE'
}
