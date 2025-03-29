// routes/inventoryRoutes.js

const express = require("express");
const router = express.Router();
const {
  createInventoryJDController,
  getInventoryJDsController,
  updateInventoryJDController,
  deleteInventoryJDController,
} = require("../controllers/inventoryController");

// Create Inventory route
router.post("/", createInventoryJDController);

// Get Inventories route
router.get("/", getInventoryJDsController);

// Update Inventory route
router.put("/:id", updateInventoryJDController);

// Delete Inventory route
router.delete("/:id", deleteInventoryJDController);

module.exports = router;
