// routes/travelOrderVerifyRoutes.js

const express = require("express");
const router = express.Router();
const {
  getTravelOrderVerifyController,
  updateTravelOrderVerifyController,
} = require("../controllers/travelOrderVerifyController");

// Get Travel Order Verify route
router.get("/:id", getTravelOrderVerifyController);

// Update Travel Order Verify route
router.put("/:id", updateTravelOrderVerifyController);

module.exports = router;
