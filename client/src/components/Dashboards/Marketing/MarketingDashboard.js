// // components/Dashboards/Marketing/MarketingDashboard.js
// import React from 'react';
// import { Route, Routes  } from 'react-router-dom';
// import MarketingSidebar from './MarketingSidebar';
// import { getUser } from '../../../auth';

// const MarketingHome = () => <div>Welcome to the Marketing Dashboard, {getUser().username}!</div>;
// const MarketingSection1 = () => <div>Marketing Section 1 Content</div>;
// const MarketingSection2 = () => <div>Marketing Section 2 Content</div>;

// const MarketingDashboard = () => {
//     return (
//         <div className="dashboard">
//             <MarketingSidebar />
//             <div className="content">
//                 <Routes >
//                     <Route exact path="/marketingDashboard/home" component={MarketingHome} />
//                     <Route path="/marketingDashboard/section1" component={MarketingSection1} />
//                     <Route path="/marketingDashboard/section2" component={MarketingSection2} />
//                 </Routes>
//             </div>
//         </div>
//     );
// };

// export default MarketingDashboard;


import React, { useState } from "react";
import { ColorModeContext, useMode } from "../../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "../../Topbar";
import ReceivingSidebar from "../Receiving/ReceivingSidebar";
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

function MarketingDashboard() {
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
          <ReceivingSidebar
            onToggle={handleSidebarToggle}
            employeeDetails={employeeDetails}
          />
          <main className="content">
            <Topbar />
            <Routes>
              {/* <Route index element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
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

export default MarketingDashboard;
