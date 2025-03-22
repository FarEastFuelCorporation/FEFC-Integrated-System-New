import React, { useState } from "react";
import LandingPageJD from "../OtherComponents/LandingPage";
import EmployeeLoginJD from "./Employee/EmployeeLogin";
import EmployeeSignupJD from "./Employee/EmployeeSignup";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const EmployeeJD = ({ onLogin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(true);

  const toggleSignupForm = () => {
    setShowEmployeeLogin(!showEmployeeLogin);
  };

  return (
    <div className="login-page">
      <LandingPageJD />
      <div className="login-container">
        {showEmployeeLogin ? (
          <EmployeeLoginJD onLogin={onLogin} />
        ) : (
          <EmployeeSignupJD onLogin={onLogin} />
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
          {showEmployeeLogin
            ? "Switch to Employee Sign Up"
            : "Switch to Employee Login"}
        </Typography>
      </div>
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

export default EmployeeJD;
