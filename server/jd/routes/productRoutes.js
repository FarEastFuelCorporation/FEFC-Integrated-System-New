// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProductJDController,
  getProductJDsController,
  updateProductJDController,
  deleteProductJDController,
} = require("../controllers/productController");

// Create Product route
router.post("/", createProductJDController);

// Get Products route
router.get("/", getProductJDsController);

// Update Product route
router.put("/:id", updateProductJDController);

// Delete Product route
router.delete("/:id", deleteProductJDController);

module.exports = router;
