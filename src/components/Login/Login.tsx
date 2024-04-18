import { FC, useEffect, useState } from 'react';
import { attemptCreateAccount, attemptLogin } from '../../services/Classes/userStoreService';
import './Login.scss';


interface LoginProps {
   handleLogin: () => void;
}
   

const Login: FC<LoginProps> = ({ handleLogin }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

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
         console.log(success);
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
         console.log(success);
         handleLogin();
      }
      else {
         alert('Failed to create an account');
      }
   }
   return  (
   <>
      <div className='centerPage'>
         <h1 className='slogan'>MAKING FINANCES SIMPL.</h1>
         <div className='loginForm'>
            <h2>Email:</h2>
               <input id='username' type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => (e.key == 'Enter' ? login() : null)}/>
            <h2>Password:</h2>
               <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key == 'Enter' ? login() : null)}/>
            <button onClick={login}>Login</button>
            <button onClick={createAccount}>Create Account</button>
         </div>
      </div>
   </>
   );
   
};

export default Login;
