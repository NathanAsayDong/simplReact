export class dashboardAccount {
    accountId: number;
    accountName: string;
    netChange: number;
    currentBalance: number;
    constructor(accountId: number, accountName: string, netChange: number, currentBalance: number) {
        this.accountId = accountId;
        this.accountName = accountName;
        this.netChange = netChange;
        this.currentBalance = currentBalance;
    }
}


