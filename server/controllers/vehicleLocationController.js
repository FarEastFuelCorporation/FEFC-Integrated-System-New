// controllers/vehicleLocationController.js

let latestLocation = { latitude: 0, longitude: 0 }; // Store last known location

async function postVehicleLocation(req, res) {
  try {
    console.log("Connecting ...");

    // Extract latitude and longitude from request body
    const { latitude, longitude, gpsData } = req.body;

    console.log(req.body);

    // Store latest location
    latestLocation = { latitude, longitude };

    // Log the received location
    console.log(
      `📍 Received Location: Latitude=${latitude}, Longitude=${longitude}. rawGPS=${gpsData}`
    );

    res.status(201).json({ message: "Submitted" });
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
