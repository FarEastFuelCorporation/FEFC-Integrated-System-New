// controllers/ledgerController.js.js

const { broadcastMessage } = require("../../websocketManager");
const EquipmentJD = require("../models/Equipment");
const EquipmentLedgerJD = require("../models/EquipmentLedger");
const InventoryJD = require("../models/Inventory");
const InventoryLedgerJD = require("../models/InventoryLedger");
const LedgerJD = require("../models/Ledger");

// Create Ledger controller
async function createLedgerJDController(req, res) {
  try {
    // Extracting data from the request body
    const { transactionDate, transactions, createdBy } = req.body;

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

      const newEntry = await LedgerJD.create({
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

        await InventoryLedgerJD.create({
          inventoryId: newInventoryEntry.id,
          transactionDate,
          transaction: "IN",
          quantity: quantity,
          remarks: remarks,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_INVENTORY_JD",
          data: newInventoryEntry,
        });
      } else if (transactionCategory === "EQUIPMENTS") {
        const newEquipmentEntry = await EquipmentJD.create({
          transactionId: newEntry.id,
          transactionDate,
          equipmentName: transactionDetails?.toUpperCase(),
          transaction: "IN",
          amount: amount,
          remarks: remarks,
          createdBy,
        });

        await EquipmentLedgerJD.create({
          equipmentId: newEquipmentEntry.id,
          transactionDate,
          transaction: "IN",
          amount: amount,
          remarks: remarks,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_EQUIPMENT_JD",
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
    });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Ledgers controller
async function getLedgerJDsController(req, res) {
  try {
    // Fetch all ledger from the database
    const ledger = await LedgerJD.findAll({
      include: {
        model: InventoryJD,
        as: "InventoryJD",
        attributes: ["id", "quantity", "unit", "unitPrice", "amount"],
      },
      order: [["transactionDate", "DESC"]],
    });

    res.json({ ledger });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Ledger controller
async function updateLedgerJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Ledger with ID:", id);

    const { transactionDate, transactions, createdBy } = req.body;

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

      // Find the Ledger by ID and update it
      const updatedLedgerJD = await LedgerJD.findByPk(id);

      if (updatedLedgerJD) {
        // Update Ledger attributes

        updatedLedgerJD.transactionDate = transactionDate;
        updatedLedgerJD.transactionDetails = transactionDetails?.toUpperCase();
        updatedLedgerJD.transactionCategory = transactionCategory;
        updatedLedgerJD.fundSource = fundSource;
        updatedLedgerJD.fundAllocation = fundAllocation;
        updatedLedgerJD.amount = amount;
        updatedLedgerJD.remarks = remarks;
        updatedLedgerJD.updatedBy = createdBy;

        // Save the updated Ledger
        await updatedLedgerJD.save();
        if (
          transactionCategory === "INGREDIENTS" ||
          transactionCategory === "PACKAGING AND LABELING"
        ) {
          const updatedInventoryJD = await InventoryJD.findOne({
            where: { transactionId: updatedLedgerJD.id },
          });

          updatedInventoryJD.transactionDate = transactionDate;
          updatedInventoryJD.item = transactionDetails?.toUpperCase();
          updatedInventoryJD.transactionCategory = transactionCategory;
          updatedInventoryJD.quantity = quantity;
          updatedInventoryJD.unit = unit;
          updatedInventoryJD.unitPrice = unitPrice;
          updatedInventoryJD.amount = amount;
          updatedInventoryJD.remarks = remarks;
          updatedInventoryJD.updatedBy = createdBy;

          // Save the updated Inventory
          await updatedInventoryJD.save();

          broadcastMessage({
            type: "UPDATED_INVENTORY_JD",
            data: updatedInventoryJD,
          });
        } else if (transactionCategory === "EQUIPMENTS") {
          const updatedEquipmentJD = await EquipmentJD.findOne({
            where: { transactionId: updatedLedgerJD.id },
          });

          updatedEquipmentJD.transactionDate = transactionDate;
          updatedEquipmentJD.equipmentName = transactionDetails?.toUpperCase();
          updatedEquipmentJD.amount = amount;
          updatedEquipmentJD.remarks = remarks;
          updatedEquipmentJD.updatedBy = createdBy;

          // Save the updated Equipment
          await updatedEquipmentJD.save();

          broadcastMessage({
            type: "UPDATED_EQUIPMENT_JD",
            data: updatedEquipmentJD,
          });
        }

        broadcastMessage({
          type: "UPDATED_LEDGER_JD",
          data: updatedLedgerJD,
        });

        res.status(201).json({
          message: "updated successfully!",
        });
      } else {
        // If Ledger with the specified ID was not found
        res.status(404).json({ message: `Ledger with ID ${id} not found` });
      }
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Ledger:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Ledger controller
async function deleteLedgerJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting LedgerJD with ID:", id);

    // Find the LedgerJD by ID
    const ledgerToDelete = await LedgerJD.findByPk(id);

    if (ledgerToDelete) {
      // Update the deletedBy field
      ledgerToDelete.updatedBy = deletedBy;
      ledgerToDelete.deletedBy = deletedBy;
      await ledgerToDelete.save();

      // Find related InventoryJD and EquipmentJD by transactionId (LedgerJD.id)
      const inventoriesToDelete = await InventoryJD.findAll({
        where: { transactionId: id },
      });
      const equipmentToDelete = await EquipmentJD.findAll({
        where: { transactionId: id },
      });

      // Soft delete InventoryJD records
      for (const inventory of inventoriesToDelete) {
        inventory.updatedBy = deletedBy;
        inventory.deletedBy = deletedBy;
        await inventory.save();
        await inventory.destroy();
        broadcastMessage({
          type: "DELETED_INVENTORY_JD",
          data: inventory.id,
        });
      }

      // Soft delete EquipmentJD records
      for (const equipment of equipmentToDelete) {
        equipment.updatedBy = deletedBy;
        equipment.deletedBy = deletedBy;
        await equipment.save();
        await equipment.destroy();
        broadcastMessage({
          type: "DELETED_EQUIPMENT_JD",
          data: equipment.id,
        });
      }

      // Soft delete the LedgerJD (sets deletedAt timestamp)
      await ledgerToDelete.destroy();

      broadcastMessage({
        type: "DELETED_LEDGER_JD",
        data: ledgerToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
      });
    } else {
      // If LedgerJD with the specified ID was not found
      res.status(404).json({ message: `LedgerJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting LedgerJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getLedgerJDsController,
  createLedgerJDController,
  updateLedgerJDController,
  deleteLedgerJDController,
};
