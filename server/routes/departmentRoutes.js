// routes/departmentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createDepartmentController,
  getDepartmentsController,
  updateDepartmentController,
  deleteDepartmentController,
} = require("../controllers/departmentController");

// Create Dispatched Transaction route
router.post("/", createDepartmentController);

// Get Dispatched Transactions route
router.get("/", getDepartmentsController);

// Update Dispatched Transaction route
router.put("/:id", updateDepartmentController);

// Delete Dispatched Transaction route
router.delete("/:id", deleteDepartmentController);

module.exports = router;
