import React from "react";
import SortingSidebar from "./SortingSidebar";
import { Outlet } from "react-router-dom";

const SortingDashboard = ({ user }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div>
        <SortingSidebar user={user} />
      </div>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
          overflowY: "scroll",
        }}
      >
        <Outlet style={{ overflow: "none" }} />
      </div>
    </div>
  );
};

export default SortingDashboard;
