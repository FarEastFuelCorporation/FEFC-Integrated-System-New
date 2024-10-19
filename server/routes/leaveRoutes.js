// routes/leaveRoutes.js

const express = require("express");
const router = express.Router();
const {
  createLeaveController,
  getLeavesController,
  getLeaveController,
  getLeaveSubordinateController,
  updateLeaveController,
  updateLeaveSubordinateApprovedController,
  updateLeaveSubordinateDisapprovedController,
  updateLeaveSubordinateApproved2Controller,
  updateLeaveSubordinateDisapproved2Controller,
  deleteLeaveController,
} = require("../controllers/leaveController");

// Create Leave route
router.post("/", createLeaveController);

// Get Leaves route
router.get("/", getLeavesController);

// Get Leave route
router.get("/:id", getLeaveController);

// Get Leave Subordinate route
router.get("/subordinate/:id", getLeaveSubordinateController);

// Update Leave route
router.put("/:id", updateLeaveController);

// Update Leave Subordinate Approved route
router.put(
  "/subordinateApproved/:id",
  updateLeaveSubordinateApprovedController
);

// Update Leave Subordinate Disapproved route
router.put(
  "/subordinateDisapproved/:id",
  updateLeaveSubordinateDisapprovedController
);

// Update Leave Subordinate Approved 2 route
router.put(
  "/subordinateApproved2/:id",
  updateLeaveSubordinateApproved2Controller
);

// Update Leave Subordinate Disapproved 2 route
router.put(
  "/subordinateDisapproved2/:id",
  updateLeaveSubordinateDisapproved2Controller
);

// Delete Leave route
router.delete("/:id", deleteLeaveController);

module.exports = router;
