import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import EmployeeSignup from "./Employee/EmployeeSignup";
import EmployeeLogin from "./Employee/EmployeeLogin";

const Employee = ({ onLogin }) => {
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
        <button className="button-switch" onClick={toggleSignupForm}>
          {showEmployeeLogin
            ? "Switch to Employee Sign Up"
            : "Switch to Employee Login"}
        </button>
      </div>
    </div>
  );
};

export default Employee;
