// routes/transporterClientRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTransporterClientController,
  getTransporterClientsController,
  getTransporterClientController,
  updateTransporterClientController,
  deleteTransporterClientController,
} = require("../controllers/transporterClientController");

// Create Transporter Client route
router.post("/", createTransporterClientController);

// Get Transporter Clients route
router.get("/", getTransporterClientsController);

// Get Transporter Client route
router.get("/:id", getTransporterClientController);

// Update Transporter Client route
router.put("/:id", updateTransporterClientController);

// Delete Transporter Client route
router.delete("/:id", deleteTransporterClientController);

module.exports = router;
