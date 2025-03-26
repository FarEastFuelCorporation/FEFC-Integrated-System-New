import React from "react";
import "font-awesome/css/font-awesome.min.css";
import RoleProtectedRoute from "../../OtherComponents/RoleProtectedRoute";
import MarketingRoutesJD from "../Employee/Routes/AdminRoutes";

const DashboardJD = ({ user, onUpdateUser, socket }) => {
  switch (user.userType) {
    case 1:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[1]}>
          <MarketingRoutesJD
            user={user}
            onUpdateUser={onUpdateUser}
            socket={socket}
          />
        </RoleProtectedRoute>
      );

    default:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[1]}>
          <MarketingRoutesJD
            user={user}
            onUpdateUser={onUpdateUser}
            socket={socket}
          />
        </RoleProtectedRoute>
      );
  }
};

export default DashboardJD;
