// routes/certificateRoutes.js

const express = require("express");
const router = express.Router();
const {
  getCertificateController,
} = require("../controllers/certificateController");

// Get Certificate route
router.get("/:id", getCertificateController);

module.exports = router;
