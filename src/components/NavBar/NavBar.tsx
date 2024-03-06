import { FC } from 'react';
import './NavBar.scss';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => (
  
  <div className='navbar'>

        <a href="#instant-balance"><h2 className='nav-item'>Instant Balance</h2></a>

        <a href="#future-balance"><h2 className='nav-item'>Future Balance</h2></a>

        <a href="#investments"><h2 className='nav-item'>Investments</h2></a>

        <a href="/Budgets"><h2 className='nav-item'>Budgets</h2></a>

  </div>
);

export default NavBar;
