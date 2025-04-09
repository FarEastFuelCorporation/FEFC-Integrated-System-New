// controllers/equipmentController.js.js

const { broadcastMessage } = require("../../websocketManager");
const EquipmentJD = require("../models/Equipment");
const EquipmentLedgerJD = require("../models/EquipmentLedger");

// Create Equipment controller
async function createEquipmentJDController(req, res) {
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

      const newEntry = await EquipmentJD.create({
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
        const newEquipmentEntry = await EquipmentJD.create({
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
          data: newEquipmentEntry,
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

// Get Equipments controller
async function getEquipmentJDsController(req, res) {
  try {
    // Fetch all equipment from the database
    const equipment = await EquipmentJD.findAll({
      include: {
        model: EquipmentLedgerJD,
        as: "EquipmentLedgerJD",
        attributes: ["id", "transaction", "amount"],
      },
      order: [["transactionDate", "DESC"]],
    });

    // Compute updatedAmount for each equipment item
    const inventoryWithUpdatedAmount = equipment.map((item) => {
      let updatedAmount = 0;

      // Loop through associated EquipmentLedgerJD transactions
      item.EquipmentLedgerJD.forEach((ledger) => {
        if (ledger.transaction === "IN") {
          updatedAmount += ledger.amount;
        } else if (
          ledger.transaction === "OUT" ||
          ledger.transaction === "USED"
        ) {
          updatedAmount -= ledger.amount;
        }
      });

      return {
        ...item.toJSON(),
        updatedAmount, // Add computed updatedAmount to each inventory item
      };
    });

    // Fetch all EquipmentLedger from the database
    const equipmentLedgerLedger = await EquipmentLedgerJD.findAll({
      include: {
        model: EquipmentJD,
        as: "EquipmentJD",
        attributes: ["id", "transactionDate", "equipmentName"],
      },
      order: [["transactionDate", "DESC"]],
    });

    res.json({ equipment: inventoryWithUpdatedAmount, equipmentLedgerLedger });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Equipment controller
async function updateEquipmentJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Equipment with ID:", id);

    let { transactionDetails, createdBy } = req.body;

    transactionDetails = transactionDetails && transactionDetails.toUpperCase();

    // Find the Equipment by ID and update it
    const updatedEquipmentJD = await EquipmentJD.findByPk(id);

    if (updatedEquipmentJD) {
      // Update Equipment attributes
      updatedEquipmentJD.transactionDetails = transactionDetails;
      updatedEquipmentJD.updatedBy = createdBy;

      // Save the updated Equipment
      await updatedEquipmentJD.save();

      const updatedEntry = await EquipmentJD.findByPk(id);

      broadcastMessage({
        type: "UPDATED_PRODUCT_CATEGORY_JD",
        data: updatedEntry,
      });

      res.status(201).json({
        message: "updated successfully!",
      });
    } else {
      // If Equipment with the specified ID was not found
      res.status(404).json({ message: `Equipment with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Equipment controller
async function deleteEquipmentJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting EquipmentJD with ID:", id);

    // Find the EquipmentJD by ID
    const equipmentToDelete = await EquipmentJD.findByPk(id);

    if (equipmentToDelete) {
      // Update the deletedBy field
      equipmentToDelete.updatedBy = deletedBy;
      equipmentToDelete.deletedBy = deletedBy;
      await equipmentToDelete.save();

      // Soft delete the EquipmentJD (sets deletedAt timestamp)
      await equipmentToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PRODUCT_CATEGORY_JD",
        data: equipmentToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
      });
    } else {
      // If EquipmentJD with the specified ID was not found
      res.status(404).json({ message: `EquipmentJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting EquipmentJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getEquipmentJDsController,
  createEquipmentJDController,
  updateEquipmentJDController,
  deleteEquipmentJDController,
};
