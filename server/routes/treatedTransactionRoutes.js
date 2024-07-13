// routes/treatedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTreatedTransactionController,
  getTreatedTransactionsController,
  updateTreatedTransactionController,
  deleteTreatedTransactionController,
} = require("../controllers/treatedTransactionController");

// Create Treated Transaction route
router.post("/", createTreatedTransactionController);

// Get Treated Transactions route
router.get("/", getTreatedTransactionsController);

// Update Treated Transaction route
router.put("/:id", updateTreatedTransactionController);

// Delete Treated Transaction route
router.delete("/:id", deleteTreatedTransactionController);

module.exports = router;
