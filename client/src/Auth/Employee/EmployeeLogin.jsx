import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../OtherComponents/LoadingSpinner";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const EmployeeLogin = ({ onLogin }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isTimer, setIsTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [verified, setIsVerified] = useState(false);

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

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/employeeLogin`,
        { employeeUsername, password },
        { withCredentials: true }
      );

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

  const sendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/sendOtp`,
        { email },
        { withCredentials: true }
      );

      const { otp } = response.data;
      setGeneratedOtp(otp);
      setIsTimer(true);
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 401) {
          setError("Invalid client ID or password");
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

  // Start the timer
  const startTimer = (initialTime) => {
    setIsTimer(true);
    setTimer(initialTime);

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId); // Stop the timer when it reaches 0
          setIsTimer(false);
          setGeneratedOtp("");
          return 0; // Ensure the timer doesn't go below 0
        }
        return prevTimer - 1; // Decrease the timer by 1 each second
      });
    }, 1000); // Update every 1000 ms (1 second)
  };

  // Example to start the timer with 60 seconds (you can customize this value)
  useEffect(() => {
    if (isTimer) {
      startTimer(99); // Start timer with 60 seconds
    }
  }, [isTimer]);

  const verifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true); // Start loading
      setError(""); // Clear any existing error

      if (generatedOtp === otp) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
        setError("OTP did not match");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const submitForgotPassword = async (e) => {
    e.preventDefault();
    if (passwordError) {
      setError("Please fix the password errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/employeeUpdate`,
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

  // To calculate the progress as a percentage
  const progress = (timer / 99) * 100; // Assuming 10 seconds as total time

  // Determine color based on time left
  let colorProgress = "green"; // Default color (green)
  if (progress <= 50) {
    colorProgress = "yellow"; // Yellow color for timer <= 90
  }
  if (progress <= 25) {
    colorProgress = "red"; // Red color for timer <= 45
  }

  return (
    <div>
      <LoadingSpinner isLoading={loading} />
      <h2>
        {!verified
          ? isLogin
            ? "Employee Login"
            : "Forgot Password"
          : "Verified"}
      </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Login */}
      {isLogin && !verified && (
        <form onSubmit={submit} disabled={loading}>
          <label htmlFor="employeeUsername">
            Username:
            <input
              type="text"
              name="employeeUsername"
              id="employeeUsername"
              required
              autoFocus
              value={employeeUsername}
              autoComplete="off"
              placeholder="Input your Username"
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
                onChange={(e) => setPassword(e.target.value)}
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
          </label>

          <Typography
            onClick={() => setIsLogin(false)}
            style={{
              textAlign: "right",
              textDecoration: "none",
              color: colors.grey[100],
              cursor: "pointer",
            }}
          >
            Forgot Username or Password
          </Typography>

          <br />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}
      {/* Forgot Password */}
      {!isLogin && !verified && (
        <form onSubmit={submit} disabled={loading}>
          <label htmlFor="employeeId">
            Employee ID:
            <input
              type="text"
              name="employeeId"
              id="employeeId"
              required
              autoFocus
              value={employeeId}
              autoComplete="off"
              placeholder="Input your Employee ID"
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </label>
          <br />
          <label htmlFor="email">
            Email:
            <div style={{ position: "relative" }}>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                autoComplete="off"
                placeholder="Input your Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          {isTimer ? (
            <Box position="relative" sx={{ height: 30 }}>
              <CircularProgress
                variant="determinate"
                value={progress}
                size={30} // Set the size of the circle
                thickness={4} // Set the thickness of the circle
                sx={{
                  color: colorProgress, // Use the greenAccent[300] color from the tokens
                  position: "absolute",
                  right: "20px",
                }}
              />
              <Box
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "19px",
                  transform: "translate(-50%, -50%)",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {timer.toString().padStart(2, "0")}
                </Typography>
              </Box>
              {/* Display the timer in the center */}
            </Box>
          ) : (
            <Typography
              onClick={() => sendOtp()}
              style={{
                textAlign: "right",
                textDecoration: "none",
                color: colors.grey[100],
                cursor: "pointer",
              }}
            >
              Send OTP
            </Typography>
          )}

          <label htmlFor="otp">
            OTP:
            <div style={{ position: "relative" }}>
              <input
                type="text"
                name="otp"
                id="otp"
                required
                value={otp}
                autoComplete="off"
                placeholder="Input your OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </label>

          <button type="button" onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <br />
          <br />
          <Typography
            onClick={() => setIsLogin(true)}
            style={{
              textAlign: "right",
              textDecoration: "none",
              color: colors.grey[100],
              cursor: "pointer",
            }}
          >
            Back to Login
          </Typography>
        </form>
      )}

      {verified && (
        <form onSubmit={submitForgotPassword} disabled={loading}>
          <Box style={{ display: "none" }}>
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
              />
            </label>
          </Box>
          <label htmlFor="employeeUsername">
            Employee Username:
            <input
              type="text"
              name="employeeUsername"
              id="employeeUsername"
              required
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
                icon={isVisible ? faEyeSlash : faEye}
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
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmployeeLogin;
