import { FC, useState } from "react"
import { UserBudgetsData, UserCategoriesData } from "../../services/Classes/dataContext";
import { Budget, Category } from "../../services/Classes/classes";
import './Budgets.component.scss';
import { Modal } from "@mui/material";
import AddBudgetModal from "../../modals/AddBudgetModal/AddBudgetModal";
import { DataApiService } from "../../services/Classes/dataApiService";

interface BudgetsProps {}

const Budgets: FC<BudgetsProps> = () => {
    const budgets: Budget[] = UserBudgetsData() || [];
    const categories: Category[] = UserCategoriesData() || [];
    const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false);

    const saveNewBudget = async (budget: Budget) => {
        await DataApiService.addBudget(budget);
    }



    return (
        <>
            <div className="budgets-page">
                {budgets.length === 0 && (
                    <div className="budgets-container">
                        <p>No budgets found</p>
                    </div>
                )}

                {budgets.length > 0 && (
                    <div className="budgets-container">
                        {budgets.map((budget: Budget) => (
                            <div className="budget" key={budget.budgetId}>
                                <h3>{budget.description}</h3>
                                <p>{budget.startDate} - {budget.endDate}</p>
                                <p>${budget.amount}</p>
                            </div>
                        ))}
                    </div>
                )}

                <button className="add-budget-button special-background" onClick={() => setShowAddBudgetModal(true)}>Add budget</button>
            </div>


                

            <Modal open={showAddBudgetModal}>
                <AddBudgetModal saveBudget={saveNewBudget} closeModal={() => setShowAddBudgetModal(false)} categories={categories} />
            </Modal>
        </>


    )
}

export default Budgets