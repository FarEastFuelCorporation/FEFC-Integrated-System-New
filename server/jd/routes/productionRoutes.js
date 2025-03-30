// routes/productionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProductionJDController,
  getProductionJDsController,
  updateProductionJDController,
  deleteProductionJDController,
} = require("../controllers/productionController");

// Create Production route
router.post("/", createProductionJDController);

// Get Productions route
router.get("/", getProductionJDsController);

// Update Production route
router.put("/:id", updateProductionJDController);

// Delete Production route
router.delete("/:id", deleteProductionJDController);

module.exports = router;
