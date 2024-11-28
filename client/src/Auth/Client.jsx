import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import ClientLogin from "./Client/ClientLogin";
import ClientSignup from "./Client/ClientSignup";
import { Typography, useTheme } from "@mui/material";
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
    </div>
  );
};

export default Client;
