import { useEffect, useState } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.scss'
import Accounts from './components/Accounts/Accounts'
import Budgets from './components/Budgets/Budgets'
import CategoryManagement from './components/CategoryManagement/CategoryManagement'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import NavBar from './components/NavBar/NavBar'
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy'
import Settings from './components/Settings/Settings'
import TransactionsManagement from './components/TransactionsManagement/TransactionsManagement'
import Welcome from './components/Welcome/Welcome'
import { InitializeDataForContext } from './services/Classes/dataContext'


function App() {
  const [isLoggin, setIsLoggin] = useState(false)
  const initContext = InitializeDataForContext().initializeData;

  const handleLogin = () => {
    setIsLoggin(true);
  };

  const handleLogout = () => {
    setIsLoggin(false);
    localStorage.clear();
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
  }, [ ])

  useEffect(() => {
    initContext();
  }, [ ])

  
  return (
    <Router>
      {isLoggin ? (
        <>
          <NavBar handleLogout={handleLogout} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard handleLogout={handleLogout} />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/manage-categories" element={<CategoryManagement />} />
            <Route path="/manage-transactions" element={<TransactionsManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          <div className='footer'>
            <p>© 2024 - Budget Tracker</p>
            <p style={{ padding: '0 5px' }}> - </p>
            <Link to="/privacy-policy" style={{ color: 'white', textDecoration: 'underline' }}>Privacy Policy</Link>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App
