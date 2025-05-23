// routes/employeeRecordRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeRecordController,
  getEmployeeRecordsController,
  getEmployeeRecordsFullController,
  updateEmployeeRecordController,
  deleteEmployeeRecordController,
  getEmployeeRecordSignatureController,
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

// Get EmployeeRecords route
router.get("/full", getEmployeeRecordsFullController);

// get  Signature route
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
