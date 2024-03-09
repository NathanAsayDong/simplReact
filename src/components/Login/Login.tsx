import { FC, useState } from 'react';
import { View } from 'react-native';
import { attemptLogin } from '../../services/Classes/userStoreService';
import './Login.scss';



interface LoginProps {
   handleLogin: () => void;
}
   

const Login: FC<LoginProps> = ({ handleLogin }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   
   const login = async () => {
      const success = await attemptLogin(email, password);
      if (success) {
         handleLogin();
      }
      else {
         alert('Failed to login');
      }
   }

   return  (
   <>
      <View>
         <h1>MAKING FINANCES SIMPL.</h1>
         <div className='loginForm'>
            <h2>Email:</h2>
               <input id='username' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <h2>Password:</h2>
               <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
            <button>Create Account</button>
         </div>
      </View>
   </>
   );
   
};

export default Login;
