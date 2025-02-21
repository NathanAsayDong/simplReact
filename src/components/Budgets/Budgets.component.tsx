import { FC, useState } from "react"
import { TransactionData, UserBudgetDataMethods, UserBudgetsData, UserCategoriesData } from "../../services/Classes/dataContext";
import { Budget, Category, Transaction } from "../../services/Classes/classes";
import './Budgets.component.scss';
import { Modal } from "@mui/material";
import AddBudgetModal from "../../modals/AddBudgetModal/AddBudgetModal";
import { DataApiService } from "../../services/Classes/dataApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../modals/ConfirmModal/ConfirmModal";

interface BudgetsProps {}

const Budgets: FC<BudgetsProps> = () => {
    const budgets: Budget[] = UserBudgetsData() || [];
    const refreshBudgets = UserBudgetDataMethods().refreshBudgets;
    const categories: Category[] = UserCategoriesData() || [];
    const transactions = TransactionData() || [];
    const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

    const saveNewBudget = async (budget: Budget) => {
        await DataApiService.addBudget(budget);
        await refreshBudgets();
        setShowAddBudgetModal(false);
    }

    const requestDeleteBudget = (budget: Budget) => {
        setSelectedBudget(budget);
        setShowConfirmModal(true);
    }

    const deleteBudget = async () => {
        setShowConfirmModal(false);
        if (selectedBudget) {
            await DataApiService.deleteBudget(selectedBudget);
            await refreshBudgets();
        }
    }

    const calculateBudgetPercentage = (budget: Budget) => {
        const total = budget.amount;
        const totalSpent = getBudgetTotalSpend(budget);
        let percentage = (totalSpent / total);
        if (isNaN(percentage)) {
            percentage = 0;
        }
        if (percentage > 1) {
            percentage = 1;
        }
        return percentage * 100;
    }

    const calculateRawBudgetPercentage = (budget: Budget) => {
        const total = budget.amount;
        const totalSpent = getBudgetTotalSpend(budget);
        let percentage = (totalSpent / total);
        if (isNaN(percentage)) {
            percentage = 0;
        }
        return percentage * 100;
    }

    const getBudgetTotalSpend = (budget: Budget) => {
        const filteredTransactions = transactions.filter((transaction: Transaction) => budget.categoryIds?.includes(transaction.categoryId));
        return filteredTransactions.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0);
    }

    const test = () => {
        console.log(budgets);
    }

    // const moreOptions = () => {

    // }

    return (
        <>
            <div className="budgets-page hide-scroll">
                <h3 onClick={test} className="page-title budgets-title"> Budgets </h3>

                {budgets.length === 0 && (
                        <p>No budgets found</p>
                )}

                {budgets.length > 0 && (
                    <div className="budgets-container">
                        {budgets.map((budget: Budget) => (
                            <div className="budget" key={budget.budgetId}>

                                <div className="budget-header">
                                        <h3 className="budget-name">{budget.budgetName}</h3>
                                        <p>${budget.amount.toFixed(2)}</p>
                                </div>
                                
                                <FontAwesomeIcon icon={faEllipsis} className="more-icon" onClick={() => requestDeleteBudget(budget)} />

                                <div className="budget-bar-container">
                                    <div className="budget-bar" style={{width: `${calculateBudgetPercentage(budget)}%`}}>
                                        <p className="budget-usage">{calculateRawBudgetPercentage(budget).toFixed(0)}%</p>
                                    </div>
                                    <p className="budget-usage">${getBudgetTotalSpend(budget).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="add-budget-button special-background" onClick={() => setShowAddBudgetModal(true)}>Add budget</button>
            </div>


                

            <Modal open={showAddBudgetModal} onClose={() => setShowAddBudgetModal(false)}>
                <div>
                    <AddBudgetModal saveBudget={saveNewBudget} closeModal={() => setShowAddBudgetModal(false)} categories={categories} />
                </div>
            </Modal>

            <Modal open={showConfirmModal} onClose={() => {setShowConfirmModal(false)}}>
                <div>
                    <ConfirmModal prompt="Are you sure you want to delete this budget?" 
                    onCancel={() => {setShowConfirmModal(false)}} 
                    onConfirm={() => {deleteBudget()}}/>
                </div>
            </Modal>
        </>


    )
}

export default Budgets