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
import LandingPageJD from "./JD/OtherComponents/LandingPage";
import NavbarJD from "./JD/OtherComponents/Navbar";
import EmployeeJD from "./JD/Auth/Employee";
import DashboardJD from "./JD/OtherComponents/Dashboard";
import TruckScaleView from "./OtherComponents/Certificates/TruckScaleView";
import CommissionVerify from "./OtherComponents/BillingStatement/CommissionVerify";
import DeliveryReceiptView from "./OtherComponents/Certificates/DeliveryReceiptView";

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  // Convert API URL to WebSocket URL
  const wsUrl = apiUrl.replace(/^http/, "ws");

  const [user, setUser] = useState(null); // State to hold user information
  const [socketInstance, setSocketInstance] = useState(null);
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Boolean to check if the URL starts with "/JD"
  const isJDRoute = location.pathname.startsWith("/JD");

  // Function to update user information after successful login
  const handleLogin = (userData) => {
    setUser(userData);
    if (isJDRoute) {
      navigate("/JD/dashboard"); // Redirect to JD dashboard
    } else {
      navigate("/dashboard"); // Redirect to the default dashboard
    }

    setLoading(false); // Set loading to false after user data is set and navigation is done

    // Create WebSocket connection after login
    const socket = new WebSocket(
      `${wsUrl}?employeeId=${userData.id}&employeeName=${userData.employeeDetails.firstName} ${userData.employeeDetails.lastName}`
    );
    setSocketInstance(socket);

    // Listen for messages from the WebSocket server
    socketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      // You can handle incoming messages here (e.g., updating UI)
    };

    // Handle WebSocket connection close
    socketInstance.onclose = () => {
      console.log("WebSocket closed");
    };

    // Handle WebSocket errors
    socketInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up WebSocket connection when user logs out or component unmounts
    return () => {
      socketInstance.close();
    };
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
        {isJDRoute ? <NavbarJD /> : <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quotationForm/:id" element={<QuotationDisplay />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/certificate/:id" element={<Certificate />} />
          <Route path="/truckScaleView/:id" element={<TruckScaleView />} />
          <Route
            path="/deliveryReceiptView/:id"
            element={<DeliveryReceiptView />}
          />
          <Route
            path="/certificate/plasticCredit/:id"
            element={<VerifyPlasticCredit />}
          />
          <Route
            path="/certificate/plasticWasteDiversion/:id"
            element={<VerifyPlasticWasteDiversion />}
          />
          <Route path="/billing/:id" element={<BillingVerify />} />
          <Route path="/commissionVerify/:id" element={<CommissionVerify />} />
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
                <Dashboard
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  socket={socketInstance}
                />
              }
            />
          ) : (
            <Route path="" element={<Navigate to="/login" />} />
          )}

          {/* JD */}
          <Route path="/JD" element={<LandingPageJD />} />
          <Route
            path="/JD/employee"
            element={<EmployeeJD onLogin={handleLogin} />}
          />
          {user ? (
            <Route
              path="/JD/dashboard/*"
              element={
                <DashboardJD
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  socket={socketInstance}
                />
              }
            />
          ) : (
            <Route path="" element={<Navigate to="/JD/employee" />} />
          )}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
