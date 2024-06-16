// controllers/dispatchingDashboardControllers.js

require("dotenv").config();
const { Op, Sequelize } = require("sequelize");
const Employee = require("../models/Employee");

// Dashboard controller
async function getEmployeeRecords(req, res) {
  try {
    const employeeRecords = await Employee.findAll();

    res.json(employeeRecords);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getEmployeeRecords,
};
