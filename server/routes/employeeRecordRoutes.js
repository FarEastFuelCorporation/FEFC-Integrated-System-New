// routes/employeeRecordRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeRecordController,
  getEmployeeRecordsController,
  updateEmployeeRecordController,
  deleteEmployeeRecordController,
  getEmployeeRecordSignatureController,
  getEmployeeRecordController,
  getEmployeeRecordPictureController,
} = require("../controllers/employeeRecordController");

// Create EmployeeRecord route
router.post(
  "/",
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createEmployeeRecordController
);

// Get EmployeeRecords route
router.get("/", getEmployeeRecordsController);

// Get EmployeeRecord Picture route
router.get("/picture/:id", getEmployeeRecordPictureController);

// Get EmployeeRecord Signature route
router.get("/signature/:id", getEmployeeRecordSignatureController);

// Update EmployeeRecord route
router.put(
  "/:id",
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateEmployeeRecordController
);

// Delete EmployeeRecord route
router.delete("/:id", deleteEmployeeRecordController);

module.exports = router;
