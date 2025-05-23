// routes/commissionVerifyRoutes.js

const express = require("express");
const router = express.Router();
const {
  getCommissionVerifyController,
} = require("../controllers/commissionVerifyController");

// Get Commission Verify route
router.get("/:id", getCommissionVerifyController);

module.exports = router;
