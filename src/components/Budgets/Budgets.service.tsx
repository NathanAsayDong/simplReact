
import { Budget, Transaction } from "../../services/Classes/classes";

export const calculateBudgetPercentage = (budget: Budget, transactions: Transaction[]) => {
    const total = budget.amount;
    const totalSpent = getBudgetTotalSpend(budget, transactions);
    let percentage = (totalSpent / total);
    if (isNaN(percentage)) {
        percentage = 0;
    }
    if (percentage > 1) {
        percentage = 1;
    }
    return percentage * 100;
}

export const calculateRawBudgetPercentage = (budget: Budget, transactions: Transaction[]) => {
    const total = budget.amount;
    const totalSpent = getBudgetTotalSpend(budget, transactions);
    let percentage = (totalSpent / total);
    if (isNaN(percentage)) {
        percentage = 0;
    }
    return percentage * 100;
}

export const getBudgetTotalSpend = (budget: Budget, transactions: Transaction[]) => {
    const filteredTransactions = transactions.filter((transaction: Transaction) => budget.categoryIds?.includes(transaction.categoryId));
    return filteredTransactions.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0);
}