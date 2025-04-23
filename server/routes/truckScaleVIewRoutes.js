// routes/truckScaleVIewRoutes.js

const express = require("express");
const router = express.Router();
const {
  getTruckScaleViewController,
} = require("../controllers/truckScaleViewController");

// Get TruckScaleView of Destruction route
router.get("/:id", getTruckScaleViewController);

module.exports = router;
