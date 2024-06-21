// routes/marketing_dashboard.js

const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const {
  getClientsController,
  createClientController,
  updateClientController,
  deleteClientController,
  createTreatmentProcessController,
  createTypeOfWastesController,
  getTypeOfWastesController,
} = require("../controllers/marketingDashboardControllers");

// Get Clients route
router.get("/clients", getClientsController);

// Create Client route
router.post("/clients", upload.single("clientPicture"), createClientController);

// Update Client route
router.put(
  "/clients/:id",
  upload.single("clientPicture"),
  updateClientController
);

// Delete Client route
router.delete("/clients/:id", deleteClientController);

// Create Treatment Process route
router.post("/treatmentProcess", createTreatmentProcessController);

// Get Type Of Waste route
router.get("/typeOfWastes", getTypeOfWastesController);

// Create Type Of Waste route
router.post("/typeOfWastes", createTypeOfWastesController);

module.exports = router;
