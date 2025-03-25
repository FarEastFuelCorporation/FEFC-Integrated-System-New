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
require("./jd/utils/associations");

const app = express();

// Allow HTTP traffic (bypass Heroku's forced HTTPS)
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    console.log("Allowing HTTP traffic...");
  }
  next();
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
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
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
const apiJdRoutes = require("./jd/routes/api");
const syncronize = require("./syncronize");

// Use the /api prefix for all API routes
app.use("/api", apiRoutes);
app.use("/apiJD", apiJdRoutes);

const {
  syncIdInformationToLocal,
  handleAttendanceSync,
  syncSpecificEmployeeToLocal,
} = require("./syncronize");
const Quotation = require("./models/Quotation");
const EmployeeAttachmentLegal = require("./models/EmployeeAttachmentLegal");
const EmployeeAttachmentMemo = require("./models/EmployeeAttachmentMemo");
const BookedTransaction = require("./models/BookedTransaction");
const EmployeeRolesEmployeeJD = require("./jd/models/EmployeeRolesEmployee");
const EmployeeJD = require("./jd/models/Employee");
const UserJD = require("./jd/models/User");
const EmployeeRoleJD = require("./jd/models/EmployeeRole");
const sequelizeJD = require("./jd/config/database");

// Function to initialize the application
async function initializeApp() {
  try {
    console.log("Syncing models to the database...");
    // await sequelize.sync({ alter: false });
    await sequelizeJD.sync({ alter: false });
    // await EmployeeRoleJD.sync({ alter: true });

    // await handleAttendanceSync();

    // await syncIdInformationToLocal();
    // await syncSpecificEmployeeToLocal(25019);
    console.log("Models synced successfully.");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
}

// Call the function to initialize the application
initializeApp();

module.exports = app;
