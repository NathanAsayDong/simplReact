import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InitializeDataForContext } from '../../services/Classes/dataContext';
import { attemptCreateAccount, attemptLogin } from '../../services/Classes/userApiService';
import Onboarding from '../Onboarding/Onboarding';
import './Login.scss';


interface LoginProps {
   handleLogin: () => void;
}
   

const Login: FC<LoginProps> = ({ handleLogin }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [userWantsToCreateAccount, setUserWantsToCreateAccount] = useState(false);
   const setLoading = InitializeDataForContext().setLoading;
   const navigate = useNavigate();

   useEffect(() => {
      const slogan = document.querySelector('.slogan');
      if (slogan) {
         slogan.classList.add('panUp');
      }
   }, []);

   
   const login = async () => {
      if (email === '' || password === '') {
         alert('Email and password cannot be empty');
         return;
      }
      if (!email.includes('@') || !email.includes('.')) {
         alert('Invalid email');
         return;
      }
      const success = await attemptLogin(email, password);
      if (success) {
         localStorage.setItem('id', success.authToken);
         setLoading(false);
         handleLogin();
         navigate('/welcome');
      } else {
         alert('Failed to login');
      }
   }

   const createAccount = async () => {
      if (email === '' || password === '') {
         return;
      }
      if (!email.includes('@') || !email.includes('.')) {
         alert('Invalid email');
         return;
      }
      if (password.length < 8) {
         alert('Password must be at least 8 characters long');
         return;
      }
      if (!password.match(/[0-9]/)) {
         alert('Password must contain at least one number');
         return;
      }
      if (!password.match(/[A-Z]/)) {
         alert('Password must contain at least one capital letter');
         return;
      }
      const success = await attemptCreateAccount(email, password);
      if (success) {
         localStorage.setItem('id', success.authToken);
         handleLogin();
      }
      else {
         alert('Failed to create an account');
      }
   }

   const toggleCreateAccount = () => {
      setUserWantsToCreateAccount(!userWantsToCreateAccount);
   }

   return  (
   <>
      {!userWantsToCreateAccount &&
      <div className='centerPage special-background' >
         <div className='slogan'>
            <h1>MAKING FINANCES SIMPL.</h1>
         </div>
         <div className='loginForm'>
            <h2 className='roboto-bold'>LOGIN</h2>
            <input id='username' type="email" placeHolder='email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => (e.key == 'Enter' ? login() : null)}/>
            <input id='password' type="password" placeHolder='password' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key == 'Enter' ? login() : null)}/>
            <button onClick={login}>Login</button>
            {!userWantsToCreateAccount && <p onClick={toggleCreateAccount} className='create-account-toggle'> Create Account? </p>}
         </div>
      </div>}

      <div>
         {userWantsToCreateAccount && <Onboarding toggleCreateAccount={toggleCreateAccount} handleLogin={handleLogin}/>}
      </div>
   </>
   );
   
};

export default Login;
