// components/Dashboards/Dispatching/DispatchingSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../../auth';

const DispatchingSidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/dashboard/dispatching/home">Home</Link></li>
                <li><Link to="/dashboard/dispatching/section1">Section 1</Link></li>
                <li><Link to="/dashboard/dispatching/section2">Section 2</Link></li>
                <li><a href="#" onClick={logout}>Logout</a></li>
            </ul>
        </div>
    );
};

export default DispatchingSidebar;
