import React from "react";
import GeneratorSidebar from "./GeneratorSidebar";
import { Outlet } from "react-router-dom";

const GeneratorDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div>
        <GeneratorSidebar user={user} />
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default GeneratorDashboard;
