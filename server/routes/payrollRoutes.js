// routes/payrollRoutes.js

const express = require("express");
const router = express.Router();
const {
  createPayrollController,
  getPayrollsController,
  getPayrollController,
  updatePayrollController,
  deletePayrollController,
} = require("../controllers/payrollController");

// Create Payroll route
router.post("/", createPayrollController);

// Get Payrolls route
router.get("/", getPayrollsController);

// Get Payroll route
router.get("/:id", getPayrollController);

// Update Payroll route
router.put("/:id", updatePayrollController);

// Delete Payroll route
router.delete("/:id", deletePayrollController);

module.exports = router;
