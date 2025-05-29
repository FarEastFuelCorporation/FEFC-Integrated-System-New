// routes/clientAttachmentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createClientAttachmentController,
  getClientAttachmentsController,
  getClientAttachmentController,
  deleteClientAttachmentController,
  getClientWithAttachmentController,
} = require("../controllers/clientAttachmentController");

// Create Client Attachment route
router.post("/", upload.single("attachment"), createClientAttachmentController);

// Get Client Attachments route
router.get("/", getClientAttachmentsController);

// Get Client Attachment route
router.get("/:id", getClientAttachmentController);

// Get Client Attachment route
router.get("/attachment/:id", getClientWithAttachmentController);

// Delete Client Attachment route
router.delete("/:id", deleteClientAttachmentController);

module.exports = router;
