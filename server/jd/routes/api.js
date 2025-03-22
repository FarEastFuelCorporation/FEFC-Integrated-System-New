// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes

const authRoutes = require("./auth");
// const travelOrderRoutes = require("./travelOrderRoutes");

router.use(authRoutes);
// router.use("/travelOrder", travelOrderRoutes);

module.exports = router;
