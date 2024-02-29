class Transaction {
    id: number;
    date: Date;
    amount: number;
    description: string;
    account: string;
    category: string;
    constructor(id: number, date: Date, amount: number, description: string, account: string, category: string) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.description = description;
        this.account = account;
        this.category = category;
    }
}

class Budget {
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