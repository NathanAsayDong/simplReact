import { FC } from 'react';

interface DashboardProps {
   handleLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({handleLogout}) => (
   <>
      <p>Welcome to dashboard</p>
      <button onClick={handleLogout} >Logout</button>
   </>
);

export default Dashboard;
