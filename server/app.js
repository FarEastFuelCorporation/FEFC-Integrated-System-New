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
const sequelize = require("./config/database");

// Import utility functions and models
require("./utils/associations");

const app = express();

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

// Serve static files from the React app located outside the server directory
app.use(express.static(path.join(__dirname, "../client/build")));

// Handle React routing, return all requests to React app
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

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

// Import API routes
const apiRoutes = require("./routes/api");
const IdInformationLocal = require("./models/IdInformationLocal");
const IdInformation = require("./models/IdInformation");

// Use the /api prefix for all API routes
app.use("/api", apiRoutes);

async function fetchCloudData() {
  return await IdInformationLocal.findAll(); // Get all records from YourTableName
}

async function insertIntoLocalDatabase(data) {
  console.log("Data to be inserted:", data); // Log the data
  return await IdInformation.bulkCreate(data, {
    updateOnDuplicate: [
      "employee_id",
      "first_name",
      "middle_name",
      "last_name",
      "affix",
      "type_of_employee",
      "designation",
      "url",
      "birthday",
      "contact_number",
      "address",
      "sss_no",
      "pag_ibig_no",
      "philhealth_no",
      "tin_no",
      "contact_person",
      "contact_person_number",
      "contact_person_address",
      "address2",
      "contact_person_address2",
      "date_expire",
      "profile_picture",
      "signature",
    ],
  });
}

// Function to initialize the application
async function initializeApp() {
  try {
    console.log("Syncing models to the database...");
    // await sequelize.sync({ alter: true });
    console.log("Models synced successfully.");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
}

// async function syncData() {
//   try {
//     const cloudData = await fetchCloudData();
//     const formattedData = cloudData.map((item) => item.toJSON()); // Convert to plain objects
//     await insertIntoLocalDatabase(formattedData);
//     console.log("Data synced successfully from YourTableName");
//   } catch (error) {
//     console.error("Error syncing data:", error);
//   }
// }

// syncData();

// Call the function to initialize the application
initializeApp();

module.exports = app;
