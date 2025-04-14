// controllers/inventoryController.js.js

const { broadcastMessage } = require("../../websocketManager");
const InventoryJD = require("../models/Inventory");
const InventoryLedgerJD = require("../models/InventoryLedger");

// Create Inventory controller
async function createInventoryJDController(req, res) {
  try {
    // Extracting data from the request body
    let { transactionDate, transactions, createdBy } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res
        .status(400)
        .json({ message: "Transactions must be a non-empty array" });
    }

    for (const transaction of transactions) {
      const {
        transactionDetails,
        transactionCategory,
        fundSource,
        fundAllocation,
        quantity,
        unit,
        unitPrice,
        amount,
        remarks,
      } = transaction;

      const newEntry = await InventoryJD.create({
        transactionDate,
        transactionDetails: transactionDetails?.toUpperCase(),
        transactionCategory: transactionCategory,
        fundSource: fundSource,
        fundAllocation: fundAllocation,
        amount: amount,
        remarks: remarks,
        createdBy,
      });

      if (
        transactionCategory === "INGREDIENTS" ||
        transactionCategory === "PACKAGING AND LABELING"
      ) {
        const newInventoryEntry = await InventoryJD.create({
          transactionId: newEntry.id,
          transactionDate,
          item: transactionDetails?.toUpperCase(),
          transaction: "IN",
          transactionCategory: transactionCategory,
          quantity: quantity,
          unit: unit,
          unitPrice: unitPrice,
          amount: amount,
          remarks: remarks,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_INVENTORY_JD",
          data: newInventoryEntry,
        });
      }

      broadcastMessage({
        type: "NEW_LEDGER_JD",
        data: newEntry,
      });
    }

    res.status(201).json({
      message: "Submitted successfully!",
      entries: createdEntries,
    });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Inventories controller
async function getInventoryJDsController(req, res) {
  try {
    // Fetch all inventory from the database
    const inventory = await InventoryJD.findAll({
      include: {
        model: InventoryLedgerJD,
        as: "InventoryLedgerJD",
        attributes: ["id", "transaction", "quantity"],
      },
      order: [
        ["createdAt", "DESC"], // Primary sort
        ["transactionDate", "DESC"], // Secondary sort
      ],
    });

    // Compute updatedQuantity for each inventory item
    const inventoryWithUpdatedQuantity = inventory.map((item) => {
      let updatedQuantity = 0;

      // Loop through associated InventoryLedgerJD transactions
      item.InventoryLedgerJD.forEach((ledger) => {
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

    // Fetch all InventoryLedger from the database
    const inventoryLedger = await InventoryLedgerJD.findAll({
      include: {
        model: InventoryJD,
        as: "InventoryJD",
        attributes: ["id", "item", "transactionCategory", "unit", "unitPrice"],
      },
      order: [["transactionDate", "DESC"]],
    });

    res.json({ inventory: inventoryWithUpdatedQuantity, inventoryLedger });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Inventory controller
async function updateInventoryJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Inventory with ID:", id);

    let { transactionDetails, createdBy } = req.body;

    transactionDetails = transactionDetails && transactionDetails.toUpperCase();

    // Find the Inventory by ID and update it
    const updatedInventoryJD = await InventoryJD.findByPk(id);

    if (updatedInventoryJD) {
      // Update Inventory attributes
      updatedInventoryJD.transactionDetails = transactionDetails;
      updatedInventoryJD.updatedBy = createdBy;

      // Save the updated Inventory
      await updatedInventoryJD.save();

      const updatedEntry = await InventoryJD.findByPk(id);

      broadcastMessage({
        type: "UPDATED_PRODUCT_CATEGORY_JD",
        data: updatedEntry,
      });

      res.status(201).json({
        message: "updated successfully!",
      });
    } else {
      // If Inventory with the specified ID was not found
      res.status(404).json({ message: `Inventory with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Inventory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Inventory controller
async function deleteInventoryJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting InventoryJD with ID:", id);

    // Find the InventoryJD by ID
    const inventoryToDelete = await InventoryJD.findByPk(id);

    if (inventoryToDelete) {
      // Update the deletedBy field
      inventoryToDelete.updatedBy = deletedBy;
      inventoryToDelete.deletedBy = deletedBy;
      await inventoryToDelete.save();

      // Soft delete the InventoryJD (sets deletedAt timestamp)
      await inventoryToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PRODUCT_CATEGORY_JD",
        data: inventoryToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
      });
    } else {
      // If InventoryJD with the specified ID was not found
      res.status(404).json({ message: `InventoryJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting InventoryJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getInventoryJDsController,
  createInventoryJDController,
  updateInventoryJDController,
  deleteInventoryJDController,
};
