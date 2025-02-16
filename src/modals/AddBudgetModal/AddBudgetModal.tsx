import { FC, useState } from "react"
import { Budget, Category } from "../../services/Classes/classes";
import './AddBudgetModal.scss';

interface AddBudgetModalProps {
    saveBudget: (budget: Budget) => void;
    closeModal: () => void;
    categories: Category[] | [];
}

const AddBudgetModal: FC<AddBudgetModalProps> = ({saveBudget, closeModal, categories}) => {
    const [newBudget, setNewBudget] = useState(new Budget());

    const save = () => {
        if (!newBudget.startDate || !newBudget.endDate || !newBudget.amount || !newBudget.categoryIds) {
            alert("Please fill in all fields");
            return;
        }
        saveBudget(newBudget);
    }

    const test = () => {
        console.log('test', newBudget);
    }

    const cancel = () => {
        setNewBudget(new Budget());
        closeModal();
    }

    return (
        <>
            <div className="add-budget-modal">
                <div className="row">
                    <div className="section" style={{height: "50px", marginTop: "20px", display: "flex", alignItems: "center"}}>
                        <h3 className="poppins" onClick={test}>Add Budget</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="section">
                        <h4 className="section-title">Budget name:</h4>
                        <input type="text" className="poppins" onChange={(e) => setNewBudget({...newBudget, budgetName: e.target.value})} />
                    </div>
                </div>

                <div className="row">
                    <div className="section">
                        <h4 className="section-title">Start Date:</h4>
                        <input type="date" className="poppins" onChange={(e) => setNewBudget({...newBudget, startDate: e.target.value})} />
                    </div>
                    <div className="section">
                        <h4 className="section-title">End Date:</h4>
                        <input type="date" className="poppins" onChange={(e) => setNewBudget({...newBudget, endDate: e.target.value})} />
                    </div>
                </div>

                <div className="row">
                    <div className="section">
                        <h4 className="section-title">Amount:</h4>
                        <input type="number" className="poppins" onChange={(e) => setNewBudget({...newBudget, amount: parseInt(e.target.value)})} />
                    </div>
                </div>

                <div className="row">
                    <div className="section">
                        <h4 className="section-title">Categories:</h4>
                        <div className="categories">
                        {categories.map((category: Category) => (
                            <div
                                key={category.categoryId}
                                className={`category ${newBudget.categoryIds?.includes(category.categoryId) ? "category-selected" : ""}`}
                                onClick={() => {
                                    if (newBudget.categoryIds?.includes(category.categoryId)) {
                                        setNewBudget({
                                            ...newBudget,
                                            categoryIds: newBudget.categoryIds.filter((id: number) => id !== category.categoryId)
                                        });
                                    } else {
                                        setNewBudget({
                                            ...newBudget,
                                            categoryIds: [...(newBudget.categoryIds || []), category.categoryId]
                                        });
                                    }
                                }}
                            >
                                <p>{category.categoryName}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="final-buttons">
                    <button className="cancel poppins" onClick={cancel}>Cancel</button>
                    <button className="save poppins special-background" onClick={save}>Add Budget</button>
                </div>
            </div>
        </>
    )

}

export default AddBudgetModal
