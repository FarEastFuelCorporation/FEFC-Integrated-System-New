import React from "react";
import { Outlet } from "react-router-dom";
import GeneratorSidebar from "../Client/Layouts/Generator/GeneratorSidebar";
import MarketingSidebar from "../Employee/Layouts/Marketing/MarketingSidebar";
import DispatchingSidebar from "../Employee/Layouts/Dispatching/DispatchingSidebar";
import ReceivingSidebar from "../Employee/Layouts/Receiving/ReceivingSidebar";
import SortingSidebar from "../Employee/Layouts/Sorting/SortingSidebar";
import TreatmentSidebar from "../Employee/Layouts/Treatment/TreatmentSidebar";
import CertificationSidebar from "../Employee/Layouts/Certification/CertificationSidebar";
import HRSidebar from "../Employee/Layouts/HR/HRSidebar";

const UserDashboard = ({ user }) => {
  let sidebar;
  switch (user.userType) {
    case "GEN":
    case "TRP":
    case "IFM":
      sidebar = <GeneratorSidebar user={user} />;
      break;
    case 2:
      sidebar = <MarketingSidebar user={user} />;
      break;
    case 3:
      sidebar = <DispatchingSidebar user={user} />;
      break;
    case 4:
      sidebar = <ReceivingSidebar user={user} />;
      break;
    case 5:
      sidebar = <SortingSidebar user={user} />;
      break;
    case 6:
      sidebar = <TreatmentSidebar user={user} />;
      break;
    case 7:
      sidebar = <CertificationSidebar user={user} />;
      break;
    case 9:
      sidebar = <HRSidebar user={user} />;
      break;
    default:
      sidebar = <MarketingSidebar user={user} />;
  }

  return (
    <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
      <div>{sidebar}</div>
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

export default UserDashboard;
