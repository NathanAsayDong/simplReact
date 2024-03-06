import { FC, useState } from 'react';

interface Budget {
  id: number;
  name: string;
  amount: number;
  category: string;
}

interface BudgetsProps {}

const Budgets: FC<BudgetsProps> = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const createBudget = () => {
    const newBudget: Budget = {
      id: 1,
      name: 'Groceries',
      amount: 300,
      category: 'Food'
    }
    setBudgets([...budgets, newBudget]);
  }

  return (
    <div>
      Budgets Component
      <button onClick={createBudget}>Create Budget</button>
      {/* Render your budgets here */}
    </div>
  );
};

export default Budgets;