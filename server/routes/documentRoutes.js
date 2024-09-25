// routes/documentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createDocumentController,
  getDocumentsController,
} = require("../controllers/documentController");

// Create Attachment route
router.post("/", upload.single("attachment"), createDocumentController);

// Get Attachments route
router.get("/", getDocumentsController);

module.exports = router;
