import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../OtherComponents/LoadingSpinner";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const EmployeeSignup = ({ onLogin }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);

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
        `${apiUrl}/api/employeeSignup`,
        { employeeId, employeeUsername, password },
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

  const handleSignUpSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      if (!employeeId || employeeId.trim() === "") {
        alert("Employee ID is required.");
        return;
      }

      const token = credentialResponse.credential;
      const response = await axios.post(`${apiUrl}/api/employeeSignup/google`, {
        employeeId,
        token,
      });

      const { user } = response.data;
      onLogin(user); // Update user state in App component
      navigate("/dashboard"); // Redirect user to the specified URL
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 401) {
          setError("Invalid username or password");
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

  const toggleGoogleChange = () => {
    setIsGoogle(!isGoogle);
    console.log(isGoogle);
  };

  return (
    <div>
      <LoadingSpinner isLoading={loading} />
      <h2>Employee Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={submit} disabled={loading}>
        <Box
          alignContent={"center"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div>
              <h4
                onClick={toggleGoogleChange}
                style={{
                  textDecoration: "none",
                  color: colors.grey[100],
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {!isGoogle
                  ? "Switch to Sign in with Google"
                  : "Switch to Sign in with Username and Password"}
              </h4>
              {isGoogle && (
                <>
                  <Box mb={2}>
                    <label htmlFor="employeeId">
                      Employee Id:
                      <input
                        type="text"
                        name="employeeId"
                        id="employeeId"
                        required
                        autoFocus
                        value={employeeId}
                        autoComplete="off"
                        placeholder="Input your Employee Id"
                        onChange={(e) => setEmployeeId(e.target.value)}
                      />
                    </label>
                  </Box>
                  <GoogleLogin
                    onSuccess={handleSignUpSuccess}
                    onError={() => console.log("Sign Up Failed")}
                  />
                </>
              )}
            </div>
          </GoogleOAuthProvider>
        </Box>
        {!isGoogle && (
          <>
            <label htmlFor="employeeId">
              Employee Id:
              <input
                type="text"
                name="employeeId"
                id="employeeId"
                required
                autoFocus
                value={employeeId}
                autoComplete="off"
                placeholder="Input your Employee Id"
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="employeeUsername">
              Employee Username:
              <input
                type="text"
                name="employeeUsername"
                id="employeeUsername"
                required
                autoFocus
                value={employeeUsername}
                autoComplete="off"
                placeholder="Input your Employee Username"
                onChange={(e) => setEmployeeUsername(e.target.value)}
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
          </>
        )}
      </form>
    </div>
  );
};

export default EmployeeSignup;
