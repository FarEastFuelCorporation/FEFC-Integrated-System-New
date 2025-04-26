// routes/pttRoutes.js

const express = require("express");
const router = express.Router();
const {
  createPTTController,
  getPTTsController,
  updatePTTController,
  deletePTTController,
} = require("../controllers/pttController");

// Create Scrap Type route
router.post("/", createPTTController);

// Get Scrap Types route
router.get("/", getPTTsController);

// Update Scrap Type route
router.put("/:id", updatePTTController);

// Delete Scrap Type route
router.delete("/:id", deletePTTController);

module.exports = router;
