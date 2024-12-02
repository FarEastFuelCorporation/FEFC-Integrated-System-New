// routes/billedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBilledTransactionController,
  getBilledTransactionsController,
  getBilledStatementsController,
  updateBilledTransactionController,
  deleteBilledTransactionController,
  getBilledStatementsReviewController,
} = require("../controllers/billedTransactionController");

// Create Billed Transaction route
router.post("/", createBilledTransactionController);

// Get Billed Transactions route
router.get("/", getBilledTransactionsController);

// Get Billed Statements route
router.get("/multiple/:billingNumber", getBilledStatementsController);

// Get Billed Statements Review route
router.get("/review/:billingNumber", getBilledStatementsReviewController);

// Update Billed Transaction route
router.put("/:id", updateBilledTransactionController);

// Delete Billed Transaction route
router.delete("/:id", deleteBilledTransactionController);

module.exports = router;
