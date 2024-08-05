import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styleDash.css';


export const Dashboard = () => {
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutConfirmation(true);
    };

    const confirmLogout = () => {
        console.log('Logging out...');
        navigate('/login');
        setShowLogoutConfirmation(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirmation(false);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className='logo-container'>
                    <div className='logo'></div>
                    <span className='logo-name'>MiSan Tech</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </header>
            
            <div className="sub-header">
                <div className="profile">Profile</div>
                <div className="play-button">Play</div>
                <div className="notification-bell">Notifications</div>
            </div>

            {showLogoutConfirmation && (
                <div className="logout-confirmation">
                    <p>Are you sure you want to log out?</p>
                    <button onClick={confirmLogout}>Yes</button>
                    <button onClick={cancelLogout}>No</button>
                </div>
            )}

            <h1>Dashboard</h1>
            {/* Dashboard content */}
        </div>
    );
};

export default Dashboard;   
