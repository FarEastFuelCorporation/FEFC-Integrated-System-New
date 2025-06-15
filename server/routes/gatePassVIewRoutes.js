// routes/gatePassVIewRoutes.js

const express = require("express");
const router = express.Router();
const {
  getGatePassViewController,
} = require("../controllers/gatePassViewController");

// Get deliveryReceiptVIew of Destruction route
router.get("/:id", getGatePassViewController);

module.exports = router;
