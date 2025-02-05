import { Account, Category, Transaction } from './classes';

const baseUrl = __API_URL__;

export class DataApiService {
    public static getAllTransactions = async () => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FireabseAuthId is missing in local storage.');

            const url = baseUrl + 'get-transactions-all' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url);

            if (!response.ok) {
                const errorBody = await response.text(); // Or response.json() if the server sends JSON
                throw new Error(`Failed to get transactions: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            const res = await response.json();
            // convert the response to a Transaction object
            const transactions = res.map((transaction: any) => {
                return new Transaction(transaction.transactionId, transaction.plaidTransactionId, new Date(transaction.timestamp).getTime(), transaction.amount, transaction.description, transaction.accountId, transaction.categoryId, transaction.userId);
            });
            transactions.sort((a: Transaction, b: Transaction) => {
                return a.timestamp - b.timestamp;
            });

            return transactions;
        } catch (error) {
            console.error('Error during getting transactions:', error);
            throw error; // Re-throw to allow error handling further up the call stack.
        }
    }

    public static getTransactionsForAccount = async (account: Account) : Promise<Transaction[]> => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FirebaseAuthId is missing in local storage.');
            const url = baseUrl + 'get-transactions-account' + '?firebaseAuthId=' + firebaseAuthId + '&account=' + account.accountName;
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text(); // Or response.json() if the server sends JSON
                throw new Error(`Failed to get transactions: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            const res = await response.json();
            const transactions = res.map((transaction: any) => {
                return new Transaction(transaction.transactionId, transaction.plaidTransactionId, new Date(transaction.timestamp).getTime(), transaction.amount, transaction.description, transaction.accountId, transaction.category, transaction.userId);
            });
            transactions.sort((a: Transaction, b: Transaction) => {
                return a.timestamp - b.timestamp;
            });
            return transactions;
        } catch (error) {
            console.error('Error during getting transactions:', error);
            throw error;
        }
    }

    public static getAllAccounts = async () => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FirebaseAuthId is missing in local storage.');

            const url = baseUrl + 'get-accounts-all' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to get accounts: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            if (!Array.isArray(res) || res.length === 0) {
                return [];
            }
            const accounts = res.map((account: any) => {
                return new Account(account.accountId, account.plaidAccountId, account.accountName, account.accountType, account.accountSource, account.refDate, account.refBalance, account.accessToken, account.userId);
            });

            return accounts;
        } catch (error) {
            console.error('Error during getting accounts:', error);
            throw error; // Re-throw to allow error handling further up the call stack.
        }
    }

    public static addAccount = async (account: Account) => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FirebaseAuthId is missing in local storage.');

            const url = baseUrl + 'add-account' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(account),
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

    public static updateAccount = async (account: Account) => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('User ID is missing in local storage.');

            const url = baseUrl + 'update-account' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(account),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to update account: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during updating account:', error);
            throw error;
        }
    }

    public static deleteAccount = async (account: Account) => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('User ID is missing in local storage.');

            const url = baseUrl + 'delete-account' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(account),
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

    public static getAllCategories = async () => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('AuthId is missing in local storage.');

            const url = baseUrl + 'get-categories-all' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url);

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to get categories: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            console.log(res);
            const categories = res.map((category: any) => {
                return new Category(category.categoryId, category.categoryName, category.parentCategoryId, category.userId);
            });
            console.log(categories);
            return categories;
        } catch (error) {
            console.error('Error during getting categories:', error);
            throw error;
        }
    }

    public static addCategory = async (categoryName: string) => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FirebaseAuthId is missing in local storage.');

            const url = baseUrl + 'add-category' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    categoryName: categoryName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to add category: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during adding category:', error);
            throw error;
        }
    }

    public static deleteCategory = async (category: Category) => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FirebaseAuthId is missing in local storage.');

            const url = baseUrl + 'delete-category' + '?firebaseAuthId=' + firebaseAuthId;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(category),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to delete category: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during deleting category:', error);
            throw error;
        }
    }

    public static updateCategoryForTransaction = async (transaction: Transaction, newCategoryId: number) => {
        try {
            const firebaseAuthId = localStorage.getItem('firebaseAuthId');
            if (!firebaseAuthId) throw new Error('FirebaseAuthId is missing in local storage.');

            const url = baseUrl + 'update-transaction-category' + '?firebaseAuthId=' + firebaseAuthId;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    transaction: transaction,
                    categoryId: newCategoryId,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to update category: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during updating category:', error);
            throw error;
        }
    }

    public static syncData = async () => {
        const firebaseAuthId = localStorage.getItem('firebaseAuthId');
        if (!firebaseAuthId) throw new Error('User ID is missing in local storage.');
    
        const accounts = await this.getAllAccounts();
        if (accounts.length === 0) {
            throw new Error('No accounts found.');
        }

        for (const account of accounts) {
            const url = baseUrl + 'plaid/sync-transactions' + '?firebaseAuthId=' + firebaseAuthId;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(account),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to sync data: ${response.status} ${response.statusText} - ${errorBody}`);
            }
        }
    }

    public static getAiQuestionResponse = async (question: string, conversationContext: string) : Promise<string> => {
        try {
            const id = localStorage.getItem('firebaseAuthId');
            if (!id) throw new Error('User ID is missing in local storage.');

            const url = baseUrl + 'ai/get-response';

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    question: question,
                    userId: id,
                    conversationContext: conversationContext
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to get AI response: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during getting AI response:', error);
            return "Looks like there was an error with the AI. Please try again later.";
        }
    }
    



    //Temporary only for migrating data from these endpoints:
    public static migrateAccounts = async () => {
        try {
            const userId = localStorage.getItem('firebaseAuthId');
            if (!userId) throw new Error('User ID is missing in local storage.');

            const url = baseUrl + 'supabase/migrate-accounts' + '?userId=' + userId;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to migrate accounts: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during migrating accounts:', error);
            throw error;
        }
    }

    public static migrateCategories = async () => {
        try {
            const userId = localStorage.getItem('firebaseAuthId');
            if (!userId) throw new Error('User ID is missing in local storage.');

            const url = baseUrl + 'supabase/migrate-categories' + '?userId=' + userId;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to migrate categories: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during migrating categories:', error);
            throw error;
        }
    }

    public static migrateTransactions = async () => {
        try {
            const userId = localStorage.getItem('firebaseAuthId');
            if (!userId) throw new Error('User ID is missing in local storage.');

            const url = baseUrl + 'supabase/migrate-transactions' + '?userId=' + userId;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Failed to migrate transactions: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const res = await response.json();
            return res;
        } catch (error) {
            console.error('Error during migrating transactions:', error);
            throw error;
        }
    }
}