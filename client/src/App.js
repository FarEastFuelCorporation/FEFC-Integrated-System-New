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
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./OtherComponents/Dashboard";
import LoadingSpinner from "./OtherComponents/LoadingSpinner";
import Certificate from "./OtherComponents/Certificates/Certificate";

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(true); // Start loading as true
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to update user information after successful login
  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard");
    setLoading(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Function to fetch session data when the app loads
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/session`, {
          withCredentials: true,
        });
        console.log("Session data fetched:", response.data);
        setUser(response.data.user); // Set user data from session
      } catch (error) {
        console.error("Error fetching session data:", error);
        // If there is an error (user not logged in), navigate to login
        if (location.pathname.startsWith("/dashboard")) {
          navigate("/login");
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    // Fetch session data only if user is not already set
    if (!user) {
      fetchSessionData();
    } else {
      setLoading(false); // No need to load again if user is already set
    }
  }, [apiUrl, navigate, user, location.pathname]);

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
          <Route path="/certificate/:id" element={<Certificate />} />
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
