import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import {
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import "font-awesome/css/font-awesome.min.css";
import { tokens } from "./theme";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import MarketingRoutes from "./Routes/MarketingRoutes";
import DispatchingRoutes from "./Routes/DispatchingRoutes";
import ReceivingRoutes from "./Routes/ReceivingRoutes";
import HRRoutes from "./Routes/HRRoutes";

import Navbar from "./layouts/Navbar";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Function to update user information after successful login
  const handleLogin = (userData) => {
    setUser(userData);
    navigate(userData.redirectUrl);
    setLoading(false); // Set loading to false after user data is set and navigation is done
  };

  // Function to fetch session data on initial load
  useEffect(() => {
    setLoading(true); // Set loading to true before making the request
    axios
      .get("http://localhost:3001/api/session", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching session data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request completes (success or error)
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999, // Ensure the loading spinner is above other elements
          transition: "opacity 0.3s ease-in-out", // Add a transition for opacity
          opacity: 1, // Initially set opacity to 1 to fade in
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
          }}
        >
          <CircularProgress color="primary" size={64} />
          <Typography
            variant="h6"
            sx={{ mt: 2 }}
            color={colors.greenAccent[500]}
          >
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />} // Pass handleLogin function to Login component
          />
          <Route path="/signup" element={<Signup />} />
          {user ? ( // Render protected routes only if user is authenticated
            <>
              <Route
                path="/marketingDashboard/*"
                element={
                  <RoleProtectedRoute user={user} allowedRoles={[2]}>
                    <MarketingRoutes user={user} />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dispatchingDashboard/*"
                element={
                  <RoleProtectedRoute user={user} allowedRoles={[3]}>
                    <DispatchingRoutes user={user} />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/receivingDashboard/*"
                element={
                  <RoleProtectedRoute user={user} allowedRoles={[4]}>
                    <ReceivingRoutes user={user} />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/hrDashboard/*"
                element={
                  <RoleProtectedRoute user={user} allowedRoles={[9]}>
                    <HRRoutes user={user} />
                  </RoleProtectedRoute>
                }
              />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
