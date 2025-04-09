// routes/ledgerRoutes.js

const express = require("express");
const router = express.Router();
const {
  createLedgerJDController,
  getLedgerJDsController,
  updateLedgerJDController,
  deleteLedgerJDController,
  getLedgerSummaryJDsController,
} = require("../controllers/ledgerController");

// Create Ledger route
router.post("/", createLedgerJDController);

// Get Ledgers route
router.get("/", getLedgerJDsController);

// Get Ledgers Summary route
router.get("/summary", getLedgerSummaryJDsController);

// Update Ledger route
router.put("/:id", updateLedgerJDController);

// Delete Ledger route
router.delete("/:id", deleteLedgerJDController);

module.exports = router;
