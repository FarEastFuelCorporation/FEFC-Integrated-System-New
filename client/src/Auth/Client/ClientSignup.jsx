import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../OtherComponents/LoadingSpinner";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ClientSignup = ({ onLogin }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [clientUsername, setClientUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/; // At least 8 characters
    const hasNumeric = /[0-9]/; // At least 1 numeric character
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/; // At least 1 special character
    const hasUppercase = /[A-Z]/; // At least 1 uppercase letter
    const hasLowercase = /[a-z]/; // At least 1 lowercase letter

    if (!minLength.test(password))
      return "Password must be at least 8 characters long.";
    if (!hasNumeric.test(password))
      return "Password must include at least 1 numeric character.";
    if (!hasSpecial.test(password))
      return "Password must include at least 1 special character.";
    if (!hasUppercase.test(password))
      return "Password must include at least 1 uppercase letter.";
    if (!hasLowercase.test(password))
      return "Password must include at least 1 lowercase letter.";

    return null;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const error = validatePassword(value);
    setPasswordError(error);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (passwordError) {
      setError("Please fix the password errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/clientSignup`,
        { clientId, clientUsername, email, password },
        { withCredentials: true }
      );

      const { user } = response.data;
      onLogin(user); // Update user state in App component
      navigate("/dashboard"); // Redirect user to the specified URL
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 400) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("Network error. Please try again later.");
      } else {
        console.error("Error message:", error.message);
        setError("An error occurred. Please try again.");
      }
      console.error("Error config:", error.config);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoadingSpinner isLoading={loading} />
      <h2>Client Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={submit} disabled={loading}>
        <label htmlFor="clientId">
          Client Id:
          <input
            type="text"
            name="clientId"
            id="clientId"
            required
            autoFocus
            value={clientId}
            autoComplete="off"
            placeholder="Input your Client Id"
            onChange={(e) => setClientId(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="clientUsername">
          Client Username:
          <input
            type="text"
            name="clientUsername"
            id="clientUsername"
            required
            value={clientUsername}
            autoComplete="off"
            placeholder="Input your Client Username"
            onChange={(e) => setClientUsername(e.target.value)}
          />
        </label>
        <label htmlFor="clientUsername">
          Email:
          <input
            type="email"
            name="Email"
            id="Email"
            required
            value={email}
            autoComplete="off"
            placeholder="Input your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <div style={{ position: "relative" }}>
            <input
              type={isVisible ? "text" : "password"}
              name="password"
              id="password"
              required
              value={password}
              autoComplete="off"
              placeholder="Input your Password"
              onChange={handlePasswordChange}
            />
            <FontAwesomeIcon
              icon={isVisible ? faEye : faEyeSlash}
              onClick={handleClick}
              style={{
                position: "absolute",
                right: "20px",
                top: "45%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: colors.primary[500],
                fontSize: 20,
              }}
            />
          </div>
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </label>
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default ClientSignup;
