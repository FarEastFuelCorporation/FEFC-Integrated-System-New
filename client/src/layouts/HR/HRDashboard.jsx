import React from "react";
import HRSidebar from "./HRSidebar";
import { Outlet } from "react-router-dom";

const HRDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div>
        <HRSidebar user={user} />
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default HRDashboard;
