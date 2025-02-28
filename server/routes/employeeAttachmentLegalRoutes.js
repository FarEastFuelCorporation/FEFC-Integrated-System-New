// routes/employeeAttachmentLegalRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeAttachmentLegalController,
  getEmployeeAttachmentsLegalController,
  getEmployeeAttachmentLegalController,
  getEmployeeAttachmentLegalFullController,
  deleteEmployeeAttachmentLegalController,
} = require("../controllers/employeeAttachmentLegalController");

// Create Employee AttachmentLegal route
router.post(
  "/",
  upload.single("attachment"),
  createEmployeeAttachmentLegalController
);

// Get Employee AttachmentLegals route
router.get("/", getEmployeeAttachmentsLegalController);

// Get Employee AttachmentLegal route
router.get("/:id", getEmployeeAttachmentLegalController);

// Get Employee AttachmentLegal Full route
router.get("/full/:id", getEmployeeAttachmentLegalFullController);

// Delete Booked Transaction route
router.delete("/:id", deleteEmployeeAttachmentLegalController);

module.exports = router;
