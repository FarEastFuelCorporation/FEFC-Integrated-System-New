// components/Dashboards/Marketing/MarketingDashboard.js
import React from 'react';
import { Route, Routes  } from 'react-router-dom';
import MarketingSidebar from './MarketingSidebar';
import { getUser } from '../../../auth';

const MarketingHome = () => <div>Welcome to the Marketing Dashboard, {getUser().username}!</div>;
const MarketingSection1 = () => <div>Marketing Section 1 Content</div>;
const MarketingSection2 = () => <div>Marketing Section 2 Content</div>;

const MarketingDashboard = () => {
    return (
        <div className="dashboard">
            <MarketingSidebar />
            <div className="content">
                <Routes >
                    <Route exact path="/dashboard/marketing/home" component={MarketingHome} />
                    <Route path="/dashboard/marketing/section1" component={MarketingSection1} />
                    <Route path="/dashboard/marketing/section2" component={MarketingSection2} />
                </Routes>
            </div>
        </div>
    );
};

export default MarketingDashboard;
