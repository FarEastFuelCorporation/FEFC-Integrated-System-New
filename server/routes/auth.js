// routes/auth.js

const express = require("express");
const router = express.Router();

const {
  createEmployeeSignupController,
  createEmployeeLoginController,
  createClientSignupController,
  createClientLoginController,
  clientForgotPasswordController,
  sendOTPController,
  createClientUpdateController,
  createEmployeeUpdateController,
} = require("../controllers/authController");

// Create Employee Signup route
router.post("/employeeSignup", createEmployeeSignupController);

// Create Employee Update route
router.post("/employeeUpdate", createEmployeeUpdateController);

// Create Employee Login route
router.post("/employeeLogin", createEmployeeLoginController);

// Create Client Signup route
router.post("/clientSignup", createClientSignupController);

// Create Client Update route
router.post("/clientUpdate", createClientUpdateController);

// Create Client Login route
router.post("/clientLogin", createClientLoginController);

// Client Forgot Password route
router.post("/forgot", clientForgotPasswordController);

// Client Send OTP route
router.post("/sendOtp", sendOTPController);

module.exports = router;
