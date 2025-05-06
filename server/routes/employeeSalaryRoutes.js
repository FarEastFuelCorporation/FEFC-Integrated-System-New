// routes/employeeSalaryRoutes.js

const express = require("express");
const router = express.Router();
const {
  createEmployeeSalaryController,
  getEmployeeSalariesController,
  getEmployeeSalaryController,
  updateEmployeeSalaryController,
  deleteEmployeeSalaryController,
  uploadEmployeeSalaryExcel,
} = require("../controllers/employeeSalaryController");
const upload = require("../middlewares/uploadExcel");

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

// Upload EmployeeSalary route
router.post("/upload", upload.single("file"), uploadEmployeeSalaryExcel);

module.exports = router;
