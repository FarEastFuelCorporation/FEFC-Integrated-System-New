// controllers/productionController.js.js

const { broadcastMessage } = require("../../websocketManager");
const EquipmentJD = require("../models/Equipment");
const EquipmentLedgerJD = require("../models/EquipmentLedger");
const InventoryJD = require("../models/Inventory");
const InventoryLedgerJD = require("../models/InventoryLedger");
const LedgerJD = require("../models/Ledger");
const ProductionJD = require("../models/Production");
const ProductLedgerJD = require("../models/ProductLedger");
const generateBatchId = require("../utils/generateBatchId");

// Create Production controller
async function createProductionJDController(req, res) {
  try {
    // Extracting data from the request body
    const {
      transactionDate,
      ingredientCost,
      packagingCost,
      equipmentCost,
      utilitiesCost,
      laborCost,
      totalCost,
      grossIncome,
      netIncome,
      profitMargin,
      ingredients,
      packagings,
      equipments,
      outputs,
      createdBy,
    } = req.body;

    const batchId = await generateBatchId();

    console.log("batchId", batchId);

    const newProductionEntry = await ProductionJD.create({
      transactionDate,
      batch: batchId,
      ingredientCost: ingredientCost,
      packagingCost: packagingCost,
      equipmentCost: equipmentCost,
      utilitiesCost: utilitiesCost,
      laborCost: laborCost,
      totalCost: totalCost,
      grossIncome: grossIncome,
      netIncome: netIncome,
      profitMargin: profitMargin,
      createdBy,
    });

    const ledgerEntry = [
      {
        transactionDate,
        transactionDetails: batchId,
        transactionCategory: "PRODUCTION",
        fundSource: "CASH IN",
        fundAllocation: "UNSOLD GOODS",
        amount: grossIncome,
        remarks: "",
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "EQUIPMENT DEPRECIATION",
        transactionCategory: "EQUIPMENTS",
        fundSource: "EQUIPMENTS",
        fundAllocation: "CASH OUT",
        amount: equipmentCost,
        remarks: batchId,
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "EQUIPMENT FEE",
        transactionCategory: "EQUIPMENTS",
        fundSource: "CASH ON HAND",
        fundAllocation: "EQUIPMENT FUNDS",
        amount: equipmentCost,
        remarks: batchId,
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "UTILITIES FEE",
        transactionCategory: "UTILITIES",
        fundSource: "CASH ON HAND",
        fundAllocation: "UTILITIES",
        amount: utilitiesCost,
        remarks: batchId,
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "LABOR FEE",
        transactionCategory: "LABOR",
        fundSource: "CASH ON HAND",
        fundAllocation: "LABOR",
        amount: laborCost,
        remarks: batchId,
        createdBy,
      },
    ];

    const newLedgerEntry = await LedgerJD.bulkCreate(ledgerEntry, {
      validate: true,
    });

    broadcastMessage({
      type: "NEW_LEDGER_JD",
      data: newLedgerEntry,
    });

    for (const ingredient of ingredients) {
      const { id, quantity, remarks } = ingredient;

      const newInventoryLedgerEntry = await InventoryLedgerJD.create({
        inventoryId: id,
        batchId: newProductionEntry.id,
        transactionDate,
        transaction: "USED",
        quantity: quantity,
        remarks: remarks,
        createdBy,
      });

      broadcastMessage({
        type: "USED_INVENTORY_LEDGER_JD",
        data: newInventoryLedgerEntry,
      });
    }

    for (const packaging of packagings) {
      const { id, quantity, remarks } = packaging;

      const newInventoryLedgerEntry = await InventoryLedgerJD.create({
        inventoryId: id,
        batchId: newProductionEntry.id,
        transactionDate,
        transaction: "USED",
        quantity: quantity,
        remarks: remarks,
        createdBy,
      });

      broadcastMessage({
        type: "USED_INVENTORY_LEDGER_JD",
        data: newInventoryLedgerEntry,
      });
    }

    for (const equipment of equipments) {
      const { id, amount, remarks } = equipment;

      const newEquipmentLedgerEntry = await EquipmentLedgerJD.create({
        equipmentId: id,
        batchId: newProductionEntry.id,
        transactionDate,
        transaction: "USED",
        amount: amount,
        remarks: remarks,
        createdBy,
      });

      broadcastMessage({
        type: "USED_EQUIPMENT_JD",
        data: newEquipmentLedgerEntry,
      });
    }

    for (const output of outputs) {
      const { outputType, id, unit, quantity, unitPrice, amount, remarks } =
        output;

      if (outputType === "PRODUCT") {
        const newProductLedgerEntry = await ProductLedgerJD.create({
          productId: id,
          batchId: newProductionEntry.id,
          transactionDate,
          transaction: "IN",
          quantity: quantity,
          unit: unit,
          unitPrice: unitPrice,
          amount: amount,
          remarks: remarks,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_PRODUCT_LEDGER_JD",
          data: newProductLedgerEntry,
        });
      } else if (outputType === "INGREDIENT") {
        const newInventoryLedgerEntry = await InventoryLedgerJD.create({
          productId: id,
          batchId: newProductionEntry.id,
          transactionDate,
          transaction: "IN",
          quantity: quantity,
          remarks: remarks,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_INVENTORY_LEDGER_JD",
          data: newInventoryLedgerEntry,
        });
      }
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
      order: [["transactionDate", "DESC"]],
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

async function createProductionLedgerEntries() {
  const transactionDate = "2025-03-16";
  const batchId = "BATCH 1";
  const grossIncome = 900;
  const equipmentCost = 20;
  const utilitiesCost = 90;
  const laborCost = 90;
  const createdBy = "00001";
  try {
    const ledgerEntry = [
      {
        transactionDate,
        transactionDetails: batchId,
        transactionCategory: "PRODUCTION",
        fundSource: "CASH IN",
        fundAllocation: "UNSOLD GOODS",
        amount: grossIncome,
        remarks: "",
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "EQUIPMENT DEPRECIATION",
        transactionCategory: "EQUIPMENTS",
        fundSource: "EQUIPMENTS",
        fundAllocation: "CASH OUT",
        amount: equipmentCost,
        remarks: batchId,
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "EQUIPMENT FEE",
        transactionCategory: "EQUIPMENTS",
        fundSource: "CASH ON HAND",
        fundAllocation: "EQUIPMENT FUNDS",
        amount: equipmentCost,
        remarks: batchId,
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "UTILITIES FEE",
        transactionCategory: "UTILITIES",
        fundSource: "CASH ON HAND",
        fundAllocation: "UTILITIES",
        amount: utilitiesCost,
        remarks: batchId,
        createdBy,
      },
      {
        transactionDate,
        transactionDetails: "LABOR FEE",
        transactionCategory: "LABOR",
        fundSource: "CASH ON HAND",
        fundAllocation: "LABOR",
        amount: laborCost,
        remarks: batchId,
        createdBy,
      },
    ];

    const newLedgerEntries = await LedgerJD.bulkCreate(ledgerEntry, {
      validate: true,
    });

    // Broadcast new entries
    if (broadcastMessage) {
      broadcastMessage({
        type: "NEW_LEDGER_JD",
        data: newLedgerEntries,
      });
    }

    return newLedgerEntries;
  } catch (error) {
    console.error("Error creating production ledger entries:", error);
    throw error;
  }
}

// createProductionLedgerEntries();

module.exports = {
  getProductionJDsController,
  createProductionJDController,
  updateProductionJDController,
  deleteProductionJDController,
};
