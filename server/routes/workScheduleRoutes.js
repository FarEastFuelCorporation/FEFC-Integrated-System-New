// routes/workScheduleRoutes.js

const express = require("express");
const router = express.Router();
const {
  createWorkScheduleController,
  getWorkSchedulesController,
  getWorkScheduleController,
  getSubordinateController,
  getWorkScheduleSubordinateController,
  updateWorkScheduleController,
  updateWorkScheduleSubordinateApprovedController,
  updateWorkScheduleSubordinateDisapprovedController,
  updateWorkScheduleSubordinateApproved2Controller,
  updateWorkScheduleSubordinateDisapproved2Controller,
  deleteWorkScheduleController,
} = require("../controllers/workScheduleController");

// Create Work Schedule route
router.post("/", createWorkScheduleController);

// Get Work Schedules route
router.get("/", getWorkSchedulesController);

// Get Work Schedule route
router.get("/:id", getWorkScheduleController);

// Get Subordinate route
router.get("/getSubordinate/:id", getSubordinateController);

// Get Work Schedule Subordinate route
router.get("/subordinate/:id", getWorkScheduleSubordinateController);

// Update WorkSchedule route
router.put("/:id", updateWorkScheduleController);

// Update Work Schedule Subordinate Approved route
router.put(
  "/subordinateApproved/:id",
  updateWorkScheduleSubordinateApprovedController
);

// Update Work Schedule Subordinate Disapproved route
router.put(
  "/subordinateDisapproved/:id",
  updateWorkScheduleSubordinateDisapprovedController
);

// Update Work Schedule Subordinate Approved 2 route
router.put(
  "/subordinateApproved2/:id",
  updateWorkScheduleSubordinateApproved2Controller
);

// Update Work Schedule Subordinate Disapproved 2 route
router.put(
  "/subordinateDisapproved2/:id",
  updateWorkScheduleSubordinateDisapproved2Controller
);

// Delete Work Schedule route
router.delete("/:id", deleteWorkScheduleController);

module.exports = router;
