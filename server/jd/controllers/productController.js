// controllers/productController.js.js

const { broadcastMessage } = require("../../websocketManager");
const ProductJD = require("../models/Product");
const ProductCategoryJD = require("../models/ProductCategory");
const ProductLedgerJD = require("../models/ProductLedger");

// Create Product controller
async function createProductJDController(req, res) {
  try {
    // Extracting data from the request body
    const { productCategoryId, productName, createdBy } = req.body;

    // Creating a newProduct Product
    const newProductEntry = await ProductJD.create({
      productCategoryId,
      productName: productName?.toUpperCase(),
      createdBy,
    });

    const newProduct = await ProductJD.findByPk(newProductEntry.id, {
      include: {
        model: ProductCategoryJD,
        as: "ProductCategoryJD",
        attributes: ["id", "productCategory"],
      },
    });

    broadcastMessage({
      type: "NEW_PRODUCT_JD",
      data: newProduct,
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

// Get Products controller
async function getProductJDsController(req, res) {
  try {
    // Fetch all product from the database
    const product = await ProductJD.findAll({
      include: [
        {
          model: ProductCategoryJD,
          as: "ProductCategoryJD",
          attributes: ["id", "productCategory"],
        },
        {
          model: ProductLedgerJD,
          as: "ProductLedgerJD",
          attributes: ["id", "transaction", "quantity"],
        },
      ],
      order: [["productName", "ASC"]],
    });

    // Compute updatedQuantity for each inventory item
    const productWithUpdatedQuantity = product.map((item) => {
      let updatedQuantity = 0;

      // Loop through associated ProductLedgerJD transactions
      item.ProductLedgerJD.forEach((ledger) => {
        if (ledger.transaction === "IN") {
          updatedQuantity += ledger.quantity;
        } else if (
          ledger.transaction === "OUT" ||
          ledger.transaction === "USED"
        ) {
          updatedQuantity -= ledger.quantity;
        }
      });

      return {
        ...item.toJSON(),
        updatedQuantity, // Add computed updatedQuantity to each inventory item
      };
    });

    res.json({ product: productWithUpdatedQuantity });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Product controller
async function updateProductJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Product with ID:", id);

    const { productCategoryId, productName, createdBy } = req.body;

    // Find the Product by ID and update it
    const updatedProductJD = await ProductJD.findByPk(id);

    if (updatedProductJD) {
      // Update Product attributes
      updatedProductJD.productCategoryId = productCategoryId;
      updatedProductJD.productName = productName?.toUpperCase();
      updatedProductJD.updatedBy = createdBy;

      // Save the updated Product
      await updatedProductJD.save();

      const updatedEntry = await ProductJD.findByPk(id, {
        include: {
          model: ProductCategoryJD,
          as: "ProductCategoryJD",
          attributes: ["id", "productCategory"],
        },
      });

      broadcastMessage({
        type: "UPDATED_PRODUCT_JD",
        data: updatedEntry,
      });

      res.status(201).json({
        message: "updated successfully!",
      });
    } else {
      // If Product with the specified ID was not found
      res.status(404).json({ message: `Product with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Product :", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Product controller
async function deleteProductJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting ProductJD with ID:", id);

    // Find the ProductJD by ID
    const productToDelete = await ProductJD.findByPk(id, {
      include: {
        model: ProductCategoryJD,
        as: "ProductCategoryJD",
        attributes: ["id", "productCategory"],
      },
    });

    if (productToDelete) {
      // Update the deletedBy field
      productToDelete.updatedBy = deletedBy;
      productToDelete.deletedBy = deletedBy;
      await productToDelete.save();

      // Soft delete the ProductJD (sets deletedAt timestamp)
      await productToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PRODUCT_JD",
        data: productToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
      });
    } else {
      // If ProductJD with the specified ID was not found
      res.status(404).json({ message: `ProductJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting ProductJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getProductJDsController,
  createProductJDController,
  updateProductJDController,
  deleteProductJDController,
};
