export class Transaction {
    id: number;
    timestamp: number;
    amount: number;
    description: string;
    category: string;
    constructor(id: number = -1, timestamp: number, amount: number, description: string, account: string, category: string, status: string = 'none') {
        this.id = id;
        this.timestamp = timestamp;
        this.amount = amount;
        this.description = description;
        this.category = category;
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

export const accountTypes = [
    'Checking', 'Savings', 'Credit'
];

export class Account {
    name: string;
    type: string;
    source: string
    refDate: string;
    refBalance: number;
    constructor(name: string, type: string, source: string, refDate: string = "NA", refBalance: number = 0) {
        this.name = name;
        this.type = type;
        this.source = source;
        this.refDate = refDate;
        this.refBalance = refBalance;
    }

    getAccountSource(): string {
        return this.source;
    }
}