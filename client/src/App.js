import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

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
import Dashboard from "./layouts/HR/sections/dashboard";
import Team from "./layouts/HR/sections/team";
import Contacts from "./layouts/HR/sections/contacts";
import Invoices from "./layouts/HR/sections/team";
import Form from "./layouts/HR/sections/form";
import Calendar from "./layouts/HR/sections/calendar";
import FAQ from "./layouts/HR/sections/faq";
import Bar from "./layouts/HR/sections/bar";
import Pie from "./layouts/HR/sections/pie";
import Line from "./layouts/HR/sections/line";
import Geography from "./layouts/HR/sections/geography";

const App = () => {
  const [theme, colorMode] = useMode();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const checkAuthentication = async () => {
    try {
      const response = await axios.get("http://localhost:3001/check-auth", {
        withCredentials: true,
      });
      if (response.data.authenticated) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const privatePaths = [
      "/marketingDashboard",
      "/dispatchingDashboard",
      "/receivingDashboard",
      "/hrDashboard",
      "/hrDashboard/team",
    ];

    if (privatePaths.includes(location.pathname)) {
      checkAuthentication();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/marketingDashboard"
            element={
              authenticated ? <MarketingDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/marketingDashboard/section1"
            element={
              authenticated ? <MarketingSection1 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/marketingDashboard/section2"
            element={
              authenticated ? <MarketingSection2 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dispatchingDashboard"
            element={
              authenticated ? (
                <DispatchingDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dispatchingDashboard/section1"
            element={
              authenticated ? <DispatchingSection1 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dispatchingDashboard/section2"
            element={
              authenticated ? <DispatchingSection2 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/receivingDashboard"
            element={
              authenticated ? <ReceivingDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/receivingDashboard/section1"
            element={
              authenticated ? <ReceivingSection1 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/receivingDashboard/section2"
            element={
              authenticated ? <ReceivingSection2 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/hrDashboard"
            element={authenticated ? <HRDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard"
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/team"
            element={authenticated ? <Team /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/contacts"
            element={authenticated ? <Contacts /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/invoices"
            element={authenticated ? <Invoices /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/form"
            element={authenticated ? <Form /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/calendar"
            element={authenticated ? <Calendar /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/faq"
            element={authenticated ? <FAQ /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/bar"
            element={authenticated ? <Bar /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/pie"
            element={authenticated ? <Pie /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/line"
            element={authenticated ? <Line /> : <Navigate to="/login" />}
          />
          <Route
            path="/hrDashboard/geography"
            element={authenticated ? <Geography /> : <Navigate to="/login" />}
          />
          {/* Fallback route when no match is found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
