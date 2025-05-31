// routes/employeeAttachmentIncidentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeAttachmentIncidentController,
  getEmployeeAttachmentsIncidentController,
  getEmployeeAttachmentIncidentController,
  getEmployeeAttachmentIncidentFullController,
  deleteEmployeeAttachmentIncidentController,
} = require("../controllers/employeeAttachmentIncidentController");

// Create Employee AttachmentIncident route
router.post(
  "/",
  upload.single("attachment"),
  createEmployeeAttachmentIncidentController
);

// Get Employee AttachmentIncidents route
router.get("/", getEmployeeAttachmentsIncidentController);

// Get Employee AttachmentIncident route
router.get("/:id", getEmployeeAttachmentIncidentController);

// Get Employee AttachmentIncident Full route
router.get("/full/:id", getEmployeeAttachmentIncidentFullController);

// Delete Booked Transaction route
router.delete("/:id", deleteEmployeeAttachmentIncidentController);

module.exports = router;
