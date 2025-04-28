// routes/commissionRoutes.js

const express = require("express");
const router = express.Router();
const {
  getCommissionsController,
  getCommissionController,
  createCommissionController,
  deleteCommissionController,
  updateCommissionController,
} = require("../controllers/commissionControllers");

// Create Commission route
router.post("/", createCommissionController);

// Get Commissions route
router.get("/", getCommissionsController);

// Get Commission route
router.get("/:id", getCommissionController);

// Update Commission route
router.put("/:id", updateCommissionController);

// Delete Commission route
router.delete("/:id", deleteCommissionController);

module.exports = router;
