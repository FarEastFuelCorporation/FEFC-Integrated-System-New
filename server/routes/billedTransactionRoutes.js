// routes/billedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBilledTransactionController,
  getBilledTransactionsController,
  deleteBilledTransactionController,
} = require("../controllers/billedTransactionController");

// Create Billed Transaction route
router.post("/", createBilledTransactionController);

// Get Billed Transactions route
router.get("/", getBilledTransactionsController);

// Delete Billed Transaction route
router.delete("/:id", deleteBilledTransactionController);

module.exports = router;
