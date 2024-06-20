import React from "react";
import HRSidebar from "./HRSidebar";
import { Outlet } from "react-router-dom";

const HRDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div style={{ height: "100%" }}>
        <HRSidebar user={user} />
      </div>
      <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default HRDashboard;
