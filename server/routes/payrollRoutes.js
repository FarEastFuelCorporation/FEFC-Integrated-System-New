// routes/payrollRoutes.js

const express = require("express");
const router = express.Router();
const {
  createEmployeeSalaryController,
  getEmployeeSalariesController,
  getEmployeeSalaryController,
  updateEmployeeSalaryController,
  deleteEmployeeSalaryController,
} = require("../controllers/payrollRoutes");

// Create EmployeeSalary route
router.post("/", createEmployeeSalaryController);

// Get EmployeeSalaries route
router.get("/", getEmployeeSalariesController);

// Get EmployeeSalary route
router.get("/:id", getEmployeeSalaryController);

// Update EmployeeSalary route
router.put("/:id", updateEmployeeSalaryController);

// Delete EmployeeSalary route
router.delete("/:id", deleteEmployeeSalaryController);

module.exports = router;
