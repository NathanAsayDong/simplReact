import { useEffect, useState } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.scss'
import Accounts from './components/Accounts/Accounts'
import Budgets from './components/Budgets/Budgets'
import CategoryManagement from './components/CategoryManagement/CategoryManagement'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import NavBar from './components/NavBar/NavBar'
import Onboarding from './components/Onboarding/Onboarding'
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy'
import Settings from './components/Settings/Settings'
import TransactionsManagement from './components/TransactionsManagement/TransactionsManagement'
import Welcome from './components/Welcome/Welcome'
import { InitializeDataForContext } from './services/Classes/dataContext'
import { getUserOnboardStatus } from './services/Classes/userApiService'
import { OnboardingStatus } from './services/Classes/classes'


function App() {
  const [isLoggin, setIsLoggin] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(true)
  const initContext = InitializeDataForContext().initializeData;

  const handleLogin = () => {
    setIsLoggin(true);
    checkOnboarding();
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
    checkOnboarding();
  }

  const checkOnboarding = async() => {
    console.log('checking onboarding')
    const userId = localStorage.getItem('id');
    console.log(userId)
    if (userId) {
      const status = await getUserOnboardStatus(userId);
      if (status == OnboardingStatus.COMPLETED) {
        setOnboardingCompleted(true);
      } else {
        setOnboardingCompleted(false);
      }
    } else {
      setOnboardingCompleted(false);
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
      {!onboardingCompleted && isLoggin ? (
        <Routes>
          <Route path="/onboarding" element={<Onboarding handleLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/onboarding" />} />
        </Routes>
      ) : isLoggin ? (
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
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/create-account" element={<Onboarding handleLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
