import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useState } from 'react';
import { Budget } from '../../services/Classes/classes';
import './Budgets.css';

const Budgets: FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudget, setNewBudget] = useState<Budget>({ id: 0, name: '', amount: 0, category: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBudget(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBudgets(prevBudgets => [...prevBudgets, { ...newBudget, id: prevBudgets.length + 1 }]);
    setNewBudget({ id: 0, name: '', amount: 0, category: '' }); // Reset form fields after submission
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={newBudget.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input type="number" id="amount" name="amount" value={newBudget.amount} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input type="text" id="category" name="category" value={newBudget.category} onChange={handleChange} />
          </div>
          <button type="submit">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>
        <div>
          <h3>Existing Budgets:</h3>
          {budgets.map(budget => (
            <div className="budget-item" key={budget.id}>
              <p>Name: {budget.name}</p>
              <p>Category: {budget.category}</p>
              <p>Amount: {budget.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
