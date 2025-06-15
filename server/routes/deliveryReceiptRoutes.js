// routes/deliveryReceiptRoutes.js

const express = require("express");
const router = express.Router();
const {
  createDeliveryReceiptController,
  getDeliveryReceiptsController,
  updateDeliveryReceiptController,
  deleteDeliveryReceiptController,
} = require("../controllers/deliveryReceiptController");

// Create Delivery Receipt route
router.post("/", createDeliveryReceiptController);

// Get Delivery Receipts route
router.get("/", getDeliveryReceiptsController);

// Update Delivery Receipt route
router.put("/:id", updateDeliveryReceiptController);

// Delete Delivery Receipt route
router.delete("/:id", deleteDeliveryReceiptController);

module.exports = router;
