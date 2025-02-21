import { FC, useState } from "react"
import { Budget, Category } from "../../services/Classes/classes";
import './AddBudgetModal.scss';
import { CircularProgress } from "@mui/material";

interface AddBudgetModalProps {
    saveBudget: (budget: Budget) => void;
    closeModal: () => void;
    categories: Category[] | [];
}

const AddBudgetModal: FC<AddBudgetModalProps> = ({saveBudget, closeModal, categories}) => {
    const [newBudget, setNewBudget] = useState(new Budget());
    const [loading, setLoading] = useState<boolean>(false);

    const save = () => {
        if (!newBudget.startDate || !newBudget.endDate || !newBudget.amount || !newBudget.categoryIds) {
            alert("Please fill in all fields");
            return;
        }
        setLoading(true);
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
                    <div className="section" style={{height: "50px", marginTop: "35px", display: "flex", alignItems: "center"}}>
                        <h3 className="poppins" onClick={test}>Create a new Budget</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="section">
                        <h4 className="section-title">Budget name:</h4>
                        <input type="text" className="poppins" placeholder="Enter a name here"  onChange={(e) => setNewBudget({...newBudget, budgetName: e.target.value})} />
                    </div>
                    <div className="section">
                        <h4 className="section-title">Amount:</h4>
                        <input type="number" className="poppins" min="0.00" step="1.00" onChange={(e) => setNewBudget({...newBudget, amount: parseFloat(e.target.value)})} value={newBudget.amount !== undefined ? newBudget.amount.toFixed(2) : ""}/>
                    </div>
                </div>

                <div className="row">
                    <div className=" section">
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
                        <h4 className="section-title">Categories:</h4>
                        <div className="categories hide-scroll">
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
                    <button className="create poppins special-background" onClick={save}>{loading ? <CircularProgress color='inherit' /> : 'Create'}</button>
                </div>
            </div>
        </>
    )

}

export default AddBudgetModal
