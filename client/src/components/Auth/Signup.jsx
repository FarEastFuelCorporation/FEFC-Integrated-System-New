import React, { useState } from "react";
import axios from "axios";
import LandingPage from "../LandingPage/LandingPage";

const Signup = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make a POST request to your server to handle user sign-up
      const response = await axios.post("/signup", {
        employeeId,
        password,
      });
      console.log(response.data); // Assuming your server responds with relevant data
      setSuccess(true);
    } catch (error) {
      setError("An error occurred. Please try again.");
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
        {success && <p style={{ color: "green" }}>Sign up successful!</p>}
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
