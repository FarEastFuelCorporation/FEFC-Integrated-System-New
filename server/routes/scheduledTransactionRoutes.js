// routes/scheduledTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createScheduledTransactionController,
  getScheduledTransactionsController,
  updateScheduledTransactionController,
  deleteScheduledTransactionController,
  getScheduledTransactionsDashboardController,
} = require("../controllers/scheduledTransactionController");

// Create Scheduled Transaction route
router.post("/", createScheduledTransactionController);

// Get Scheduled Transactions route
router.get("/", getScheduledTransactionsController);

// Update Scheduled Transaction route
router.put("/:id", updateScheduledTransactionController);

// Delete Scheduled Transaction route
router.delete("/:id", deleteScheduledTransactionController);

// Get Dispatched Transactions Dashboard route
router.get(
  "/dashboard/:startDate/:endDate/",
  getScheduledTransactionsDashboardController
);

module.exports = router;
