// routes/ledgerRoutes.js

const express = require("express");
const router = express.Router();
const {
  createLedgerJDController,
  getLedgerJDsController,
  updateLedgerJDController,
  deleteLedgerJDController,
} = require("../controllers/ledgerController");

// Create Ledger route
router.post("/", createLedgerJDController);

// Get Ledgers route
router.get("/", getLedgerJDsController);

// Update Ledger route
router.put("/:id", updateLedgerJDController);

// Delete Ledger route
router.delete("/:id", deleteLedgerJDController);

module.exports = router;
