// components/Dashboards/Receiving/ReceivingDashboard.js
import React from 'react';
import { Route, Routes  } from 'react-router-dom';
import ReceivingSidebar from './ReceivingSidebar';
import { getUser } from '../../../auth';

const ReceivingHome = () => <div>Welcome to the Receiving Dashboard, {getUser().username}!</div>;
const ReceivingSection1 = () => <div>Receiving Section 1 Content</div>;
const ReceivingSection2 = () => <div>Receiving Section 2 Content</div>;

const ReceivingDashboard = () => {
    return (
        <div className="dashboard">
            <ReceivingSidebar />
            <div className="content">
                <Routes >
                    <Route exact path="/dashboard/receiving/home" component={ReceivingHome} />
                    <Route path="/dashboard/receiving/section1" component={ReceivingSection1} />
                    <Route path="/dashboard/receiving/section2" component={ReceivingSection2} />
                </Routes >
            </div>
        </div>
    );
};

export default ReceivingDashboard;
