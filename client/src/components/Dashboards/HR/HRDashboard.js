// components/Dashboards/HR/HRDashboard.js

import React, { useState } from "react";
import { ColorModeContext, useMode } from "../../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "../../Topbar";
import HRSidebar from "./HRSidebar";
import Dashboard from "./scenes/dashboard";
// import Dashboard from "../dashboard";
// import Team from "../team";
// import Contacts from "../contacts";
// import Invoices from "../invoices";
// import Form from "../form";
// import Calendar from "../calendar";
// import FAQ from "../faq";
// import Bar from "../bar";
// import Pie from "../pie";
// import Line from "../line";
// import Geography from "../geography";

function HRDashboard() {
  const location = useLocation();
  const employeeDetails = location.state?.employeeDetails;

  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`app ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <HRSidebar
            onToggle={handleSidebarToggle}
            employeeDetails={employeeDetails}
          />
          <main className="content">
            <Topbar />
            <Routes>
              <Route index element={<Dashboard />} />
              {/* <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/geography" element={<Geography />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default HRDashboard;
