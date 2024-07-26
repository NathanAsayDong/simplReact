import { FC } from 'react';
import './UserAccounts.scss';



interface UserAccountsProps {}

const UserAccounts: FC<UserAccountsProps> = () =>  {
    
    return (
        <>
            <h1>Connect Accounts </h1>
            <div className='form-container'>
                <p style={{"color":"black"}}>Plaid integration here</p>
            </div>
        </>
    )
}

export default UserAccounts;
