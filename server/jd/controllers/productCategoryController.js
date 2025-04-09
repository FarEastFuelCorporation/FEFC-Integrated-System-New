// controllers/productCategoryController.js.js

const { broadcastMessage } = require("../../websocketManager");
const ProductJD = require("../models/Product");
const ProductCategoryJD = require("../models/ProductCategory");

// Create Product Category controller
async function createProductCategoryJDController(req, res) {
  try {
    // Extracting data from the request body
    const { productCategory, createdBy } = req.body;

    // Creating a new Product Category
    const newEntry = await ProductCategoryJD.create({
      productCategory: productCategory?.toUpperCase(),
      createdBy,
    });

    const newCategory = await ProductCategoryJD.findByPk(newEntry.id);

    broadcastMessage({
      type: "NEW_PRODUCT_CATEGORY_JD",
      data: newCategory,
    });

    res.status(201).json({
      message: "submitted successfully!",
    });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Product Categories controller
async function getProductCategoryJDsController(req, res) {
  try {
    // Fetch all productCategory from the database
    const productCategory = await ProductCategoryJD.findAll({
      include: [
        {
          model: ProductJD,
          as: "ProductJD",
          attributes: ["id"],
        },
      ],
      order: [["productCategory", "ASC"]],
    });

    // Compute updatedQuantity for each inventory item
    const productCategoryWithUpdatedQuantity = productCategory.map((item) => {
      return {
        ...item.toJSON(),
        productCount: item.ProductJD.length,
      };
    });

    res.json({ productCategory: productCategoryWithUpdatedQuantity });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Product Category controller
async function updateProductCategoryJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Product Category with ID:", id);

    const { productCategory, createdBy } = req.body;

    // Find the Product Category by ID and update it
    const updatedProductCategoryJD = await ProductCategoryJD.findByPk(id);

    if (updatedProductCategoryJD) {
      // Update Product Category attributes
      updatedProductCategoryJD.productCategory = productCategory?.toUpperCase();
      updatedProductCategoryJD.updatedBy = createdBy;

      // Save the updated Product Category
      await updatedProductCategoryJD.save();

      const updatedEntry = await ProductCategoryJD.findByPk(id);

      broadcastMessage({
        type: "UPDATED_PRODUCT_CATEGORY_JD",
        data: updatedEntry,
      });

      res.status(201).json({
        message: "updated successfully!",
      });
    } else {
      // If Product Category with the specified ID was not found
      res
        .status(404)
        .json({ message: `Product Category with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Product Category:", error);
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
    const productCategoryToDelete = await ProductCategoryJD.findByPk(id);

    if (productCategoryToDelete) {
      // Update the deletedBy field
      productCategoryToDelete.updatedBy = deletedBy;
      productCategoryToDelete.deletedBy = deletedBy;
      await productCategoryToDelete.save();

      // Soft delete the ProductCategoryJD (sets deletedAt timestamp)
      await productCategoryToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PRODUCT_CATEGORY_JD",
        data: productCategoryToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
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
