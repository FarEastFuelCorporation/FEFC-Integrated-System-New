// routes/marketing_dashboard.js

const express = require("express");
const router = express.Router();
const {
  getClientsController,
  createClientController,
  updateClientController,
  deleteClientController,
} = require("../controllers/marketingDashboardControllers");

// Get Clients route
router.get("/clients", getClientsController);

// Create Client route
router.post("/clients", createClientController);

// Update Client route
router.put("/clients/:id", updateClientController);

// Delete Client route
router.delete("/clients/:id", deleteClientController);

module.exports = router;
