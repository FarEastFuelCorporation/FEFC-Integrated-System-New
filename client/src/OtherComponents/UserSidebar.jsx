import React from "react";
import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import GeneratorSidebar from "../Client/Layouts/Generator/GeneratorSidebar";
import MarketingSidebar from "../Employee/Layouts/Marketing/MarketingSidebar";
import DispatchingSidebar from "../Employee/Layouts/Dispatching/DispatchingSidebar";
import ReceivingSidebar from "../Employee/Layouts/Receiving/ReceivingSidebar";
import SortingSidebar from "../Employee/Layouts/Sorting/SortingSidebar";
import TreatmentSidebar from "../Employee/Layouts/Treatment/TreatmentSidebar";
import CertificationSidebar from "../Employee/Layouts/Certification/CertificationSidebar";
import HRSidebar from "../Employee/Layouts/HR/HRSidebar";
import BillingSidebar from "../Employee/Layouts/Billing/BillingSidebar";
import AccountingHeadSidebar from "../Employee/Layouts/AccountingHead/AccountingHeadSidebar";
import CollectionSidebar from "../Employee/Layouts/Collection/CollectionSidebar";
import MessengerSidebar from "../Employee/Layouts/Messenger/MessengerSidebar";
import SafetySidebar from "../Employee/Layouts/Safety/SafetySidebar";
import WarehouseSidebar from "../Employee/Layouts/Warehouse/WarehouseSidebar";
import EmployeeSideBar from "../Employee/Layouts/Employee/EmployeeSideBar";
import LeaderSideBar from "../Employee/Layouts/Leader/LeaderSideBar";
import HealthOfficerSidebar from "../Employee/Layouts/HealthOfficer/HealthOfficerSidebar";
import TransporterSidebar from "../Client/Layouts/Transporter/TransporterSidebar";

const UserSidebar = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let sidebar;

  switch (user.userType) {
    case "GEN":
      sidebar = <GeneratorSidebar user={user} />;
      break;
    case "TRP":
      sidebar = <TransporterSidebar user={user} />;
      break;
    case "IFM":
      sidebar = <GeneratorSidebar user={user} />;
      break;
    case 0:
      sidebar = <LeaderSideBar user={user} />;
      break;
    case 1:
      sidebar = <EmployeeSideBar user={user} />;
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
    case 8:
      sidebar = <BillingSidebar user={user} />;
      break;
    case 9:
      sidebar = <AccountingHeadSidebar user={user} />;
      break;
    case 10:
      sidebar = <MessengerSidebar user={user} />;
      break;
    case 11:
      sidebar = <CollectionSidebar user={user} />;
      break;
    case 14:
      sidebar = <WarehouseSidebar user={user} />;
      break;
    case 21:
      sidebar = <HRSidebar user={user} />;
      break;
    case 22:
      sidebar = <SafetySidebar user={user} />;
      break;
    case 23:
      sidebar = <HealthOfficerSidebar user={user} />;
      break;
    default:
      sidebar = <EmployeeSideBar user={user} />;
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

export default UserSidebar;
