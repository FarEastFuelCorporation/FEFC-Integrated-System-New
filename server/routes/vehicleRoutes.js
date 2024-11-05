// routes/vehicleRoutes.js

const express = require("express");
const router = express.Router();
const {
  createVehicleController,
  getVehiclesController,
  getVehicleController,
  getVehiclesByVehicleTypeIdController,
  updateVehicleController,
  deleteVehicleController,
} = require("../controllers/vehicleController");

// Create Vehicle route
router.post("/", createVehicleController);

// Get Vehicles route
router.get("/", getVehiclesController);

// Get Vehicle route
router.get("/", getVehicleController);

// Get Vehicle by vehicleTypeId route
router.get("/vehicleType/:id", getVehiclesByVehicleTypeIdController);

// Update Vehicle route
router.put("/:id", updateVehicleController);

// Delete Vehicle route
router.delete("/:id", deleteVehicleController);

module.exports = router;
