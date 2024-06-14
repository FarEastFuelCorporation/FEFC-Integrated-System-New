import React from "react";
import MarketingSidebar from "./MarketingSidebar";

const MarketingDashboard = ({ user }) => {
  return (
    <div>
      <MarketingSidebar user={user} />
    </div>
  );
};

export default MarketingDashboard;
