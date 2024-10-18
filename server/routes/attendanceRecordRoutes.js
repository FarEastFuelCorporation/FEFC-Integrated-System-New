// routes/attendanceRecordRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAttendanceRecordsController,
  getAttendanceRecordController,
  getAttendanceRecordSubordinatesController,
} = require("../controllers/attendanceRecordController");

// Get Attendance Records route
router.get("/", getAttendanceRecordsController);

// Get Attendance Record route
router.get("/:id", getAttendanceRecordController);

// Get Attendance Record Subordinates route
router.get("/subordinates/:id", getAttendanceRecordSubordinatesController);

module.exports = router;
