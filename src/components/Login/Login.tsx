import { FC } from 'react';
import './Login.scss'; // Import CSS file for styling

interface LoginProps {
   handleLogin: () => void;
}



const Login: FC<LoginProps> = ({ handleLogin }) => (
   <>
      <h1>MAKING FINANCES SIMPL.</h1>
      <div className='loginForm'>
         <h2>Username:</h2>
         <input type="text" />
         <h2>Password:</h2>
         <input type="password" />
         <button onClick={handleLogin}>Login</button>
         <button>Create Account</button>
      </div>
   </>
);

export default Login;
