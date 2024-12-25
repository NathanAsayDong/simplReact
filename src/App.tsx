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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(true)
  const [userId, setUserId] = useState('')
  const initContext = InitializeDataForContext().initializeData;

  const handleLogin = () => {
    setIsLoggedIn(true);
    checkLoggedIn();
    checkOnboarding();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  }

  const checkOnboarding = async() => {
    if (isLoggedIn) {
      const status = await getUserOnboardStatus(userId);
      if (status == OnboardingStatus.COMPLETE) {
        setOnboardingCompleted(true);
      } else {
        setOnboardingCompleted(false);
      }
    } else {
      setOnboardingCompleted(true);
    }
  }

  const checkLoggedIn = () => {
    const id = localStorage.getItem('id');
    if (id !== 'undefined' && id !== null && id !== '' && id !== undefined) {
      setIsLoggedIn(true);
      setUserId(id);
    }
    else {
      setIsLoggedIn(false);
      setOnboardingCompleted(true);
    }
  }

  const checkStatus = async () => {
    await checkLoggedIn();
    await checkOnboarding();
    console.log('isLoggedIn', isLoggedIn, 'onboardingCompleted', onboardingCompleted)
    if (isLoggedIn && onboardingCompleted) {
      initContext();
    }
  }

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn && onboardingCompleted) {
      initContext();
    }
  }, [isLoggedIn, onboardingCompleted]);

  
  return (
    <Router>
      {!onboardingCompleted && isLoggedIn ? (
        <Routes>
          <Route path="/onboarding" element={<Onboarding handleLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/onboarding" />} />
        </Routes>
      ) : isLoggedIn ? (
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
