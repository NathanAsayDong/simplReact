import { AccountTypes } from './classes';

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
    public static processTransactions = async (csvData: any, account: AccountTypes) => {
        try {
            const id = localStorage.getItem('id');
            if (!id) throw new Error('User ID is missing in local storage.');
            
            const url = localUrl + 'upload-transactions-csv' + '?account=' + account.value + '&userId=' + id;
            
            const response = await fetch(url, {
                method: 'POST',
                body: csvData,
                headers: {
                    'Content-Type': 'text/csv'
                }
            });
            
            if (!response.ok) {
                const errorBody = await response.text(); // Or response.json() if the server sends JSON
                throw new Error(`Failed to upload CSV: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            
            const res = await response.json();
            console.log('this is front end response ', res);
            return res;
        } catch (error) {
            console.error('Error during CSV upload:', error);
            throw error; // Re-throw to allow error handling further up the call stack.
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
            console.log('this is front end response ', res);
            return res;
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
                const errorBody = await response.text(); // Or response.json() if the server sends JSON
                throw new Error(`Failed to get accounts: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            console.log('this is front end response ', res);
            return res;
        } catch (error) {
            console.error('Error during getting accounts:', error);
            throw error; // Re-throw to allow error handling further up the call stack.
        }
    }
}