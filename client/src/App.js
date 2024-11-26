import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "font-awesome/css/font-awesome.min.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Navbar from "./OtherComponents/Navbar";
import LandingPage from "./OtherComponents/LandingPage";
import Dashboard from "./OtherComponents/Dashboard";
import LoadingSpinner from "./OtherComponents/LoadingSpinner";
import Certificate from "./OtherComponents/Certificates/Certificate";
import QuotationDisplay from "./OtherComponents/Quotations/QuotationDisplay";
import BillingVerify from "./OtherComponents/BillingStatement/BillingVerify";
import VerifyPlasticCredit from "./OtherComponents/Certificates/PlasticCredits/VerifyPlasticCredit";
import VerifyPlasticWasteDiversion from "./OtherComponents/Certificates/PlasticCredits/VerifyPlasticWasteDiversion";
import Attendance from "./OtherComponents/Sections/attendance";
import VerifyTravelOrder from "./Employee/Layouts/Employee/screens/travelOrder/VerifyTravelOrder";
import Client from "./Auth/Client";
import Employee from "./Auth/Employee";

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to update user information after successful login
  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard");
    setLoading(false); // Set loading to false after user data is set and navigation is done
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Function to fetch session data if the current route is "/dashboard"
  useEffect(() => {
    // Only fetch session data if user is not already set
    if (!user && location.pathname.startsWith("/dashboard")) {
      setLoading(true);
      axios
        .get(`${apiUrl}/api/session`, { withCredentials: true })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching session data:", error);
          navigate("/");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.pathname, apiUrl, navigate, user]);

  if (loading) {
    return <LoadingSpinner theme={theme} />;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quotationForm/:id" element={<QuotationDisplay />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/certificate/:id" element={<Certificate />} />
          <Route
            path="/certificate/plasticCredit/:id"
            element={<VerifyPlasticCredit />}
          />
          <Route
            path="/certificate/plasticWasteDiversion/:id"
            element={<VerifyPlasticWasteDiversion />}
          />
          <Route path="/billing/:id" element={<BillingVerify />} />
          <Route
            path="/travelOrderVerify/:id"
            element={<VerifyTravelOrder />}
          />
          <Route path="/client" element={<Client onLogin={handleLogin} />} />
          <Route
            path="/employee"
            element={<Employee onLogin={handleLogin} />}
          />
          {user ? (
            <Route
              path="/dashboard/*"
              element={
                <Dashboard user={user} onUpdateUser={handleUpdateUser} />
              }
            />
          ) : (
            <Route path="" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
