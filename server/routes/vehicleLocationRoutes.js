// routes/vehicleLocationRoutes.js

const express = require("express");
const router = express.Router();
const {
  createDispatchedTransactionController,
} = require("../controllers/vehicleLocationController");

// Create Dispatched Transaction route
router.post("/", createDispatchedTransactionController);

module.exports = router;
