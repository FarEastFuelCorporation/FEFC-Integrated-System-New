// UserDashboard.js
import React from 'react';
import { Navigate  } from 'react-router-dom';
import { getUser } from './auth';
import MarketingDashboard from './components/Dashboards/Marketing/MarketingDashboard';
import DispatchingDashboard from './components/Dashboards/Dispatching/DispatchingDashboard';
import ReceivingDashboard from './components/Dashboards/Receiving/ReceivingDashboard';

const UserDashboard = () => {
    const { role } = getUser();

    if (role === 'marketing') {
        return <MarketingDashboard />;
    } else if (role === 'dispatching') {
        return <DispatchingDashboard />;
    } else if (role === 'receiving') {
        return <ReceivingDashboard />;
    } else {
        return <Navigate  to="/" />;
    }
};

export default UserDashboard;
