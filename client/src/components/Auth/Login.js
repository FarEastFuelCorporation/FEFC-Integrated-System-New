// login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("http://localhost:3001/login", {
        employeeId,
        password,
      });

      if (response.data.redirectUrl) {
        navigate(response.data.redirectUrl, {
          state: { employeeDetails: response.data.employeeDetails },
        });
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
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
          <br /><br />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
