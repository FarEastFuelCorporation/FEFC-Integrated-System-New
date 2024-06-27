// routes/dispatching_dashboard.js

const express = require("express");
const {
  getVehicleTypesController,
  createVehicleTypeController,
  updateVehicleTypeController,
  deleteVehicleTypeController,
  getVehiclesController,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController,
  getVehicleMaintenanceRequestsController,
  createVehicleMaintenanceRequestController,
  updateVehicleMaintenanceRequestController,
  deleteVehicleMaintenanceRequestController,
} = require("../controllers/dispatchingDashboardController");
const router = express.Router();

// Get Vehicle Types route
router.get("/vehicleTypes", getVehicleTypesController);

// Create Vehicle Type route
router.post("/vehicleTypes", createVehicleTypeController);

// Update Vehicle Type route
router.put("/vehicleTypes/:id", updateVehicleTypeController);

// Delete Vehicle Type route
router.delete("/vehicleTypes/:id", deleteVehicleTypeController);

// Get Vehicles route
router.get("/vehicles", getVehiclesController);

// Create Vehicle route
router.post("/vehicles", createVehicleController);

// Update Vehicle Type route
router.put("/vehicles/:id", updateVehicleController);

// Delete Vehicle Type route
router.delete("/vehicles/:id", deleteVehicleController);

// Get Vehicle Maintenance Requests route
router.get(
  "/vehicleMaintenanceRequests",
  getVehicleMaintenanceRequestsController
);

// Create Vehicle Maintenance Request route
router.post(
  "/vehicleMaintenanceRequests",
  createVehicleMaintenanceRequestController
);

// Update Vehicle Maintenance Request route
router.put(
  "/vehicleMaintenanceRequests/:id",
  updateVehicleMaintenanceRequestController
);

// Delete Vehicle Maintenance Request route
router.delete(
  "/vehicleMaintenanceRequests/:id",
  deleteVehicleMaintenanceRequestController
);

module.exports = router;
