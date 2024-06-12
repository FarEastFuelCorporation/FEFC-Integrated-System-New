// src/components/Layout/DashboardLayout.jsx

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import MarketingDashboard from '../Dashboards/Marketing/MarketingDashboard';
import LogisticsDashboard from '../Dashboards/LogisticsDashboard';
import TreatmentDashboard from '../Dashboards/TreatmentDashboard';
import CertificationDashboard from '../Dashboards/CertificationDashboard';
import BillingDashboard from '../Dashboards/BillingDashboard';

const DashboardLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'marketing':
        return <MarketingDashboard />;
      case 'logistics':
        return <LogisticsDashboard />;
      case 'treatment':
        return <TreatmentDashboard />;
      case 'certification':
        return <CertificationDashboard />;
      case 'billing':
        return <BillingDashboard />;
      default:
        return <Redirect to="/" />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Switch>
          <Route path="/dashboard">{renderDashboard()}</Route>
        </Switch>
      </div>
    </div>
  );
};

export default DashboardLayout;
