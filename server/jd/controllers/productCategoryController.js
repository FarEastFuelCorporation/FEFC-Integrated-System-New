// controllers/productCategoryController.js.js

const ProductCategoryJD = require("../models/ProductCategory");

// Create Product Category controller
async function createProductCategoryJDController(req, res) {
  try {
    // Extracting data from the request body
    let { typeOfVehicle, createdBy } = req.body;

    typeOfVehicle = typeOfVehicle && typeOfVehicle.toUpperCase();

    // Creating a new vehicle type
    await ProductCategoryJD.create({
      typeOfVehicle,
      createdBy,
    });

    const vehicleTypes = await ProductCategoryJD.findAll();

    // Respond with the updated vehicle type data
    res.status(201).json({ vehicleTypes });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Product Categories controller
async function getProductCategoryJDsController(req, res) {
  try {
    // Fetch all categories from the database
    const categories = await ProductCategoryJD.findAll({
      order: [["category", "ASC"]],
    });

    res.json({ categories });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Product Category controller
async function updateProductCategoryJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating vehicle type with ID:", id);

    let { typeOfVehicle, createdBy } = req.body;
    console.log("Request body:", req.body);

    typeOfVehicle = typeOfVehicle && typeOfVehicle.toUpperCase();

    // Find the vehicle type by ID and update it
    const updatedProductCategoryJD = await ProductCategoryJD.findByPk(id);

    if (updatedProductCategoryJD) {
      // Update vehicle type attributes
      updatedProductCategoryJD.typeOfVehicle = typeOfVehicle;
      updatedProductCategoryJD.updatedBy = createdBy;

      // Save the updated vehicle type
      await updatedProductCategoryJD.save();

      const vehicleTypes = await ProductCategoryJD.findAll();

      // Respond with the updated vehicle type data
      res.json({
        vehicleType: updatedProductCategoryJD,
        vehicleTypes,
      });
    } else {
      // If vehicle type with the specified ID was not found
      res.status(404).json({ message: `Vehicle type with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating vehicle type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Product Category controller
async function deleteProductCategoryJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting ProductCategoryJD with ID:", id);

    // Find the ProductCategoryJD by ID
    const vehicleTypeToDelete = await ProductCategoryJD.findByPk(id);

    if (vehicleTypeToDelete) {
      // Update the deletedBy field
      vehicleTypeToDelete.updatedBy = deletedBy;
      vehicleTypeToDelete.deletedBy = deletedBy;
      await vehicleTypeToDelete.save();

      // Soft delete the ProductCategoryJD (sets deletedAt timestamp)
      await vehicleTypeToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `ProductCategoryJD with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If ProductCategoryJD with the specified ID was not found
      res
        .status(404)
        .json({ message: `ProductCategoryJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting ProductCategoryJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getProductCategoryJDsController,
  createProductCategoryJDController,
  updateProductCategoryJDController,
  deleteProductCategoryJDController,
};
