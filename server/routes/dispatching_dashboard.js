// routes/dispatching_dashboard.js

const express = require("express");
const {
  getVehiclesController,
  createVehicleController,
} = require("../controllers/dispatchingDashboardController");
const router = express.Router();

// Get Vehicles route
router.get("/vehicles", getVehiclesController);

// Create Treatment Process route
router.post("/vehicles", createVehicleController);

module.exports = router;
