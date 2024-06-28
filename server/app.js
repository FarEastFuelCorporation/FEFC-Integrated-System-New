// app.js
require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 25;

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// Import utility functions and models
require("./utils/associations");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up EJS as the view engine
app.set("view engine", "ejs");

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
    cookie: { secure: false }, // Use secure: true in production with HTTPS
  })
);

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
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Include your routes
const authRoutes = require("./routes/auth");
const othersRoutes = require("./routes/others");
const clientRoutes = require("./routes/client");
const requestsRoutes = require("./routes/requests");
const marketingDashboardRoutes = require("./routes/marketing_dashboard");
const dispatchingDashboardRoutes = require("./routes/dispatching_dashboard");
const receivingDashboardRoutes = require("./routes/receiving_dashboard");
const certificationDashboard = require("./routes/certification_dashboard");
const hrDashboardRoutes = require("./routes/hr_dashboard");
const { error404Controller } = require("./controllers/othersController");
const sequelize = require("./config/database");

app.use(authRoutes);
app.use(othersRoutes);
app.use("/client", clientRoutes);
app.use("/requests", requestsRoutes);
app.use("/marketingDashboard", marketingDashboardRoutes);
app.use("/dispatchingDashboard", dispatchingDashboardRoutes);
app.use("/receivingDashboard", receivingDashboardRoutes);
app.use("/certificationDashboard", certificationDashboard);
app.use("/hrDashboard", hrDashboardRoutes);

app.use(express.json()); // Middleware to parse JSON request bodies
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
