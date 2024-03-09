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
            const url = localUrl + 'upload-transactions-csv' + '?account=' + account.value;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(csvData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to upload CSV');
            }
            const res =  await response.json();
            console.log('this is front end response ', res);
            return res;
        }
        catch (error) {
            throw new Error('Error uploading CSV');
        }
    }
}