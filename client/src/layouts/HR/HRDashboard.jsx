import React from "react";
import HRSidebar from "./HRSidebar";

const HRDashboard = ({ user }) => {
  return (
    <div>
      <HRSidebar user={user} />
    </div>
  );
};

export default HRDashboard;
