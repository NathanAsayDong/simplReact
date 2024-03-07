import { FC } from 'react';
import ImportCsv from '../ImportCsv/ImportCsv';
import NavBar from '../NavBar/NavBar';
import './Dashboard.scss';

interface DashboardProps {
   handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({handleLogout}) => (
   <>
   <NavBar />

      <div className='dashboard'>
         <p>Welcome to dashboard</p>
         <button onClick={handleLogout} >Logout</button>
      </div>

   <ImportCsv />
   </>
);

export default Dashboard;
