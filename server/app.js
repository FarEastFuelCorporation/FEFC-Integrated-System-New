// app.js
require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 25;

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const cors = require('cors');
const path = require("path");
const bodyParser = require("body-parser");


// Import utility functions and models
require("./utils/associations");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Specify the origin you want to allow
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify the allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  credentials: true // Allow credentials (cookies, authorization headers, etc.) to be sent cross-origin
}));

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
    saveUninitialized: true,
    cookie: {
      secure: false, // Use only with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 10000, // Session expiration time
    },
  })
);

// Middleware to check authentication
const { isAuthenticated } = require("./middlewares/auth");
app.use("/requests", isAuthenticated);
app.use("/marketing_dashboard", isAuthenticated);
app.use("/dispatching_dashboard", isAuthenticated);
app.use("/hr_dashboard", isAuthenticated);

// Include your routes
const authRoutes = require("./routes/auth");
const othersRoutes = require("./routes/others");
const requestsRoutes = require("./routes/requests");
const marketingDashboardRoutes = require("./routes/marketing_dashboard");
const dispatchingDashboardRoutes = require("./routes/dispatching_dashboard");
const receivingDashboardRoutes = require("./routes/receiving_dashboard");
const hrDashboardRoutes = require("./routes/hr_dashboard");
const { error404Controller } = require("./controllers/othersController");
const sequelize = require("./config/database");

app.use(authRoutes);
app.use(othersRoutes);
app.use("/requests", requestsRoutes);
app.use("/marketing_dashboard", marketingDashboardRoutes);
app.use("/dispatching_dashboard", dispatchingDashboardRoutes);
app.use("/receiving_dashboard", receivingDashboardRoutes);
app.use("/hr_dashboard", hrDashboardRoutes);

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
