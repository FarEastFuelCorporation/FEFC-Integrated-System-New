// routes/productCategoryRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProductCategoryJDController,
  getProductCategoryJDsController,
  updateProductCategoryJDController,
  deleteProductCategoryJDController,
} = require("../controllers/productCategoryController");

// Create Vehicle Type route
router.post("/", createProductCategoryJDController);

// Get Vehicle Types route
router.get("/", getProductCategoryJDsController);

// Update Vehicle Type route
router.put("/:id", updateProductCategoryJDController);

// Delete Vehicle Type route
router.delete("/:id", deleteProductCategoryJDController);

module.exports = router;
