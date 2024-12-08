// routes/quotationRoutes.js

const express = require("express");
const router = express.Router();
const {
  getQuotationsController,
  getQuotationsFullController,
  getQuotationController,
  getQuotationFullController,
  createQuotationController,
  deleteQuotationController,
  updateQuotationController,
} = require("../controllers/quotationControllers");

// Create Quotation route
router.post("/", createQuotationController);

// Get Quotations route
router.get("/", getQuotationsController);

// Get Quotations route
router.get("/full", getQuotationsFullController);

// Get Quotation route
router.get("/:id", getQuotationController);

// Get Quotation Full route
router.get("/full/:id", getQuotationFullController);

// Update Quotation route
router.put("/:id", updateQuotationController);

// Delete Quotation route
router.delete("/:id", deleteQuotationController);

module.exports = router;
