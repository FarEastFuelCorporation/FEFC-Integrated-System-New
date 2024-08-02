// routes/certifiedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCertifiedTransactionController,
  getCertifiedTransactionsController,
  deleteCertifiedTransactionController,
} = require("../controllers/certifiedTransactionController");

// Create Certified Transaction route
router.post("/", createCertifiedTransactionController);

// Get Certified Transactions route
router.get("/", getCertifiedTransactionsController);

// Delete Certified Transaction route
router.delete("/:id", deleteCertifiedTransactionController);

module.exports = router;
