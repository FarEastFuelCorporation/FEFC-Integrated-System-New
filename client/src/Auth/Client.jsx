import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import ClientLogin from "./Client/ClientLogin";
import ClientSignup from "./Client/ClientSignup";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Client = ({ onLogin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showClientLogin, setShowClientLogin] = useState(true);

  const toggleSignupForm = () => {
    setShowClientLogin(!showClientLogin);
  };

  return (
    <div className="login-page">
      <LandingPage />
      <div className="login-container">
        {showClientLogin ? (
          <ClientLogin onLogin={onLogin} />
        ) : (
          <ClientSignup onLogin={onLogin} />
        )}
        <br />
        <Typography
          onClick={toggleSignupForm}
          style={{
            textAlign: "right",
            textDecoration: "none",
            color: colors.grey[100],
            cursor: "pointer",
          }}
        >
          {showClientLogin
            ? "Switch to Client Sign Up"
            : "Switch to Client Login"}
        </Typography>
      </div>
      {/* Footer Section */}
      <Box textAlign="center" mt="auto" mb={2} p={2}>
        <Typography variant="h5" color={colors.grey[100]}>
          Powered by <strong>JIM'S INTEGRATION</strong>
        </Typography>
        <Typography variant="h5" color={colors.grey[100]}>
          <i>jimsintegration@gmail.com</i>
        </Typography>
      </Box>
    </div>
  );
};

export default Client;
