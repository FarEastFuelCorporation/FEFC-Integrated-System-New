// routes/thirdPartyLogisticsRoutes.js

const express = require("express");
const router = express.Router();
const {
  createThirdPartyLogisticsController,
  getThirdPartyLogisticsController,
  updateThirdPartyLogisticsController,
  deleteThirdPartyLogisticsController,
} = require("../controllers/thirdPartyLogisticsController");

// Create Third Party Logistics route
router.post("/", createThirdPartyLogisticsController);

// Get Third Party Logistics route
router.get("/", getThirdPartyLogisticsController);

// Update Third Party Logistics route
router.put("/:id", updateThirdPartyLogisticsController);

// Delete Third Party Logistics route
router.delete("/:id", deleteThirdPartyLogisticsController);

module.exports = router;
