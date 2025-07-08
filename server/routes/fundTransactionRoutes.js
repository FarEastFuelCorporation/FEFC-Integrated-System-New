// routes/fundTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createFundTransactionController,
  getFundTransactionsController,
  updateFundTransactionController,
  deleteFundTransactionController,
} = require("../controllers/fundTransactionController");

// Create Fund Transaction route
router.post("/", createFundTransactionController);

// Get Fund Transactions route
router.get("/", getFundTransactionsController);

// Update Fund Transaction route
router.put("/:id", updateFundTransactionController);

// Delete Fund Transaction route
router.delete("/:id", deleteFundTransactionController);

module.exports = router;
