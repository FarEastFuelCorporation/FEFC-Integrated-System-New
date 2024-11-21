// routes/medicineLogRoutes.js

const express = require("express");
const router = express.Router();
const {
  createMedicineController,
  getMedicinesController,
  updateMedicineController,
  deleteMedicineController,
} = require("../controllers/medicineLogController");

// Create Medicine route
router.post("/", createMedicineController);

// Get Medicine route
router.get("/", getMedicinesController);

// Update Medicine route
router.put("/:id", updateMedicineController);

// Delete Medicine route
router.delete("/:id", deleteMedicineController);

module.exports = router;
