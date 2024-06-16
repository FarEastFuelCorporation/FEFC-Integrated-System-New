import React, { useState, useRef, useEffect } from "react";
import HRSidebar from "./HRSidebar";
import { Outlet } from "react-router-dom";

const HRDashboard = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250); // Set initial width of expanded sidebar
  const sidebarRef = useRef(null);

  useEffect(() => {
    const updateSidebarWidth = () => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.offsetWidth);
      }
    };

    // Update the width whenever the window resizes or when the collapse state changes
    window.addEventListener("resize", updateSidebarWidth);
    updateSidebarWidth();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateSidebarWidth);
    };
  }, [isCollapsed]);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div ref={sidebarRef}>
        <HRSidebar
          user={user}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      <div style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
        <Outlet />
      </div>
    </div>
  );
};

export default HRDashboard;
