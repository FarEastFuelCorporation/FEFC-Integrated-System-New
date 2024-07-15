// routes/certifiedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCertifiedTransactionController,
  getCertifiedTransactionsController,
  deleteCertifiedTransactionController,
} = require("../controllers/certifiedTransactionController");

// Create Sorted Transaction route
router.post("/", createCertifiedTransactionController);

// Get Sorted Transactions route
router.get("/", getCertifiedTransactionsController);

// Delete Sorted Transaction route
router.delete("/:id", deleteCertifiedTransactionController);

module.exports = router;
