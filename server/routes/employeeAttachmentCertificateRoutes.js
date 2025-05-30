// routes/employeeAttachmentCertificateRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeAttachmentMemoController,
  getEmployeeAttachmentsMemoController,
  getEmployeeAttachmentMemoController,
  getEmployeeAttachmentMemoFullController,
  deleteEmployeeAttachmentMemoController,
} = require("../controllers/employeeAttachmentMemoController");

// Create Employee AttachmentMemo route
router.post(
  "/",
  upload.single("attachment"),
  createEmployeeAttachmentMemoController
);

// Get Employee AttachmentMemos route
router.get("/", getEmployeeAttachmentsMemoController);

// Get Employee AttachmentMemo route
router.get("/:id", getEmployeeAttachmentMemoController);

// Get Employee AttachmentMemo Full route
router.get("/full/:id", getEmployeeAttachmentMemoFullController);

// Delete Booked Transaction route
router.delete("/:id", deleteEmployeeAttachmentMemoController);

module.exports = router;
