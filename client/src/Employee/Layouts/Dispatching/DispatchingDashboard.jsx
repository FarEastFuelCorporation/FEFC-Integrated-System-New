import React from "react";
import DispatchingSidebar from ".//DispatchingSidebar";
import { Outlet } from "react-router-dom";

const DispatchingDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div>
        <DispatchingSidebar user={user} />
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DispatchingDashboard;
