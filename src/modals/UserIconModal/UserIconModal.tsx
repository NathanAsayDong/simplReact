import { FC } from "react";
import './UserIconModal.scss';

interface UserIconModalProps {
    handleLogout: () => void;
}

export const UserIconModal: FC<UserIconModalProps> = ({handleLogout}) => {


    return (
        <>
            <div className="options-box">
                <div className="options-header archivo-font">
                    <h2 className="header">Would you like to logout?</h2>
                </div>
                <div className="options-row">
                    <button className="button" onClick={handleLogout}>Logout</button>
                </div>

            


            </div>
        </>
    )





}