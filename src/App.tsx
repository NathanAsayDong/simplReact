import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Accounts from './components/Accounts/Accounts'
import Budgets from './components/Budgets/Budgets'
import CategoryManagement from './components/CategoryManagement/CategoryManagement'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import NavBar from './components/NavBar/NavBar'
import TransactionsManagement from './components/TransactionsManagement/TransactionsManagement'
import { InitializeDataForContext } from './services/Classes/dataContext'


function App() {
  const [isLoggin, setIsLoggin] = useState(false)
  const initializeDataForContext = InitializeDataForContext();

  const handleLogin = () => {
    setIsLoggin(true);
  };

  const handleLogout = () => {
    setIsLoggin(false);
    localStorage.removeItem('id');
  }

  const initializePage = () => {
    const id = localStorage.getItem('id');
    if (id !== 'undefined' && id !== null && id !== '' && id !== undefined && !isLoggin) {
      setIsLoggin(true);
    }
    else {
      setIsLoggin(false);
    }
  }

  useEffect(() => {
    initializePage();
    initializeDataForContext();
  }, [ ])

  if (isLoggin) {
    return (
      <Router>
        <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard handleLogout={handleLogout}/>} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/manage-categories" element={<CategoryManagement />} />
        <Route path="/manage-transactions" element={<TransactionsManagement />} />
      </Routes>
    </Router>
    )
  }
  else {
    return <Login handleLogin={handleLogin}/>
  }
}

export default App
