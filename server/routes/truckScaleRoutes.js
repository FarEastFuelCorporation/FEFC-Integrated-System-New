// routes/truckScaleRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTruckScaleController,
  getTruckScalesController,
  updateTruckScaleController,
  deleteTruckScaleController,
} = require("../controllers/truckScaleController");

// Create Truck Scale route
router.post("/", createTruckScaleController);

// Get Truck Scales route
router.get("/", getTruckScalesController);

// Update Truck Scale route
router.put("/:id", updateTruckScaleController);

// Delete Truck Scale route
router.delete("/:id", deleteTruckScaleController);

module.exports = router;
