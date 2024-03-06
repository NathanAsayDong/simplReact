import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import './NavBar.scss';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => (

    <div className='navbar'>

        <a href="#budgets"><h2 className='nav-item'>Budgets</h2></a>

        <a href="#upload"><h2 className='nav-item'>Upload</h2></a>

        <a href="pro_forma"><h2 className='nav-item'>Pro-Forma</h2></a>

        <FontAwesomeIcon icon={faUser} className='account-icon' />
    </div>
);

export default NavBar;
