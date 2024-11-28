import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import EmployeeSignup from "./Employee/EmployeeSignup";
import EmployeeLogin from "./Employee/EmployeeLogin";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Employee = ({ onLogin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(true);

  const toggleSignupForm = () => {
    setShowEmployeeLogin(!showEmployeeLogin);
  };

  return (
    <div className="login-page">
      <LandingPage />
      <div className="login-container">
        {showEmployeeLogin ? (
          <EmployeeLogin onLogin={onLogin} />
        ) : (
          <EmployeeSignup onLogin={onLogin} />
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
    </div>
  );
};

export default Employee;
