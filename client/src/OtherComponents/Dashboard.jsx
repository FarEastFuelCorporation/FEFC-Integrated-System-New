import React from "react";
import "font-awesome/css/font-awesome.min.css";
import GeneratorRoutes from "../Client/Routes/GeneratorRoutes";
import MarketingRoutes from "../Employee/Routes/MarketingRoutes";
import DispatchingRoutes from "../Employee/Routes/DispatchingRoutes";
import ReceivingRoutes from "../Employee/Routes/ReceivingRoutes";
import HRRoutes from "../Employee/Routes/HRRoutes";
import RoleProtectedRoute from "../OtherComponents/RoleProtectedRoute";
import { Navigate } from "react-router-dom";

const Dashboard = ({ user, onUpdateUser }) => {
  switch (user.userType) {
    case "GEN":
      return (
        <RoleProtectedRoute user={user} allowedRoles={["GEN"]}>
          <GeneratorRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case "TRP":
    case "IFM":
      return (
        <RoleProtectedRoute user={user} allowedRoles={[user.userType]}>
          <MarketingRoutes user={user} />
        </RoleProtectedRoute>
      );
    case 2:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[2]}>
          <MarketingRoutes user={user} />
        </RoleProtectedRoute>
      );
    case 3:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[3]}>
          <DispatchingRoutes user={user} />
        </RoleProtectedRoute>
      );
    case 4:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[4]}>
          <ReceivingRoutes user={user} />
        </RoleProtectedRoute>
      );
    case 9:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[9]}>
          <HRRoutes user={user} />
        </RoleProtectedRoute>
      );
    default:
      return <Navigate to="/login" />;
  }
};

export default Dashboard;
