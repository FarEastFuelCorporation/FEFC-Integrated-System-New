// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes

const authRoutes = require("./auth");
const productCategoryRoutes = require("./productCategoryRoutes");
const ledgerRoutes = require("./ledgerRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const equipmentRoutes = require("./equipmentRoutes");

router.use(authRoutes);
router.use("/productCategory", productCategoryRoutes);
router.use("/ledger", ledgerRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/equipment", equipmentRoutes);

module.exports = router;
