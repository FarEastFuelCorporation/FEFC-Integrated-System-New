// routes/agentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createAgentController,
  getAgentsController,
  updateAgentController,
  deleteAgentController,
} = require("../controllers/agentController");

// Create Third Party Agent route
router.post("/", createAgentController);

// Get Third Party Agent route
router.get("/", getAgentsController);

// Update Third Party Agent route
router.put("/:id", updateAgentController);

// Delete Third Party Agent route
router.delete("/:id", deleteAgentController);

module.exports = router;
