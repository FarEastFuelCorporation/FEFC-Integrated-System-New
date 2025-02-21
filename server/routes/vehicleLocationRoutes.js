// routes/vehicleLocationRoutes.js

const express = require("express");
const router = express.Router();
const {
  postVehicleLocation,
  getLatestLocation,
} = require("../controllers/vehicleLocationController");

router.get("/", getLatestLocation);

router.post("/", postVehicleLocation);

module.exports = router;
