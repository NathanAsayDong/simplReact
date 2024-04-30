import { Account, Transaction } from './classes';

const url = 'https://simpl-api-ca96d9ccde88.herokuapp.com/'
const localUrl = 'http://localhost:8080/'

export class TransactionProcessing {
    public static processTransactions = (csvData: any) => {
        url + 'upload-transactions-csv'
        fetch(url + 'upload-transactions-csv', {
            method: 'POST',
            body: JSON.stringify(csvData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upload CSV');
            }
            return response.json();
        })
        .catch(error => {
            throw new Error('Error uploading CSV: ' + error.message);
        });
    }
}


export class TransactionProcessingLocal {
    public static processTransactions = async (csvData: any, account: Account) => {
        try {
            const id = localStorage.getItem('id');
            if (!id) throw new Error('User ID is missing in local storage.');
            
            const url = localUrl + 'upload-transactions-csv' + '?account=' + account.name + '&accountType=' + account.type + '&userId=' + id;
            
            const response = await fetch(url, {
                method: 'POST',
                body: csvData,
                headers: {
                    'Content-Type': 'text/csv'
                }
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to upload CSV: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            
            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during CSV upload:', error);
            throw error;
        }
    }

    public static getAllTransactions = async () => {
        try {
            const id = localStorage.getItem('id');
            if (!id) throw new Error('User ID is missing in local storage.');

            const url = localUrl + 'get-transactions-all' + '?userId=' + id;

            const response = await fetch(url);

            if (!response.ok) {
                const errorBody = await response.text(); // Or response.json() if the server sends JSON
                throw new Error(`Failed to get transactions: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            // convert the response to a Transaction object
            const transactions = res.map((transaction: any) => {
                return new Transaction(transaction.id, new Date(transaction.timestamp).getTime(), transaction.amount, transaction.description, transaction.account, transaction.category, transaction.status);
            });

            //format dates to be 

            return transactions;
        } catch (error) {
            console.error('Error during getting transactions:', error);
            throw error; // Re-throw to allow error handling further up the call stack.
        }
    }

    public static getAllAccounts = async () => {
        try {
            const id = localStorage.getItem('id');
            if (!id) throw new Error('User ID is missing in local storage.');

            const url = localUrl + 'get-accounts-all' + '?userId=' + id;

            const response = await fetch(url);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to get accounts: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();

            const accounts = res.map((account: any) => {
                return new Account(account.accountName, account.accountType);
            });


            return accounts;
        } catch (error) {
            console.error('Error during getting accounts:', error);
            throw error; // Re-throw to allow error handling further up the call stack.
        }
    }

    public static addAccount = async (account: Account) => {
        try {
            const id = localStorage.getItem('id');
            if (!id) throw new Error('User ID is missing in local storage.');

            const url = localUrl + 'add-account' + '?userId=' + id;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    accountName: account.name,
                    accountType: account.type
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to add account: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during adding account:', error);
            throw error;
        }
    }

    public static deleteAccount = async (account: Account) => {
        try {
            const id = localStorage.getItem('id');
            if (!id) throw new Error('User ID is missing in local storage.');

            const url = localUrl + 'delete-account' + '?userId=' + id;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    accountName: account.name,
                    accountType: account.type
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to delete account: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during deleting account:', error);
            throw error;
        }
    }
}