// routes/vehicleAttachmentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createVehicleAttachmentController,
  getVehicleAttachmentsController,
  getVehicleAttachmentController,
} = require("../controllers/vehicleAttachmentController");

// Create Vehicle Attachment route
router.post(
  "/",
  upload.single("attachment"),
  createVehicleAttachmentController
);

// Get Vehicle Attachments route
router.get("/", getVehicleAttachmentsController);

// Get Vehicle Attachment route
router.get("/:id", getVehicleAttachmentController);

module.exports = router;