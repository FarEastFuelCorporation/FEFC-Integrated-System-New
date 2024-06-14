import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LandingPage from "../LandingPage/LandingPage";

const Login = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        { employeeId, password },
        { withCredentials: true }
      );

      console.log("Server response:", response.data); // Log the server response

      if (response.data.redirectUrl) {
        console.log("Redirecting to:", response.data.redirectUrl); // Log the redirection URL
        navigate(response.data.redirectUrl); // Redirect user to the specified URL
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 401) {
          setError("Invalid employee ID or password");
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
    <div className="login-page">
      <LandingPage />
      <div className="login-container">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={submit} disabled={loading}>
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
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              id="password"
              required
              value={password}
              autoComplete="off"
              placeholder="Input your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
