// routes/vehicleRoutes.js

const express = require("express");
const router = express.Router();
const {
  createVehicleController,
  getVehiclesController,
  updateVehicleController,
  deleteVehicleController,
} = require("../controllers/vehicleController");

// Create Vehicle route
router.post("/", createVehicleController);

// Get Vehicles route
router.get("/", getVehiclesController);

// Update Vehicle Type route
router.put("/:id", updateVehicleController);

// Delete Vehicle Type route
router.delete("/:id", deleteVehicleController);

module.exports = router;
