export class Transaction {
    id: number;
    date: Date;
    amount: number;
    description: string;
    account: string;
    category: string;
    status: string;
    constructor(id: number,date: Date, amount: number, description: string, account: string, category: string, status: string) {
        this.id = id;
        this.date = date;
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
    value : string = 'Uccu' || 'Chase' || 'Discover' || 'CapitalOne' || 'Venmo' || 'CashApp' || 'Paypal' || 'Cash' || 'Other';
    constructor(value: string) {
        this.value = value;
    }
}