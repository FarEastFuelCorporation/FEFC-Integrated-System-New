// routes/employeeAttachmentCertificateRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeAttachmentCertificateController,
  getEmployeeAttachmentsCertificateController,
  getEmployeeAttachmentCertificateController,
  getEmployeeAttachmentCertificateFullController,
  deleteEmployeeAttachmentCertificateController,
} = require("../controllers/employeeAttachmentCertificateController");

// Create Employee AttachmentCertificate route
router.post(
  "/",
  upload.single("attachment"),
  createEmployeeAttachmentCertificateController
);

// Get Employee AttachmentCertificates route
router.get("/", getEmployeeAttachmentsCertificateController);

// Get Employee AttachmentCertificate route
router.get("/:id", getEmployeeAttachmentCertificateController);

// Get Employee AttachmentCertificate Full route
router.get("/full/:id", getEmployeeAttachmentCertificateFullController);

// Delete Booked Transaction route
router.delete("/:id", deleteEmployeeAttachmentCertificateController);

module.exports = router;
