import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attemptCreateAccount, attemptLogin } from '../../services/Classes/userApiService';
import './Login.component.scss';
import { CircularProgress } from '@mui/material';

interface LoginProps {
   handleLogin: (firebaseAuthId: string) => void;
}

const Login: FC<LoginProps> = ({ handleLogin }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('')
   const [viewLogin, setViewLogin] = useState(true)
   const [loading, setLoading] = useState(false)
   const loginRef = useRef<HTMLDivElement>(null);
   const isMobile = window.innerWidth < 600;
   const createAccountRef = useRef<HTMLDivElement>(null);
   const navigate = useNavigate();

   useEffect(() => {
      const slogan = document.querySelector('.slogan');
      if (slogan) {
         slogan.classList.add('panUp');
      }
   }, []);

   const toggleView = () => {
      setViewLogin(!viewLogin);
      setTimeout(() => {
         setEmail('');
         setPassword('');
         setConfirmPassword('');
      }, 500);
   };
   
   const login = async () => {
      setLoading(true);
      if (email === '' || password === '') {
         alert('Email and password cannot be empty');
         return;
      }
      if (!email.includes('@') || !email.includes('.')) {
         alert('Invalid email');
         return;
      }
      const success = await attemptLogin(email, password);
      setTimeout(() => {
         setLoading(false);
         if (success) {
            localStorage.setItem('firebaseAuthId', success.firebaseAuthId);
            handleLogin(success.firebaseAuthId);
            navigate('/onboarding');
         } else {
            alert('Failed to login');
         }
      }, 2000);
   }

   const createAccount = async () => {
      if (email === '' || password === '') {
         alert('Email and password cannot be empty');
         return;
      }
      if (!email.includes('@') || !email.includes('.')) {
         alert('Invalid email');
         return;
      }
      if (password !== confirmPassword) {
         alert("passwords must match")
      }
      const success = await attemptCreateAccount(email, password);
      if (success) {
         await localStorage.setItem('firebaseAuthId', success.authToken);
         handleLogin(success.firebaseAuthId);
         navigate('/onboarding');
      }
   }

   return  (
      <>
         <div className='login'>
         { !isMobile &&
            <div className='center-page special-background'>
               <div className='slogan'>
                  <h1>MAKING FINANCES SIMPL.</h1>
               </div>
               <div className='form-column'>
                  <div className={`form-container-login login ${viewLogin ? 'show' : 'hidden'}`} ref={loginRef}>
                     <h2 className='roboto-bold'>Login</h2>
                     <input id='email-login' type="email" placeholder='  email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? login() : null)} />
                     <input id='password-login' type="password" placeholder='  password' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? login() : null)} />
                     {!loading && <button onClick={login} className='login-button'> Login </button>}
                     {loading && <button className='loading-button'> <CircularProgress color='inherit' /> </button>}
                     <p onClick={toggleView} className='create-account-toggle'> Create Account? </p>
                  </div>
                  <div className={`form-container-login createAccount ${!viewLogin ? 'show' : 'hidden'}`} ref={createAccountRef}>
                     <h2 className='roboto-bold'>Coming Soon</h2>
                     <p style={{ margin: '20px 0', textAlign: 'center' }}>
                        Simpl is under development and launches May 17, 2025
                     </p>
                     <p onClick={toggleView} className='create-account-toggle'> Back to Login </p>
                     
                     {/* Commented out create account functionality
                     <h2 className='roboto-bold'>Create Account</h2>
                     <input id='email-create-account' type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? createAccount() : null)} />
                     <input id='password-create-account' type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? createAccount() : null)} />
                     <input id='confirm-password-create-account' type="password" placeholder='confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? createAccount() : null)} />
                     {!loading && <button onClick={createAccount} className='login-button'>Create Account</button>}
                     {loading && <button className='loading-button'> Loading </button>}
                     <p onClick={toggleView} className='create-account-toggle'> Already have an account? </p>
                     */}
                  </div>
               </div>
            </div>
         }
         { isMobile &&
            <div className='special-background mobile-view'>
               <h1 className='slogan-mobile'>Simple Finances</h1>
               {viewLogin ? (
                  <div className="white-wrapper">
                     <h2>Welcome back</h2>
                     <p>Log in to continue</p>
                     <input id='email-login' type="email" placeholder='  email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? login() : null)} />
                     <input id='password-login' type="password" placeholder='  password' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? login() : null)} />
                     <button className='login-button-mobile' onClick={login}>Login</button>
                     <p className='forgot-password'>Forgot your password?</p>
                     <p onClick={toggleView} className='create-account-toggle'> Create Account? </p>
                  </div>
               ) : (
                  <div className="white-wrapper">
                     <h2>Coming Soon</h2>
                     <p style={{ margin: '20px 0', textAlign: 'center' }}>
                        Simpl is under development and launches May 17, 2025
                     </p>
                     <p onClick={toggleView} className='create-account-toggle'> Back to Login </p>
                  </div>
               )}
            </div>
         }
         </div>
      </>
   );
   
};

export default Login;
