// routes/client.js

const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { getClientRecords } = require("../controllers/clientController");
const {
  updateClientController,
} = require("../controllers/marketingDashboardControllers");
const router = express.Router();

// Get client details by ID
router.get("/:id", getClientRecords);

// Update client details
router.put("/:id", upload.single("clientPicture"), updateClientController);

module.exports = router;
