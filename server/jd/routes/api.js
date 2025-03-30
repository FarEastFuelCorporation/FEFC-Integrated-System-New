// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes

const authRoutes = require("./auth");
const productCategoryRoutes = require("./productCategoryRoutes");
const productRoutes = require("./productRoutes");
const ledgerRoutes = require("./ledgerRoutes");
const productionRoutes = require("./productionRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const equipmentRoutes = require("./equipmentRoutes");

router.use(authRoutes);
router.use("/productCategory", productCategoryRoutes);
router.use("/product", productRoutes);
router.use("/ledger", ledgerRoutes);
router.use("/production", productionRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/equipment", equipmentRoutes);

module.exports = router;
