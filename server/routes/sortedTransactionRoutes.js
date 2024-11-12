// routes/sortedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createSortedTransactionController,
  getSortedTransactionsController,
  updateSortedTransactionController,
  deleteSortedTransactionController,
  getSortedTransactionsDashboardController,
} = require("../controllers/sortedTransactionController");

// Create Sorted Transaction route
router.post("/", createSortedTransactionController);

// Get Sorted Transactions route
router.get("/", getSortedTransactionsController);

// Update Sorted Transaction route
router.put("/:id", updateSortedTransactionController);

// Delete Sorted Transaction route
router.delete("/:id", deleteSortedTransactionController);

// Get Sorted Transactions Dashboard route
router.get(
  "/dashboard/:startDate/:endDate/",
  getSortedTransactionsDashboardController
);

module.exports = router;
