import React from "react";
import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import EmployeeSideBar from "../Employee/Layouts/Employee/EmployeeSideBar";
import { useTheme } from "@emotion/react";

const EmployeeSidebarComponent = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      {isMobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "64px",
          }}
        >
          {/* Bottom navigation bar */}
          <EmployeeSideBar user={user} />

          {/* Main content area */}
          <div
            style={{
              width: "100%",
              height: "calc(100vh - 126px)", // Adjust for margin-top
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
      ) : (
        <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
          <div>{<EmployeeSideBar user={user} />}</div>
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
      )}
    </div>
  );
};

export default EmployeeSidebarComponent;
