import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinearProgress, Modal } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIconModal } from '../../modals/UserIconModal/UserIconModal';
import { InitializeDataForContext } from '../../services/Classes/dataContext';
import './NavBar.scss';
import LoadingDots from '../SharedComponents/LoadingDots/LoadingDots.component';

interface NavBarProps {
    handleLogout: () => void;
}

const NavBar: FC<NavBarProps> = ({handleLogout}) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showUserModal, setShowUserModal] = useState<boolean>(false);
    const [slectedTab, setSelectedTab] = useState<string>('dashboard');
    const isLoading = InitializeDataForContext().loading;

    useEffect(() => {
        if (window.innerWidth <= 1000) {
            setIsMobile(true);
        }
    }, []);

    const handleBarsClick = () => {
        setShowDropdown(!showDropdown);
    }

    const updateSelectedTab = (tabName: string) => {
        setSelectedTab(tabName);
    }

    const tabIsSelected = (tabName: string) => {
        return slectedTab.includes(tabName);
    }

    return (
    <>
        <div className='navbar'>

            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <h3>Simpl Finance</h3>
                {isLoading && <LoadingDots />}
            </div>
            
            {isMobile ? <FontAwesomeIcon icon={faBars} className='account-icon' onClick={handleBarsClick}/>
            : (
            <div className='nav-items'>
                <Link to="/"><h3 className={`nav-item ${tabIsSelected('dashboard') ? 'nav-item-selected' : ''}`} onClick={() => updateSelectedTab('dashboard')}>Dashboard</h3></Link>

                <Link to="/accounts"><h3 className={`nav-item ${tabIsSelected('accounts') ? 'nav-item-selected' : ''}`} onClick={() => updateSelectedTab('accounts')}>Accounts</h3></Link>

                <Link to="/manage-categories"><h3 className={`nav-item ${tabIsSelected('manage-categories') ? 'nav-item-selected' : ''}`} onClick={() => updateSelectedTab('manage-categories')}>Categories</h3></Link>

                <Link to="/manage-transactions"><h3 className={`nav-item ${tabIsSelected('manage-transactions') ? 'nav-item-selected' : ''}`} onClick={() => updateSelectedTab('manage-transactions')}>Transactions</h3></Link>

                <Link to="/settings"><FontAwesomeIcon icon={faUser} className={`account-icon ${tabIsSelected('settings') ? 'nav-item-selected' : ''}`} onClick={() => updateSelectedTab('settings')} /></Link>
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


            <Modal
                open={showUserModal}
                onClose={() => setShowUserModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <div>
                    <UserIconModal handleLogout={handleLogout}/>
                </div>
            </Modal>

        </div>

    </>

    );
};

export default NavBar;