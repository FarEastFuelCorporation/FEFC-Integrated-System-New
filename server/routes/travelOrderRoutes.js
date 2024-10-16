// routes/travelOrderRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTravelOrderController,
  getTravelOrdersController,
  getTravelOrderController,
  updateTravelOrderController,
  deleteTravelOrderController,
} = require("../controllers/travelOrderController");

// Create Travel Order route
router.post("/", createTravelOrderController);

// Get Travel Orders route
router.get("/", getTravelOrdersController);

// Get Travel Order route
router.get("/:id", getTravelOrderController);

// Update Travel Order route
router.put("/:id", updateTravelOrderController);

// Delete Travel Order route
router.delete("/:id", deleteTravelOrderController);

module.exports = router;
