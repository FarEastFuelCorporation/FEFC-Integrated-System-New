// routes/collectionTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBillingApprovalTransactionController,
  getBillingApprovalTransactionsController,
  deleteBillingApprovalTransactionController,
} = require("../controllers/collectionTransactionController");

// Create Billing Approval Transaction route
router.post("/", createBillingApprovalTransactionController);

// Get Billing Approval Transactions route
router.get("/", getBillingApprovalTransactionsController);

// Delete Billing Approval Transaction route
router.delete("/:id", deleteBillingApprovalTransactionController);

module.exports = router;
