// controllers/authController.js

const Employee = require("../models/Employee");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee ");
const IdInformation = require("../models/IdInformation");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Example controller function for handling signup
async function postSignupController(req, res) {
  try {
    const { employeeId, password } = req.body;
    // Check if the employeeId is in the Employee table
    const existingEmployee = await Employee.findOne({ where: { employeeId } });

    if (!existingEmployee) {
      // Employee ID is not valid, render the signup page with an error message
      const viewsData = {
        pageTitle: "Sign Up",
        error: "Invalid Employee ID",
      };
      res.render("signup", viewsData);
      return;
    }

    // Check if the employeeId is already registered in the User table
    const existingUser = await User.findOne({ where: { employeeId } });

    if (existingUser) {
      // Employee is already registered, render the signup page with an error message
      const viewsData = {
        pageTitle: "Sign Up",
        error: "Employee is already registered",
      };
      res.render("signup", viewsData);
    } else {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the User table
      const newUser = await User.create({
        employeeId,
        password: hashedPassword,
      });

      // Set session data or other authentication mechanisms if needed

      // Redirect to a dashboard or home page after successful sign-up
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Example controller function for handling login
async function postLoginController(req, res) {
  const { employeeId, password } = req.body;

  try {
    // Find the user with the provided employee ID
    const user = await User.findOne({ where: { employeeId } });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

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
      id: user.employeeId,
      userType: employeeRoles[0].employeeRoleId,
      employeeDetails: employeeDetails,
      employeePicture: employeePicture,
    };

    console.log("Session User:", req.session.user);

    // Determine redirect URL based on userType
    let redirectUrl;
    switch (employeeRoles[0].employeeRoleId) {
      case 2:
        redirectUrl = "/marketingDashboard";
        break;
      case 3:
        redirectUrl = "/dispatchingDashboard";
        break;
      case 4:
        redirectUrl = "/receivingDashboard";
        break;
      case 9:
        redirectUrl = "/hrDashboard";
        break;
      default:
        redirectUrl = "/dashboard"; // Default redirect
        break;
    }

    // Respond with redirect URL and session details
    res.status(200).json({
      redirectUrl,
      user: {
        id: user.employeeId,
        userType: employeeRoles[0].employeeRoleId,
        employeeDetails: employeeDetails,
        employeePicture: employeePicture,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  postLoginController,
  postSignupController,
};
