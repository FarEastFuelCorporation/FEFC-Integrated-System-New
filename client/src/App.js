// App.js
import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import MarketingDashboard from "./layouts/Marketing/MarketingDashboard";
import MarketingSection1 from "./layouts/Marketing/sections/Section1";
import MarketingSection2 from "./layouts/Marketing/sections/Section2";
import DispatchingDashboard from "./layouts/Dispatching/DispatchingDashboard";
import DispatchingSection1 from "./layouts/Dispatching/sections/Section1";
import DispatchingSection2 from "./layouts/Dispatching/sections/Section2";
import ReceivingDashboard from "./layouts/Receiving/ReceivingDashboard";
import ReceivingSection1 from "./layouts/Receiving/sections/Section1";
import ReceivingSection2 from "./layouts/Receiving/sections/Section2";
import HRDashboard from "./layouts/HR/HRDashboard";
import HRSection1 from "./layouts/HR/sections/Section1";
import HRSection2 from "./layouts/HR/sections/Section2";

const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/marketingDashboard" element={<MarketingDashboard />} />
          <Route path="/marketing/section1" element={<MarketingSection1 />} />
          <Route path="/marketing/section2" element={<MarketingSection2 />} />
          <Route
            path="/dispatchingDashboard/*"
            element={<DispatchingDashboard />}
          />
          <Route
            path="/dispatching/section1"
            element={<DispatchingSection1 />}
          />
          <Route
            path="/dispatching/section2"
            element={<DispatchingSection2 />}
          />
          <Route
            path="/receivingDashboard/*"
            element={<ReceivingDashboard />}
          />
          <Route path="/receiving/section1" element={<ReceivingSection1 />} />
          <Route path="/receiving/section2" element={<ReceivingSection2 />} />
          <Route path="/hrDashboard/*" element={<HRDashboard />} />
          <Route path="/hr/section1" element={<HRSection1 />} />
          <Route path="/hr/section2" element={<HRSection2 />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
