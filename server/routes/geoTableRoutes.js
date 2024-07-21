// routes/geoTableRoutes.js

const express = require("express");
const router = express.Router();
const {
  getProvincesController,
  getCitiesController,
  getBaranggaysController,
} = require("../controllers/geoTableController");

// Get Provinces route
router.get("/province", getProvincesController);

// Get Provinces route
router.get("/cities/:province", getCitiesController);

// Get Provinces route
router.get("/baranggays/:city", getBaranggaysController);

module.exports = router;
