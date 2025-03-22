// controllers/authController.js

const EmployeeJD = require("../models/Employee");
const EmployeeRolesEmployeeJD = require("../models/EmployeeRolesEmployee");
const UserJD = require("../models/User");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const { sendOtpFormat } = require("../utils/emailFormat");
const sendEmail = require("../sendEmail");

// Create Employee Signup controller
async function createEmployeeSignupController(req, res) {
  try {
    const { employeeId, employeeUsername, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingEmployee = await EmployeeJD.findOne({
      where: { employeeId },
    });

    if (!existingEmployee) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingUser = await UserJD.findOne({ where: { employeeId } });

    if (existingUser) {
      // Employee is already registered, send an error response
      return res.status(400).json({ error: "Employee is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the User table
    const newUser = await UserJD.create({
      employeeId,
      employeeUsername,
      password: hashedPassword,
    });

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployeeJD.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await EmployeeJD.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "designation",
        "profile_picture",
      ],
    });

    const employeePicture = await employeeDetails.profile_picture;

    // Set session data
    req.session.user = {
      id: newUser.employeeId,
      userType: userType,
      role: role,
      employeeDetails: employeeDetails,
      employeePicture: employeePicture,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: newUser.employeeId,
        userType: userType,
        role: role,
        employeeDetails: employeeDetails,
        employeePicture: employeePicture,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Employee Update controller
async function createEmployeeUpdateController(req, res) {
  try {
    const { employeeId, employeeUsername, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingEmployee = await EmployeeJD.findOne({
      where: { employeeId },
    });

    if (!existingEmployee) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingEmployeeUser = await UserJD.findOne({
      where: { employeeId },
    });

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    existingEmployeeUser.employeeUsername = employeeUsername;
    existingEmployeeUser.password = hashedPassword;

    await existingEmployeeUser.save();

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployeeJD.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await EmployeeJD.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "designation",
        "profile_picture",
      ],
    });

    const employeePicture = await employeeDetails.profile_picture;

    // Set session data
    req.session.user = {
      id: employeeId,
      userType: userType,
      role: role,
      employeeDetails: employeeDetails,
      employeePicture: employeePicture,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: employeeId,
        userType: userType,
        role: role,
        employeeDetails: employeeDetails,
        employeePicture: employeePicture,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Employee Login controller
async function createEmployeeLoginController(req, res) {
  const { employeeUsername, password } = req.body;
  console.log("pass");
  try {
    // Find the user with the provided employee ID
    const user = await UserJD.findOne({ where: { employeeUsername } });
    const employeeId = user.employeeId;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    // const passwordMatch = true;
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployeeJD.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await EmployeeJD.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "designation",
        "profile_picture",
      ],
    });

    // let employeePicture;

    const employeePicture = employeeDetails.profile_picture;

    // Set session data
    req.session.user = {
      id: user.employeeId,
      userType: userType,
      role: role,
      employeeDetails: employeeDetails,
      employeePicture: employeePicture,
    };

    console.log(req.session.user);

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: user.employeeId,
        userType: userType,
        role: role,
        employeeDetails: employeeDetails,
        employeePicture: employeePicture,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Send OTP controller
async function sendOTPController(req, res) {
  const { email } = req.body;

  try {
    const otp = generateOtp();

    const emailBody = await sendOtpFormat(otp);

    console.log(emailBody);

    try {
      sendEmail(
        email, // Recipient
        `OTP Verification`, // Subject
        "Please use the OTP to verify your identity", // Plain-text fallback
        emailBody // HTML content
      ).catch((emailError) => {
        console.error("Error sending email:", emailError);
      });
    } catch (error) {
      console.error("Unexpected error when sending email:", error);
    }

    res.status(201).json({
      otp,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function logoutController(req, res) {
  try {
    console.log(req.session);

    let route = "/JD/employee";

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Clear the cookie
        res.clearCookie("connect.sid", { path: "/" });

        // Prevent caching
        res.setHeader("Cache-Control", "no-store");

        // Redirect to the login page after successful logout
        res.status(200).json({ route });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function error404Controller(req, res, next) {
  res.status(404).send("404 Not Found");
}

module.exports = {
  createEmployeeSignupController,
  createEmployeeUpdateController,
  createEmployeeLoginController,
  sendOTPController,
  logoutController,
  error404Controller,
};
