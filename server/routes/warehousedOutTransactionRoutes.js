// routes/warehousedOutTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createWarehousedOutTransactionController,
  getWarehousedOutTransactionsController,
  updateWarehousedOutTransactionController,
  deleteWarehousedOutTransactionController,
} = require("../controllers/warehousedOutTransactionController");

// Create Warehoused Out Transaction route
router.post("/", createWarehousedOutTransactionController);

// Get Warehoused Out Transactions route
router.get("/", getWarehousedOutTransactionsController);

// Update Warehoused Out Transaction route
router.put("/:id", updateWarehousedOutTransactionController);

// Delete Warehoused Out Transaction route
router.delete("/:id", deleteWarehousedOutTransactionController);

module.exports = router;
