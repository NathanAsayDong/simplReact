import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.scss';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => (

    <div className='navbar'>
        <h2>Simpl Finance</h2>
        
        <div className='nav-items'>
            <Link to="/"><h2 className='nav-item'>Dashboard</h2></Link>

            <Link to="/upload"><h2 className='nav-item'>Upload</h2></Link>

            <Link to="/accounts"><h2 className='nav-item'>Accounts</h2></Link>

            <Link to="/manage-categories"><h2 className='nav-item'>Categories</h2></Link>

            <Link to="/manage-transactions"><h2 className='nav-item'>Transactions</h2></Link>

            <FontAwesomeIcon icon={faUser} className='account-icon' />
        </div>
    </div>
);

export default NavBar;
