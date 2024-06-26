// controllers/dispatchingDashboardControllers.js

const Vehicle = require("../models/Vehicle");

require("dotenv").config();

// Get Clients controller
async function getVehiclesController(req, res) {
  try {
    // Fetch all clients from the database
    const vehicles = await Vehicle.findAll();

    res.json({ vehicles });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Treatment Process controller
async function createVehicleController(req, res) {
  try {
    // Extracting data from the request body
    const { treatmentProcess } = req.body;

    // Creating a new client
    const newTreatmentProcess = await TreatmentProcess.create({
      treatmentProcess,
    });

    // Respond with the newly created client data
    res.status(201).json(newTreatmentProcess);
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getVehiclesController, createVehicleController };
