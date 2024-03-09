import { FC, useState } from 'react';
import { attemptLogin } from '../../services/Classes/userStoreService';
import './Login.scss';


interface LoginProps {
   handleLogin: () => void;
}
   

const Login: FC<LoginProps> = ({ handleLogin }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   
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

   return  (
   <>
         <h1>MAKING FINANCES SIMPL.</h1>
         <div className='loginForm'>
            <h2>Email:</h2>
               <input id='username' className='loginInput' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <h2>Password:</h2>
               <input id='password' className='loginInput' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
            <button>Create Account</button>
         </div>
   </>
   );
   
};

export default Login;
