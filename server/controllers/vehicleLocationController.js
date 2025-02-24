// controllers/vehicleLocationController.js

const { broadcastMessage } = require("../websocketManager");

let latestLocation = { latitude: 0, longitude: 0 }; // Store last known location

async function postVehicleLocation(req, res) {
  try {
    console.log("Connecting ...");

    // Extract latitude, longitude, and gpsData from request body
    let { latitude, longitude, gpsData } = req.body;

    console.log(req.body);

    // Extract latitude and longitude from gpsData if not already provided
    if (gpsData) {
      const match = gpsData.match(/(\d+\.\d+),(\d+\.\d+)/);
      if (match) {
        latitude = parseFloat(match[1]);
        longitude = parseFloat(match[2]);
      }
    }

    // Store latest location
    latestLocation = { latitude, longitude };

    // Log the received location
    console.log(
      `📍 Received Location: Latitude=${latitude}, Longitude=${longitude}. rawGPS=${gpsData}`
    );

    const formattedEntry = { latitude, longitude };

    broadcastMessage({
      type: "NEW_LOCATION",
      data: formattedEntry,
    });

    res.status(201).json({ message: "Submitted", latitude, longitude });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// New route to get the latest location
async function getLatestLocation(req, res) {
  console.log(latestLocation);
  res.status(200).json({ latestLocation });
}

module.exports = {
  postVehicleLocation,
  getLatestLocation,
};
