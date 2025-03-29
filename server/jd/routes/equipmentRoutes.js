// routes/equipmentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createEquipmentJDController,
  getEquipmentJDsController,
  updateEquipmentJDController,
  deleteEquipmentJDController,
} = require("../controllers/equipmentController");

// Create Equipment route
router.post("/", createEquipmentJDController);

// Get Equipments route
router.get("/", getEquipmentJDsController);

// Update Equipment route
router.put("/:id", updateEquipmentJDController);

// Delete Equipment route
router.delete("/:id", deleteEquipmentJDController);

module.exports = router;
