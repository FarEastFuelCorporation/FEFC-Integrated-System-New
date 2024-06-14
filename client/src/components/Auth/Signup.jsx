import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LandingPage from "../LandingPage/LandingPage";

const Signup = () => {
  const history = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        employeeId,
        password,
      });

      if (response.data.success) {
        history("/login");
      } else {
        throw new Error(response.data.error || "Failed to sign up");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LandingPage />
      <div className="login-container">
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={submit} disabled={loading}>
          <label htmlFor="employeeId">
            Employee Id:
            <input
              type="text"
              name="employeeId"
              id="employeeId"
              required
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
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
