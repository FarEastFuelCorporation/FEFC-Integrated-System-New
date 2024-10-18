// routes/travelOrderRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTravelOrderController,
  getTravelOrdersController,
  getTravelOrderController,
  getTravelOrderSubordinateController,
  updateTravelOrderController,
  updateTravelOrderSubordinateApprovedController,
  updateTravelOrderSubordinateDisapprovedController,
  updateTravelOrderSubordinateApproved2Controller,
  updateTravelOrderSubordinateDisapproved2Controller,
  deleteTravelOrderController,
} = require("../controllers/travelOrderController");

// Create Travel Order route
router.post("/", createTravelOrderController);

// Get Travel Orders route
router.get("/", getTravelOrdersController);

// Get Travel Order route
router.get("/:id", getTravelOrderController);

// Get Travel Order Subordinate route
router.get("/subordinate/:id", getTravelOrderSubordinateController);

// Update Travel Order route
router.put("/:id", updateTravelOrderController);

// Update Travel Order Subordinate Approved route
router.put(
  "/subordinateApproved/:id",
  updateTravelOrderSubordinateApprovedController
);

// Update Travel Order Subordinate Disapproved route
router.put(
  "/subordinateDisapproved/:id",
  updateTravelOrderSubordinateDisapprovedController
);

// Update Travel Order Subordinate Approved 2 route
router.put(
  "/subordinateApproved2/:id",
  updateTravelOrderSubordinateApproved2Controller
);

// Update Travel Order Subordinate Disapproved 2 route
router.put(
  "/subordinateDisapproved2/:id",
  updateTravelOrderSubordinateDisapproved2Controller
);

// Delete Travel Order route
router.delete("/:id", deleteTravelOrderController);

module.exports = router;
