// routes/attachmentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createAttachmentController,
  getAttachmentsController,
  getAttachmentController,
} = require("../controllers/attachmentController");

// Create Attachment route
router.post("/", upload.single("attachment"), createAttachmentController);

// Get Attachments route
router.get("/", getAttachmentsController);

// Get Attachment route
router.get("/:id", getAttachmentController);

module.exports = router;
