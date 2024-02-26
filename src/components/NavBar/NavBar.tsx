import { FC } from 'react';
import './NavBar.scss';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => (
   <>
      <div className='pages'>
         <h2>Budgets</h2>
         <h2>Upload CSV</h2>
         <h2>Proforma</h2>
         <h2 className='account'>Account</h2>
      </div>
   </>
);

export default NavBar;
