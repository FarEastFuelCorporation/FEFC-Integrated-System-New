// components/Dashboards/Dispatching/DispatchingDashboard.js
import React from 'react';
import { Route, Routes  } from 'react-router-dom';
import DispatchingSidebar from './DispatchingSidebar';
import { getUser } from '../../../auth';

const DispatchingHome = () => <div>Welcome to the Dispatching Dashboard, {getUser().username}!</div>;
const DispatchingSection1 = () => <div>Dispatching Section 1 Content</div>;
const DispatchingSection2 = () => <div>Dispatching Section 2 Content</div>;

const DispatchingDashboard = () => {
    return (
        <div className="dashboard">
            <DispatchingSidebar />
            <div className="content">
                <Routes >
                    <Route exact path="/dashboard/dispatching/home" component={DispatchingHome} />
                    <Route path="/dashboard/dispatching/section1" component={DispatchingSection1} />
                    <Route path="/dashboard/dispatching/section2" component={DispatchingSection2} />
                </Routes >
            </div>
        </div>
    );
};

export default DispatchingDashboard;
