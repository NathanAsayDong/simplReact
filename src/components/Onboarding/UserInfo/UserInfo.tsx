import { FC } from 'react';
import './UserInfo.scss';



interface UserInfoProps {}

const UserInfo: FC<UserInfoProps> = () =>  {
    
    return (
        <>
            <h1>UserInfo</h1>
            <div className='form-container'>

                <input type='text' placeholder='First Name' />
                <input type='text' placeholder='Last Name' />
                <input type='email' placeholder='Email' />
                <input type='tel' placeholder='Phone' />
                <input type='password' placeholder='Password' />
                <input type='password' placeholder='Confirm Password' />
                <button>Submit</button>
                
            </div>
        </>
    )
}

export default UserInfo;