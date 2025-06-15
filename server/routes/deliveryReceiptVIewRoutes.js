// routes/deliveryReceiptVIewRoutes.js

const express = require("express");
const router = express.Router();
const {
  getDeliveryReceiptViewController,
} = require("../controllers/deliveryReceiptViewController");

// Get deliveryReceiptVIew of Destruction route
router.get("/:id", getDeliveryReceiptViewController);

module.exports = router;
