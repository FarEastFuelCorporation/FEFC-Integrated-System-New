import React from "react";
import { Outlet } from "react-router-dom";
import BottomNavbar from "../Employee/Layouts/Employee/BottomNavbar";

const EmployeeSidebar = ({ user }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginTop: "64px",
      }}
    >
      {/* Bottom navigation bar */}
      <BottomNavbar />

      {/* Main content area */}
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 64px)", // Adjust for margin-top
          overflowY: "scroll",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
      >
        {/* Outlet component to render nested routes */}
        <div style={{ overflow: "none" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
