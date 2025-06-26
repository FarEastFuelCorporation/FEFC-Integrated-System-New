// routes/payrollRoutes.js

const express = require("express");
const router = express.Router();
const {
  createPayrollController,
  getPayrollsController,
  getPayrollController,
  updatePayrollController,
  deletePayrollController,
  getPayrollsByPeriodController,
} = require("../controllers/payrollController");

// Create Payroll route
router.post("/", createPayrollController);

// Get Payrolls route
router.get("/", getPayrollsController);

// Get Payrolls By Period route
router.get("/period", getPayrollsByPeriodController);

// Get Payroll route
router.get("/:id", getPayrollController);

// Update Payroll route
router.put("/:id", updatePayrollController);

// Delete Payroll route
router.delete("/:id", deletePayrollController);

module.exports = router;
