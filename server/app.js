// app.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("events").EventEmitter.defaultMaxListeners = 50;

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const http = require("http");
const WebSocket = require("ws");

// Import utility functions and models
require("./utils/associations");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve Bootstrap files from the 'node_modules' folder
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// Set Cache-Control header to prevent caching
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.COOKIE === "true" }, // Use secure: true in production with HTTPS
  })
);

app.use(express.json()); // Middleware to parse JSON request bodies

// Middleware to check authentication
const { isAuthenticated } = require("./middlewares/auth");
app.use("/requests/*", isAuthenticated);
app.use("/marketing_Dashboard/*", isAuthenticated);
app.use("/dispatching_Dashboard/*", isAuthenticated);
app.use("/receiving_Dashboard/*", isAuthenticated);
app.use("/certification_Dashboard/*", isAuthenticated);
app.use("/hr_Dashboard/*", isAuthenticated);

// Route to check authentication status
app.get("/api/session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/gpsdata", (req, res) => {
  const gpsData = req.body.gpsData;

  if (!gpsData) {
    return res.status(400).send("GPS data is missing");
  }

  // Parse the NMEA GPRMC string to extract latitude and longitude
  const gpsParts = gpsData.split(",");

  if (gpsParts.length < 12 || gpsParts[2] !== "A") {
    return res.status(400).send("Invalid GPS data");
  }

  const latRaw = gpsParts[3];
  const latHemisphere = gpsParts[4];
  const lngRaw = gpsParts[5];
  const lngHemisphere = gpsParts[6];

  // Convert latitude and longitude to decimal format
  const latDegrees = parseInt(latRaw.substring(0, 2), 10);
  const latMinutes = parseFloat(latRaw.substring(2));
  let latitude = latDegrees + latMinutes / 60.0;
  if (latHemisphere === "S") latitude = -latitude;

  const lngDegrees = parseInt(lngRaw.substring(0, 3), 10);
  const lngMinutes = parseFloat(lngRaw.substring(3));
  let longitude = lngDegrees + lngMinutes / 60.0;
  if (lngHemisphere === "W") longitude = -longitude;

  const location = {
    latitude,
    longitude,
  };

  // Broadcast the GPS data to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(location));
    }
  });

  console.log(
    `GPS data received and processed. Lat: ${location.latitude}, Long: ${location.longitude}`
  );
  res
    .status(200)
    .send(
      `GPS data received and processed. Lat: ${location.latitude}, Long: ${location.longitude}`
    );
});

// Include your routes
const authRoutes = require("./routes/auth");
const othersRoutes = require("./routes/others");
const geoTableRoutes = require("./routes/geoTableRoutes");
const requestsRoutes = require("./routes/requests");
const clientRoutes = require("./routes/clientRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const typeOfWasteRoutes = require("./routes/typeOfWasteRoutes");
const treatmentProcessRoutes = require("./routes/treatmentProcessRoutes");
const vehicleTypeRoutes = require("./routes/vehicleTypeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const vehicleMaintenanceRequestRoutes = require("./routes/vehicleMaintenanceRequestRoutes");
const scrapTypeRoutes = require("./routes/scrapTypeRoutes");
const treatmentMachineRoutes = require("./routes/treatmentMachineRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const bookedTransactionRoutes = require("./routes/bookedTransactionRoutes");
const scheduledTransactionRoutes = require("./routes/scheduledTransactionRoutes");
const dispatchedTransactionRoutes = require("./routes/dispatchedTransactionRoutes");
const receivedTransactionRoutes = require("./routes/receivedTransactionRoutes");
const sortedTransactionRoutes = require("./routes/sortedTransactionRoutes");
const treatedTransactionRoutes = require("./routes/treatedTransactionRoutes");
const certifiedTransactionRoutes = require("./routes/certifiedTransactionRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const hrDashboardRoutes = require("./routes/hr_dashboard");
const employeeRoutes = require("./routes/employeeRoutes");
const employeeRecordRoutes = require("./routes/employeeRecordRoutes");
const employeeAttachmentRoutes = require("./routes/employeeAttachmentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const { error404Controller } = require("./controllers/othersController");
const sequelize = require("./config/database");

app.use(authRoutes);
app.use(othersRoutes);
app.use("/geoTable", geoTableRoutes);
app.use("/request", requestsRoutes);
app.use("/client", clientRoutes);
app.use("/quotation", quotationRoutes);
app.use("/typeOfWaste", typeOfWasteRoutes);
app.use("/treatmentProcess", treatmentProcessRoutes);
app.use("/vehicleType", vehicleTypeRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/vehicleMaintenanceRequest", vehicleMaintenanceRequestRoutes);
app.use("/scrapType", scrapTypeRoutes);
app.use("/treatmentMachine", treatmentMachineRoutes);
app.use("/attachment", attachmentRoutes);
app.use("/bookedTransaction", bookedTransactionRoutes);
app.use("/scheduledTransaction", scheduledTransactionRoutes);
app.use("/dispatchedTransaction", dispatchedTransactionRoutes);
app.use("/receivedTransaction", receivedTransactionRoutes);
app.use("/sortedTransaction", sortedTransactionRoutes);
app.use("/treatedTransaction", treatedTransactionRoutes);
app.use("/certifiedTransaction", certifiedTransactionRoutes);
app.use("/certificate", certificateRoutes);
app.use("/hrDashboard", hrDashboardRoutes);
app.use("/employee", employeeRoutes);
app.use("/employeeRecord", employeeRecordRoutes);
app.use("/employeeAttachment", employeeAttachmentRoutes);
app.use("/department", departmentRoutes);

app.use(error404Controller);

// Function to initialize the application
async function initializeApp() {
  try {
    console.log("Syncing models to the database...");
    await sequelize.sync({ alter: false });
    console.log("Models synced successfully.");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
}

// Call the function to initialize the application
initializeApp();

module.exports = app;
