// routes/certification_dashboard.js

const express = require("express");
const {
  getTreatmentProcessController,
  createTreatmentProcessController,
  updateTreatmentProcessController,
  deleteTreatmentProcessController,
  getTypeOfWastesController,
  createTypeOfWasteController,
  updateTypeOfWasteController,
  deleteTypeOfWasteController,
} = require("../controllers/certificationDashboardControllers");
const {
  getClientsController,
} = require("../controllers/marketingDashboardControllers");
const router = express.Router();

// Get Clients route
router.get("/clients", getClientsController);

// Get Treatment Process route
router.get("/treatmentProcess", getTreatmentProcessController);

// Create Treatment Process route
router.post("/treatmentProcess", createTreatmentProcessController);

// Update Treatment Process route
router.put("/treatmentProcess/:id", updateTreatmentProcessController);

// Delete Treatment Process route
router.delete("/treatmentProcess/:id", deleteTreatmentProcessController);

// Get Type Of Waste route
router.get("/typeOfWastes", getTypeOfWastesController);

// Create Type Of Waste route
router.post("/typeOfWastes", createTypeOfWasteController);

// Update Type Of Waste route
router.put("/typeOfWastes/:id", updateTypeOfWasteController);

// Delete Type Of Waste route
router.delete("/typeOfWastes/:id", deleteTypeOfWasteController);

module.exports = router;
