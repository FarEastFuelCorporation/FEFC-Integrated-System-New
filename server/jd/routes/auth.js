// routes/auth.js

const express = require("express");
const router = express.Router();

const {
  createEmployeeSignupController,
  createEmployeeLoginController,
  createEmployeeUpdateController,
  sendOTPController,
} = require("../controllers/authController");
const { logoutController } = require("../controllers/authController");

// Create Employee Signup route
router.post("/employeeSignup", createEmployeeSignupController);

// Create Employee Update route
router.post("/employeeUpdate", createEmployeeUpdateController);

// Create Employee Login route
router.post("/employeeLogin", createEmployeeLoginController);

// Client Send OTP route
router.post("/sendOtp", sendOTPController);

router.get("/logout", logoutController);

module.exports = router;
