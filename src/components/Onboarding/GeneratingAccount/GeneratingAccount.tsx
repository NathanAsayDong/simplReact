import React from 'react';
import './GeneratingAccount.scss';
import { LinearProgress } from '@mui/material';

interface GeneratingAccountProps {
    progress: number;
}

const GeneratingAccount: React.FC<GeneratingAccountProps> = ({ progress }) => {
    return (
        <>
            <div>
                <p>Please wait while we set up your account...</p>
                <LinearProgress variant="indeterminate" value={100} color='primary'/>
            </div>
        </>
    );
};

export default GeneratingAccount;