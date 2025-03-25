// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes

const authRoutes = require("./auth");
const productCategoryRoutes = require("./productCategoryRoutes");

router.use(authRoutes);
router.use("/productCategory", productCategoryRoutes);

module.exports = router;
