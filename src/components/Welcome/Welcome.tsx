import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InitializeDataForContext } from '../../services/Classes/dataContext';
import './Welcome.scss';

interface WelcomeProps {}

const Welcome: FC<WelcomeProps> = () => {
    const [loading, setLoading] = useState(true);
    const initializeData = InitializeDataForContext().initializeData;
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            await initializeData();
            setLoading(false);
            // setTimeout(() => {
            //     navigate('/dashboard');
            // }, 1000);
        };

        // loadData();
    }, [initializeData, navigate]);

    return (
        <div className={`welcome ${loading ? 'fade-in' : 'fade-out'}`}>
            <h2 className='roboto-bold'>Welcome Back</h2>
            <p className='roboto-light' style={{margin: 0}}>loading your data</p>
        </div>
    );
};

export default Welcome;