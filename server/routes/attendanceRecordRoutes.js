// routes/attendanceRecordRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAttendanceRecordController,
} = require("../controllers/attendanceRecordController");

// Get Scrap Types route
router.get("/", getAttendanceRecordController);

module.exports = router;
