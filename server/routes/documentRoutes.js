// routes/documentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createDocumentController,
  getDocumentsController,
  deleteDocumentsController,
} = require("../controllers/documentController");

// Create Document route
router.post("/", upload.single("attachment"), createDocumentController);

// Get Documents route
router.get("/", getDocumentsController);

// Delete Document route
router.delete("/:id", deleteDocumentsController);

module.exports = router;
