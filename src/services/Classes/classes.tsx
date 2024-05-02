export class Transaction {
    id: number;
    timestamp: number;
    amount: number;
    description: string;
    account: string;
    category: string;
    status: string;
    constructor(id: number = -1, timestamp: number, amount: number, description: string, account: string, category: string, status: string = 'none') {
        this.id = id;
        this.timestamp = timestamp;
        this.amount = amount;
        this.description = description;
        this.account = account;
        this.category = category;
        this.status = status;
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

export class AccountTypes {
    value : string = 'Uccu' || 'Chase' || 'Discover' || 'CapitalOne' || 'Venmo' || 'CashApp' || 'Paypal' || 'Cash' || 'Other' || 'None';
    constructor(value: string) {
        this.value = value;
    }
}

export const accountTypes = [
    'Uccu', 'Chase', 'Discover', 'CapitalOne', 'Venmo', 'CashApp', 'Paypal', 'Cash', 'Other'
];

export class Account {
    name: string;
    type: AccountTypes;
    refDate: string;
    refBalance: number;
    constructor(name: string, type: AccountTypes, refDate: string = "NA", refBalance: number = 0) {
        this.name = name;
        this.type = type;
        this.refDate = refDate;
        this.refBalance = refBalance;
    }

    getAccountType(): string {
        return this.type.value;
    }
}