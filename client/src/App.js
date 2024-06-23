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

import Navbar from "./OtherComponents/Navbar";
import LandingPage from "./OtherComponents/LandingPage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./OtherComponents/Dashboard";

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Function to update user information after successful login
  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard");
    setLoading(false); // Set loading to false after user data is set and navigation is done
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Function to fetch session data on initial load
  useEffect(() => {
    setLoading(true); // Set loading to true before making the request
    axios
      .get(`${apiUrl}/api/session`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching session data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request completes (success or error)
      });
  }, [apiUrl]);

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
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
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
