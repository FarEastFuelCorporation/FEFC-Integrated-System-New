// routes/vehicleRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createVehicleController,
  getVehiclesController,
  getVehicleController,
  getVehiclesByVehicleTypeIdController,
  updateVehicleController,
  deleteVehicleController,
} = require("../controllers/vehicleController");

// Create Vehicle route
router.post(
  "/",
  upload.fields([{ name: "picture", maxCount: 1 }]),
  createVehicleController
);

// Get Vehicles route
router.get("/", getVehiclesController);

// Get Vehicle route
router.get("/", getVehicleController);

// Get Vehicle by vehicleTypeId route
router.get("/vehicleType/:id", getVehiclesByVehicleTypeIdController);

// Update Vehicle route
router.put(
  "/:id",
  upload.fields([{ name: "picture", maxCount: 1 }]),
  updateVehicleController
);

// Delete Vehicle route
router.delete("/:id", deleteVehicleController);

module.exports = router;
