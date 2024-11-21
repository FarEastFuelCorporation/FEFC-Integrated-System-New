// routes/medicineRoutes.js

const express = require("express");
const router = express.Router();
const {
  createMedicineController,
  getMedicinesController,
  getMedicinesQuantityController,
  updateMedicineController,
  deleteMedicineController,
} = require("../controllers/medicineController");

// Create Medicine route
router.post("/", createMedicineController);

// Get Medicine route
router.get("/", getMedicinesController);

// Get Medicine route
router.get("/quantity", getMedicinesQuantityController);

// Update Medicine route
router.put("/:id", updateMedicineController);

// Delete Medicine route
router.delete("/:id", deleteMedicineController);

module.exports = router;
