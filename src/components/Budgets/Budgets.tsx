import { FC, useState } from 'react';


interface BudgetsProps {}
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

const Budgets: FC<BudgetsProps> = () => (
  <div>
    Budgets Component
  </div>
);

export default Budgets;
