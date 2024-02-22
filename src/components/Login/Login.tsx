import { FC } from 'react';
import './Login.scss'; // Import CSS file for styling

interface LoginProps {}

const Login: FC<LoginProps> = () => (
   <>
      <h1>LOGIN</h1>
      <div className='loginForm'>
         <h2>Username:</h2>
         <input type="text" />
         <h2>Password:</h2>
         <input type="password" />
         <button>Login</button>
         <button>Create Account</button>
      </div>
   </>
);

export default Login;
