// import { FC } from 'react';

// interface NavBarProps {}

// const NavBar: FC<NavBarProps> = () => (
//    <>
//       NavBar Component
//    </>
// );

// export default NavBar;
import { FC } from 'react';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => (
  <nav className="navbar">
    <ul className="nav-menu">
      <li className="nav-item">
        <a href="#instant-balance">Instant Balance</a>
      </li>
      <li className="nav-item">
        <a href="#future-balance">Future Balance</a>
      </li>
      <li className="nav-item">
        <a href="#investments">Investments</a>
      </li>
      <li className="nav-item">
        <a href="#expenses">Expenses</a>
      </li>
    </ul>
  </nav>
);

export default NavBar;
