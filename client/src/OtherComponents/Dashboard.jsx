import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { Navigate } from "react-router-dom";
import GeneratorRoutes from "../Client/Routes/GeneratorRoutes";
import MarketingRoutes from "../Employee/Routes/MarketingRoutes";
import DispatchingRoutes from "../Employee/Routes/DispatchingRoutes";
import ReceivingRoutes from "../Employee/Routes/ReceivingRoutes";
import CertificationRoutes from "../Employee/Routes/CertificationRoutes.";
import HRRoutes from "../Employee/Routes/HRRoutes";
import RoleProtectedRoute from "../OtherComponents/RoleProtectedRoute";
import SortingRoutes from "../Employee/Routes/SortingRoutes";
import TreatmentRoutes from "../Employee/Routes/TreatmentRoutes";

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
          <MarketingRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 2:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[2]}>
          <MarketingRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 3:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[3]}>
          <DispatchingRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 4:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[4]}>
          <ReceivingRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 5:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[5]}>
          <SortingRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 6:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[6]}>
          <TreatmentRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 7:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[7]}>
          <CertificationRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    case 9:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[9]}>
          <HRRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    default:
      return <Navigate to="/login" />;
  }
};

export default Dashboard;
