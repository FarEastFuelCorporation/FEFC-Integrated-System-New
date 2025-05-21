// routes/commissionedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createScheduledTransactionController,
  getScheduledTransactionsController,
  updateScheduledTransactionController,
  deleteScheduledTransactionController,
  getScheduledTransactionsDashboardController,
} = require("../controllers/commissionedTransactionController");

// Create Scheduled Transaction route
router.post("/", createScheduledTransactionController);

// Get Scheduled Transactions route
router.get("/", getScheduledTransactionsController);

// Update Scheduled Transaction route
router.put("/:id", updateScheduledTransactionController);

// Delete Scheduled Transaction route
router.delete("/:id", deleteScheduledTransactionController);

// Get Scheduled Transactions Dashboard route
router.get(
  "/dashboard/:startDate/:endDate/",
  getScheduledTransactionsDashboardController
);

module.exports = router;
