import { FC, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import './Budgets.css';
interface Budget {
  id: number;
  name: string;
  amount: number;
  category: string;
}

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
      <NavBar />
      Budgets Component
    </div>
  );



export default Budgets;