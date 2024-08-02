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
    if (location.pathname.startsWith("/dashboard")) {
      setLoading(true); // Set loading to true before making the request
      axios
        .get(`${apiUrl}/api/session`, { withCredentials: true })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching session data:", error);
          navigate("/login");
        })
        .finally(() => {
          setLoading(false); // Set loading to false after the request completes (success or error)
        });
    }
  }, [location.pathname, apiUrl, navigate]);

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
          {/* <Route path="/certificate/:id" element={<Certificate />} /> */}
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
