// routes/workScheduleRoutes.js

const express = require("express");
const router = express.Router();
const {
  createWorkScheduleController,
  getWorkSchedulesController,
  getWorkScheduleController,
  getWorkScheduleSubordinateController,
  updateWorkScheduleController,
  updateWorkScheduleSubordinateApprovedController,
  updateWorkScheduleSubordinateDisapprovedController,
  updateWorkScheduleSubordinateApproved2Controller,
  updateWorkScheduleSubordinateDisapproved2Controller,
  deleteWorkScheduleController,
} = require("../controllers/workScheduleController");

// Create WorkSchedule route
router.post("/", createWorkScheduleController);

// Get WorkSchedules route
router.get("/", getWorkSchedulesController);

// Get WorkSchedule route
router.get("/:id", getWorkScheduleController);

// Get WorkSchedule Subordinate route
router.get("/subordinate/:id", getWorkScheduleSubordinateController);

// Update WorkSchedule route
router.put("/:id", updateWorkScheduleController);

// Update WorkSchedule Subordinate Approved route
router.put(
  "/subordinateApproved/:id",
  updateWorkScheduleSubordinateApprovedController
);

// Update WorkSchedule Subordinate Disapproved route
router.put(
  "/subordinateDisapproved/:id",
  updateWorkScheduleSubordinateDisapprovedController
);

// Update WorkSchedule Subordinate Approved 2 route
router.put(
  "/subordinateApproved2/:id",
  updateWorkScheduleSubordinateApproved2Controller
);

// Update WorkSchedule Subordinate Disapproved 2 route
router.put(
  "/subordinateDisapproved2/:id",
  updateWorkScheduleSubordinateDisapproved2Controller
);

// Delete WorkSchedule route
router.delete("/:id", deleteWorkScheduleController);

module.exports = router;
