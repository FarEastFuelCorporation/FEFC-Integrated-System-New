// routes/productCategoryRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProductCategoryJDController,
  getProductCategoryJDsController,
  updateProductCategoryJDController,
  deleteProductCategoryJDController,
} = require("../controllers/productCategoryController");

// Create Product Category route
router.post("/", createProductCategoryJDController);

// Get Product Categories route
router.get("/", getProductCategoryJDsController);

// Update Product Category route
router.put("/:id", updateProductCategoryJDController);

// Delete Product Category route
router.delete("/:id", deleteProductCategoryJDController);

module.exports = router;
