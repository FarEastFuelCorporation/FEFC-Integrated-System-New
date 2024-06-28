import React from "react";
import CertificationSidebar from "./CertificationSidebar";
import { Outlet } from "react-router-dom";

const CertificationDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div>
        <CertificationSidebar user={user} />
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default CertificationDashboard;
