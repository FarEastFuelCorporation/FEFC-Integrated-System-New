// src/components/Layout/Sidebar.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useRouteMatch } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const { url } = useRouteMatch();

  const renderLinks = () => {
    switch (user.role) {
      case 'marketing':
        return (
          <ul>
            <li><Link to={`${url}/marketing`}>Overview</Link></li>
            <li><Link to={`${url}/marketing/campaigns`}>Campaigns</Link></li>
          </ul>
        );
      case 'logistics':
        return (
          <ul>
            <li><Link to={`${url}/logistics`}>Overview</Link></li>
            <li><Link to={`${url}/logistics/shipments`}>Shipments</Link></li>
          </ul>
        );
      case 'treatment':
        return (
          <ul>
            <li><Link to={`${url}/treatment`}>Overview</Link></li>
            <li><Link to={`${url}/treatment/patients`}>Patients</Link></li>
          </ul>
        );
      case 'certification':
        return (
          <ul>
            <li><Link to={`${url}/certification`}>Overview</Link></li>
            <li><Link to={`${url}/certification/courses`}>Courses</Link></li>
          </ul>
        );
      case 'billing':
        return (
          <ul>
            <li><Link to={`${url}/billing`}>Overview</Link></li>
            <li><Link to={`${url}/billing/invoices`}>Invoices</Link></li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      {renderLinks()}
    </div>
  );
};

export default Sidebar;
