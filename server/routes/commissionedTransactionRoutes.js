// routes/commissionedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCommissionedTransactionController,
  getCommissionedTransactionsController,
  updateCommissionedTransactionController,
  deleteCommissionedTransactionController,
  getCommissionedTransactionsDashboardController,
} = require("../controllers/commissionedTransactionController");

// Create Commissioned Transaction route
router.post("/", createCommissionedTransactionController);

// Get Commissioned Transactions route
router.get("/", getCommissionedTransactionsController);

// Update Commissioned Transaction route
router.put("/:id", updateCommissionedTransactionController);

// Delete Commissioned Transaction route
router.delete("/:id", deleteCommissionedTransactionController);

// Get Commissioned Transactions Dashboard route
router.get(
  "/dashboard/:startDate/:endDate/",
  getCommissionedTransactionsDashboardController
);

module.exports = router;
