import React from "react";
import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import AdminSidebarJD from "../Employee/Layouts/Marketing/AdminSidebar";

const UserSidebarJD = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let sidebar;

  switch (user.userType) {
    case 1:
      sidebar = <AdminSidebarJD user={user} />;
      break;

    default:
      sidebar = <AdminSidebarJD user={user} />;
  }

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
          {sidebar}

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
          {sidebar}
          <div
            style={{
              width: "100%",
              height: "calc(100vh - 64px)",
              overflowY: "scroll",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            <Outlet style={{ overflow: "none" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSidebarJD;
