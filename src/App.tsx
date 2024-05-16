import { useEffect, useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
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
        <Dashboard handleLogout={handleLogout}/>
    )
  }
  else {
    return <Login handleLogin={handleLogin}/>
  }
}

export default App
