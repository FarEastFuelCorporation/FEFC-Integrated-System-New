// routes/commissionApprovalTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCommissionApprovalTransactionController,
  getCommissionApprovalTransactionsController,
  updateCommissionApprovalTransactionController,
  deleteCommissionApprovalTransactionController,
} = require("../controllers/commissionApprovalTransactionController");

// Create Commission Approval Transaction route
router.post("/", createCommissionApprovalTransactionController);

// Get Commission Approval Transactions route
router.get("/", getCommissionApprovalTransactionsController);

// Update Commission Approval Transaction route
router.put("/:id", updateCommissionApprovalTransactionController);

// Delete Commission Approval Transaction route
router.delete("/:id", deleteCommissionApprovalTransactionController);

module.exports = router;
