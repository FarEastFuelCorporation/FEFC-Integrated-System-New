// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes

const authRoutes = require("./auth");
const productCategoryRoutes = require("./productCategoryRoutes");
const ledgerRoutes = require("./ledgerRoutes");

router.use(authRoutes);
router.use("/productCategory", productCategoryRoutes);
router.use("/ledger", ledgerRoutes);

module.exports = router;
