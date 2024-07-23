// routes/geoTableRoutes.js

const express = require("express");
const router = express.Router();
const {
  getProvincesController,
  getCitiesController,
  getBarangaysController,
} = require("../controllers/geoTableController");

// Get Provinces route
router.get("/province", getProvincesController);

// Get Provinces route
router.get("/citY/:province", getCitiesController);

// Get Provinces route
router.get("/barangay/:city", getBarangaysController);

module.exports = router;
