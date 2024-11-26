import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import ClientLogin from "./Client/ClientLogin";
import ClientSignup from "./Client/ClientSignup";

const Client = ({ onLogin }) => {
  const [showClientLogin, setShowClientLogin] = useState(true);

  const toggleLoginForm = () => {
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
        <button className="button-switch" onClick={toggleLoginForm}>
          {showClientLogin
            ? "Switch to Client Sign Up"
            : "Switch to Client Login"}
        </button>
      </div>
    </div>
  );
};

export default Client;
