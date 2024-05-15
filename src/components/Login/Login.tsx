import { FC, useEffect, useState } from 'react';
import { attemptCreateAccount, attemptLogin } from '../../services/Classes/userStoreService';
import './Login.scss';


interface LoginProps {
   handleLogin: () => void;
}
   

const Login: FC<LoginProps> = ({ handleLogin }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [userWantsToCreateAccount, setUserWantsToCreateAccount] = useState(false);

   useEffect(() => {
      const slogan = document.querySelector('.slogan');
      if (slogan) {
         slogan.classList.add('panUp');
      }
   }, []);

   
   const login = async () => {
      if (email === '' || password === '') {
         return;
      }
      const success = await attemptLogin(email, password);
      if (success) {
         localStorage.setItem('id', success.authToken);
         handleLogin();
      }
      else {
         alert('Failed to login');
      }
   }

   const createAccount = async () => {
      if (email === '' || password === '') {
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
      <div className='centerPage'>
         <div className='slogan'>
            {userWantsToCreateAccount ? <h1>WELCOME TO SIMPL.</h1> : <h1>MAKING FINANCES SIMPL.</h1>}
         </div>
         <div className='loginForm'>
            <h2>Email:</h2>
               <input id='username' type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => (e.key == 'Enter' ? login() : null)}/>
            <h2>Password:</h2>
               <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key == 'Enter' ? login() : null)}/>
            {!userWantsToCreateAccount && <button onClick={login}>Login</button>}
            {userWantsToCreateAccount && <button onClick={createAccount}>Create Account</button>}
            {!userWantsToCreateAccount && <p onClick={toggleCreateAccount}> Create Account? </p>}
            {userWantsToCreateAccount && <p onClick={toggleCreateAccount}> Already a user? </p>}
            </div>
      </div>
   </>
   );
   
};

export default Login;
