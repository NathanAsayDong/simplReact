import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.scss';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
        if (window.innerWidth <= 1000) {
            setIsMobile(true);
        }
    }, []);

    const handleBarsClick = () => {
        setShowDropdown(!showDropdown);
    }


    return (
    <div className='navbar'>
        <h2>Simpl Finance</h2>
        
        {isMobile ? <FontAwesomeIcon icon={faBars} className='account-icon' onClick={handleBarsClick}/>
        : (
        <div className='nav-items'>
            <Link to="/"><h2 className='nav-item'>Dashboard</h2></Link>

            <Link to="/accounts"><h2 className='nav-item'>Accounts</h2></Link>

            <Link to="/manage-categories"><h2 className='nav-item'>Categories</h2></Link>

            <Link to="/manage-transactions"><h2 className='nav-item'>Transactions</h2></Link>

            <FontAwesomeIcon icon={faUser} className='account-icon' />
        </div>
        )}

        {showDropdown && isMobile && (
            <div className='dropdown'>
                <Link to="/" className="dropdown-item"><h2>Dashboard</h2></Link>
                <Link to="/accounts" className="dropdown-item"><h2>Accounts</h2></Link>
                <Link to="/manage-categories" className="dropdown-item"><h2>Categories</h2></Link>
                <Link to="/manage-transactions" className="dropdown-item"><h2>Transactions</h2></Link>
            </div>
        )}

    </div>
    );
};

export default NavBar;
