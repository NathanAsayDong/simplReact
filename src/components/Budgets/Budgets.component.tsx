import { FC, useState } from "react"
import { TransactionData, UserBudgetDataMethods, UserBudgetsData, UserCategoriesData } from "../../services/Classes/dataContext";
import { Budget, Category, Transaction } from "../../services/Classes/classes";
import './Budgets.component.scss';
import { Modal } from "@mui/material";
import AddBudgetModal from "../../modals/AddBudgetModal/AddBudgetModal";
import { DataApiService } from "../../services/Classes/dataApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../modals/ConfirmModal/ConfirmModal";
import { calculateBudgetPercentage, calculateRawBudgetPercentage, getBudgetTotalSpend } from "./Budgets.service";

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

    return (
        <>
            <div className="budgets-page hide-scroll">
                <div className='row' style={{paddingTop: '1em'}}>
                    <h3 className='page-title'>Budgets</h3>
                    <button className='add-button-accounts' onClick={() => setShowAddBudgetModal(true)} ><FontAwesomeIcon icon={faPlus} size='lg' /></button>
                </div>

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
                                    <div className="budget-bar" style={{width: `${calculateBudgetPercentage(budget, transactions)}%`}}>
                                        <p className="budget-usage">{calculateRawBudgetPercentage(budget, transactions).toFixed(0)}%</p>
                                    </div>
                                    <p className="budget-usage">${getBudgetTotalSpend(budget, transactions).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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