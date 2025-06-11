// routes/departmentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createDepartmentController,
  getDepartmentsController,
  updateDepartmentController,
  deleteDepartmentController,
  getDepartmentEmployeeCountController,
} = require("../controllers/departmentController");

// Create Department route
router.post("/", createDepartmentController);

// Get Department route
router.get("/", getDepartmentsController);

// Get Department route
router.get("/count", getDepartmentEmployeeCountController);

// Update Department route
router.put("/:id", updateDepartmentController);

// Delete Department route
router.delete("/:id", deleteDepartmentController);

module.exports = router;
