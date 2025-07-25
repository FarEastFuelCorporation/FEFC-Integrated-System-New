// controllers/authController.js

const Client = require("../models/Client");
const ClientUser = require("../models/ClientUser");
const Employee = require("../models/Employee");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee");
const IdInformation = require("../models/IdInformation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const { sendOtpFormat } = require("../utils/emailFormat");
const sendEmail = require("../sendEmail");
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Create Employee Signup controller
async function createEmployeeSignupController(req, res) {
  try {
    const { employeeId, employeeUsername, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingEmployee = await Employee.findOne({
      where: {
        employeeId,
        employeeStatus: "ACTIVE",
      },
    });

    if (!existingEmployee) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingUser = await User.findOne({
      where: { employeeId, isGoogle: false },
    });

    if (existingUser) {
      // Employee is already registered, send an error response
      return res.status(400).json({ error: "Employee is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the User table
    const newUser = await User.create({
      employeeId,
      employeeUsername,
      password: hashedPassword,
      isGoogle: false,
    });

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

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

// Create Employee Signup Google controller
async function createEmployeeSignupGoogleController(req, res) {
  try {
    const { employeeId, token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email } = payload;

    // Check if the employeeId is in the Employee table
    const existingEmployee = await Employee.findOne({
      where: {
        employeeId,
        employeeStatus: "ACTIVE",
      },
    });

    if (!existingEmployee) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingUser = await User.findOne({
      where: { employeeId, isGoogle: true },
    });

    if (existingUser) {
      // Employee is already registered, send an error response
      return res.status(400).json({ error: "Employee is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(googleId, 10);

    // Create a new user in the User table
    const newUser = await User.create({
      employeeId,
      employeeUsername: email,
      password: hashedPassword,
      isGoogle: true,
    });

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

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
    const existingEmployee = await Employee.findOne({
      where: {
        employeeId,
        employeeStatus: "ACTIVE",
      },
    });

    if (!existingEmployee) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingEmployeeUser = await User.findOne({
      where: { employeeId },
    });

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    existingEmployeeUser.employeeUsername = employeeUsername;
    existingEmployeeUser.password = hashedPassword;

    await existingEmployeeUser.save();

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

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
    const user = await User.findOne({
      where: { employeeUsername },
      include: [
        {
          model: Employee,
          as: "Employee",
          where: { employeeStatus: "ACTIVE" }, // Filter for active employees
        },
      ],
    });

    const employeeId = user?.employeeId;

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
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    // let employeePicture;

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

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

// Create Employee Login Google controller
async function createEmployeeLoginGoogleController(req, res) {
  const { token } = req.body;
  console.log("pass");
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email } = payload;

    // Find the user with the provided employee ID
    const user = await User.findOne({
      where: { employeeUsername: email },
      include: [
        {
          model: Employee,
          as: "Employee",
          where: { employeeStatus: "ACTIVE" }, // Filter for active employees
        },
      ],
    });

    const employeeId = user?.employeeId;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(googleId, user.password);
    // const passwordMatch = true;
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    // Determine the userType, defaulting to 1 if no roles are found
    const userType =
      employeeRoles.length > 0 ? employeeRoles[0].employeeRoleId : 1;

    const role = employeeRoles.length > 0 ? "employee" : "defaultRole";

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    // let employeePicture;

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

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

// Create Client Signup controller
async function createClientSignupController(req, res) {
  try {
    const { clientId, clientUsername, email, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingClient = await Client.findOne({ where: { clientId } });

    if (!existingClient) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Client ID" });
    }

    // Concatenate if email exists, otherwise assign the new email
    existingClient.email = existingClient.email
      ? `${existingClient.email}, ${email}`
      : email;

    await existingClient.save();

    // // Check if the employeeId is already registered in the User table
    // const existingClientUser = await ClientUser.findOne({
    //   where: { clientId },
    // });

    // if (existingClientUser) {
    //   // Employee is already registered, send an error response
    //   return res.status(400).json({ error: "Client is already registered" });
    // }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the User table
    const newUser = await ClientUser.create({
      clientId,
      clientUsername,
      password: hashedPassword,
    });

    const clientDetails = await Client.findOne({
      where: { clientId },
    });

    const clientRole = clientId.substring(0, 3);

    // Set session data
    req.session.user = {
      id: newUser.clientId,
      userType: clientRole,
      clientDetails: clientDetails,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: newUser.clientId,
        userType: clientRole,
        clientDetails: clientDetails,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Client Update controller
async function createClientUpdateController(req, res) {
  try {
    const { clientId, clientUsername, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingClient = await Client.findOne({ where: { clientId } });

    if (!existingClient) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Client ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingClientUser = await ClientUser.findOne({
      where: { clientId },
    });

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    existingClientUser.clientUsername = clientUsername;
    existingClientUser.password = hashedPassword;

    await existingClientUser.save();

    const clientDetails = await Client.findOne({
      where: { clientId },
    });

    const clientRole = clientId.substring(0, 3);

    // Set session data
    req.session.user = {
      id: clientId,
      userType: clientRole,
      clientDetails: clientDetails,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: clientId,
        userType: clientRole,
        clientDetails: clientDetails,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Client Login controller
async function createClientLoginController(req, res) {
  const { clientUsername, password } = req.body;

  try {
    // Find the user with the provided employee ID
    const user = await ClientUser.findOne({ where: { clientUsername } });
    const clientId = user.clientId;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = true;
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    const clientDetails = await Client.findOne({
      where: { clientId },
    });

    const clientRole = clientId.substring(0, 3);

    // Set session data
    req.session.user = {
      id: user.clientId,
      userType: clientRole,
      clientDetails: clientDetails,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: user.clientId,
        userType: clientRole,
        clientDetails: clientDetails,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Client Forgot Password controller
async function clientForgotPasswordController(req, res) {
  const { clientUsername, password } = req.body;

  try {
    // Find the user with the provided employee ID
    const user = await ClientUser.findOne({ where: { clientUsername } });
    const clientId = user.clientId;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    const clientDetails = await Client.findOne({
      where: { clientId },
    });

    const clientRole = clientId.substring(0, 3);

    // Set session data
    req.session.user = {
      id: user.clientId,
      userType: clientRole,
      clientDetails: clientDetails,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: user.clientId,
        userType: clientRole,
        clientDetails: clientDetails,
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

module.exports = {
  createEmployeeSignupController,
  createEmployeeSignupGoogleController,
  createEmployeeUpdateController,
  createEmployeeLoginController,
  createEmployeeLoginGoogleController,
  createClientSignupController,
  createClientUpdateController,
  createClientLoginController,
  clientForgotPasswordController,
  sendOTPController,
};
