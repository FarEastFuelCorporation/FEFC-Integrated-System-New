// routes/bookedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBookedTransactionController,
  getBookedTransactionsController,
  getBookedTransactionController,
  updateBookedTransactionController,
  deleteBookedTransactionController,
} = require("../controllers/bookedTransactionController");

// Create Booked Transaction route
router.post("/", createBookedTransactionController);

// Get Booked Transactions route
router.get("/", getBookedTransactionsController);

// Get Booked Transaction route
router.get("/:id", getBookedTransactionController);

// Update Booked Transaction route
router.put("/:id", updateBookedTransactionController);

// Delete Booked Transaction route
router.delete("/:id", deleteBookedTransactionController);

module.exports = router;
