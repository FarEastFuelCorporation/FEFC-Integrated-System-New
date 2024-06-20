import React from "react";
import MarketingSidebar from "./MarketingSidebar";
import { Outlet } from "react-router-dom";

const MarketingDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div>
        <MarketingSidebar user={user} />
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MarketingDashboard;
