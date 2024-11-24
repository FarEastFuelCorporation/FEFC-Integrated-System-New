// routes/bookedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBookedTransactionController,
  getBookedTransactionsController,
  getBookedTransactionFullController,
  getBookedTransactionFullByBilledTransactionIdController,
  updateBookedTransactionController,
  deleteBookedTransactionController,
  geBookedTransactionsDashboardController,
  geBookedTransactionsDashboardFullController,
} = require("../controllers/bookedTransactionController");

// Create Booked Transaction route
router.post("/", createBookedTransactionController);

// Get Booked Transactions route
router.get("/", getBookedTransactionsController);

// Get Booked Transactions Full route
router.get("/full/:id", getBookedTransactionFullController);

// Get Booked Transactions Full route
router.get(
  "/full/bill/:id",
  getBookedTransactionFullByBilledTransactionIdController
);

// Get Booked Transactions Dashboard route
router.get(
  "/dashboard/:startDate/:endDate/:clientId",
  geBookedTransactionsDashboardController
);

// Get Booked Transactions Dashboard route
router.get(
  "/dashboard/full/:startDate/:endDate/:clientId",
  geBookedTransactionsDashboardFullController
);

// Update Booked Transaction route
router.put("/:id", updateBookedTransactionController);

// Delete Booked Transaction route
router.delete("/:id", deleteBookedTransactionController);

module.exports = router;
