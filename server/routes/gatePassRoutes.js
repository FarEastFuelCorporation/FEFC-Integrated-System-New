// routes/gatePassRoutes.js

const express = require("express");
const router = express.Router();
const {
  createGatePassController,
  getGatePassesController,
  updateGatePassController,
  deleteGatePassController,
} = require("../controllers/gatePassController");

// Create Gate Pass route
router.post("/", createGatePassController);

// Get Gate Passes route
router.get("/", getGatePassesController);

// Update Gate Pass route
router.put("/:id", updateGatePassController);

// Delete Gate Pass route
router.delete("/:id", deleteGatePassController);

module.exports = router;
