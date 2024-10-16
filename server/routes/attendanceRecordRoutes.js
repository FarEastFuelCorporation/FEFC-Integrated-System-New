// routes/attendanceRecordRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAttendanceRecordsController,
  getAttendanceRecordController,
} = require("../controllers/attendanceRecordController");

// Get Attendance Records route
router.get("/", getAttendanceRecordsController);

// Get Attendance Record route
router.get("/:id", getAttendanceRecordController);

module.exports = router;
