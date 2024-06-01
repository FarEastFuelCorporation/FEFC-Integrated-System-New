// components/Dashboards/Receiving/ReceivingSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../../auth';

const ReceivingSidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/dashboard/receiving/home">Home</Link></li>
                <li><Link to="/dashboard/receiving/section1">Section 1</Link></li>
                <li><Link to="/dashboard/receiving/section2">Section 2</Link></li>
                <li><a href="#" onClick={logout}>Logout</a></li>
            </ul>
        </div>
    );
};

export default ReceivingSidebar;
