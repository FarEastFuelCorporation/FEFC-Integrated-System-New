// routes/overtimeRoutes.js

const express = require("express");
const router = express.Router();
const {
  createOvertimeController,
  getOvertimesController,
  getOvertimesApprovedController,
  getOvertimeController,
  getOvertimeSubordinateController,
  updateOvertimeController,
  updateOvertimeSubordinateApprovedController,
  updateOvertimeSubordinateDisapprovedController,
  updateOvertimeSubordinateApproved2Controller,
  updateOvertimeSubordinateDisapproved2Controller,
  deleteOvertimeController,
} = require("../controllers/overtimeController");

// Create Overtime route
router.post("/", createOvertimeController);

// Get Overtimes route
router.get("/", getOvertimesController);

// Get Overtimes Approved route
router.get("/approved", getOvertimesApprovedController);

// Get Overtime route
router.get("/:id", getOvertimeController);

// Get Overtime Subordinate route
router.get("/subordinate/:id", getOvertimeSubordinateController);

// Update Overtime route
router.put("/:id", updateOvertimeController);

// Update Overtime Subordinate Approved route
router.put(
  "/subordinateApproved/:id",
  updateOvertimeSubordinateApprovedController
);

// Update Overtime Subordinate Disapproved route
router.put(
  "/subordinateDisapproved/:id",
  updateOvertimeSubordinateDisapprovedController
);

// Update Overtime Subordinate Approved 2 route
router.put(
  "/subordinateApproved2/:id",
  updateOvertimeSubordinateApproved2Controller
);

// Update Overtime Subordinate Disapproved 2 route
router.put(
  "/subordinateDisapproved2/:id",
  updateOvertimeSubordinateDisapproved2Controller
);

// Delete Overtime route
router.delete("/:id", deleteOvertimeController);

module.exports = router;
