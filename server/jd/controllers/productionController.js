// controllers/productionController.js.js

const { broadcastMessage } = require("../../websocketManager");
const EquipmentJD = require("../models/Equipment");
const InventoryJD = require("../models/Inventory");
const InventoryLedgerJD = require("../models/InventoryLedger");
const ProductionJD = require("../models/Production");

// Create Production controller
async function createProductionJDController(req, res) {
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

      const newEntry = await ProductionJD.create({
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

        broadcastMessage({
          type: "NEW_EQUIPMENT_JD",
          data: newEquipmentEntry,
        });
      }

      broadcastMessage({
        type: "NEW_PRODUCTION_JD",
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

// Get Productions controller
async function getProductionJDsController(req, res) {
  try {
    // Fetch all production from the database
    const production = await ProductionJD.findAll({
      include: {
        model: InventoryLedgerJD,
        as: "InventoryLedgerJD",
        attributes: ["id", "quantity"],
        include: {
          model: InventoryJD,
          as: "InventoryJD",
          attributes: ["id", "quantity", "unit", "unitPrice", "amount"],
        },
      },
      order: [["transactionDate", "ASC"]],
    });

    res.json({ production });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Production controller
async function updateProductionJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Production with ID:", id);

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

      // Find the Production by ID and update it
      const updatedProductionJD = await ProductionJD.findByPk(id);

      if (updatedProductionJD) {
        // Update Production attributes

        updatedProductionJD.transactionDate = transactionDate;
        updatedProductionJD.transactionDetails =
          transactionDetails?.toUpperCase();
        updatedProductionJD.transactionCategory = transactionCategory;
        updatedProductionJD.fundSource = fundSource;
        updatedProductionJD.fundAllocation = fundAllocation;
        updatedProductionJD.amount = amount;
        updatedProductionJD.remarks = remarks;
        updatedProductionJD.updatedBy = createdBy;

        // Save the updated Production
        await updatedProductionJD.save();
        if (
          transactionCategory === "INGREDIENTS" ||
          transactionCategory === "PACKAGING AND LABELING"
        ) {
          const updatedInventoryJD = await InventoryJD.findOne({
            where: { transactionId: updatedProductionJD.id },
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
            where: { transactionId: updatedProductionJD.id },
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
          type: "UPDATED_PRODUCTION_JD",
          data: updatedProductionJD,
        });

        res.status(201).json({
          message: "updated successfully!",
        });
      } else {
        // If Production with the specified ID was not found
        res.status(404).json({ message: `Production with ID ${id} not found` });
      }
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Production:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Production controller
async function deleteProductionJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting ProductionJD with ID:", id);

    // Find the ProductionJD by ID
    const productionToDelete = await ProductionJD.findByPk(id);

    if (productionToDelete) {
      // Update the deletedBy field
      productionToDelete.updatedBy = deletedBy;
      productionToDelete.deletedBy = deletedBy;
      await productionToDelete.save();

      // Find related InventoryJD and EquipmentJD by transactionId (ProductionJD.id)
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

      // Soft delete the ProductionJD (sets deletedAt timestamp)
      await productionToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PRODUCTION_JD",
        data: productionToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
      });
    } else {
      // If ProductionJD with the specified ID was not found
      res.status(404).json({ message: `ProductionJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting ProductionJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getProductionJDsController,
  createProductionJDController,
  updateProductionJDController,
  deleteProductionJDController,
};
