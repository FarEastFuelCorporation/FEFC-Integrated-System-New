import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import LandingPage from "./components/LandingPage";
import MarketingDashboard from "./components/Dashboards/Marketing/MarketingDashboard";

function App() {
  const [theme, colorMode] = useMode();
  const isAuthenticated = true;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              {/* Redirect authenticated user based on role */}
              <Route
                path="/marketingDashboard/*"
                element={<MarketingDashboard />}
              />
              {/* <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/customer/*" element={<CustomerDashboard />} /> */}

              {/* Add more role-specific routes as needed */}

              {/* Redirect to default route if no matching role */}
              {/* <Navigate to="/marketing/dashboard" /> */}
            </>
          ) : (
            // Redirect to login if not authenticated
            <Route to="/" />
          )}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
