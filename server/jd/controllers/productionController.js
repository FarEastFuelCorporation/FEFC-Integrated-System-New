// controllers/productionController.js.js

const { broadcastMessage } = require("../../websocketManager");
const EquipmentJD = require("../models/Equipment");
const EquipmentLedgerJD = require("../models/EquipmentLedger");
const InventoryJD = require("../models/Inventory");
const InventoryLedgerJD = require("../models/InventoryLedger");
const LedgerJD = require("../models/Ledger");
const ProductJD = require("../models/Product");
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

    let batch;

    for (const output of outputs) {
      if (output.outputType === "PRODUCT") {
        batch = await generateBatchId("BATCH");
        break;
      } else if (output.outputType === "INGREDIENT") {
        batch = await generateBatchId("INGREDIENT");
        break;
      } else if (output.outputType === "PACKAGING AND LABELING") {
        batch = await generateBatchId("PACKAGING AND LABELING");
        break;
      }
    }

    console.log("batch", batch);

    const newProductionEntry = await ProductionJD.create({
      transactionDate,
      batch: batch,
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

      const newProductEntry = await ProductJD.findByPk(id, {
        attributes: ["id", "productName"],
      });

      if (outputType === "PRODUCT") {
        const newLedgerEntry = await LedgerJD.create(
          {
            batchId: newProductionEntry.id,
            transactionDate,
            transactionDetails: newProductEntry.productName,
            transactionCategory: "PRODUCTION",
            fundSource: "CASH IN",
            fundAllocation: "UNSOLD GOODS",
            amount,
            remarks: batch,
            createdBy,
          },
          { validate: true }
        );

        broadcastMessage({
          type: "NEW_LEDGER_JD",
          data: newLedgerEntry,
        });

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
      } else if (
        outputType === "INGREDIENT" ||
        outputType === "PACKAGING AND LABELING"
      ) {
        const newEntry = await LedgerJD.create({
          batchId: newProductionEntry.id,
          transactionDate,
          transactionDetails: id?.toUpperCase(),
          transactionCategory:
            outputType === "INGREDIENT"
              ? "INGREDIENTS"
              : "PACKAGING AND LABELING",
          fundSource: "CASH IN",
          fundAllocation:
            outputType === "INGREDIENT"
              ? "INGREDIENTS"
              : "PACKAGING AND LABELING",
          amount: amount,
          remarks: batch,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_LEDGER_JD",
          data: newEntry,
        });

        const newInventoryEntry = await InventoryJD.create({
          transactionId: newEntry.id,
          transactionDate,
          item: id?.toUpperCase(),
          transaction: "IN",
          transactionCategory: "INGREDIENTS",
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

        const newInventoryLedgerEntry = await InventoryLedgerJD.create({
          inventoryId: newInventoryEntry.id,
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

    const ledgerEntry = [];

    // Only include equipment-related entries if there are equipments
    if (equipments && equipments.length > 0) {
      ledgerEntry.push(
        {
          batchId: newProductionEntry.id,
          transactionDate,
          transactionDetails: "EQUIPMENT DEPRECIATION",
          transactionCategory: "EQUIPMENTS",
          fundSource: "EQUIPMENTS",
          fundAllocation: "CASH OUT",
          amount: equipmentCost,
          remarks: batch,
          createdBy,
        },
        {
          batchId: newProductionEntry.id,
          transactionDate,
          transactionDetails: "EQUIPMENT FEE",
          transactionCategory: "EQUIPMENTS",
          fundSource: "CASH ON HAND",
          fundAllocation: "EQUIPMENT FUNDS",
          amount: equipmentCost,
          remarks: batch,
          createdBy,
        }
      );
    }

    // Only include UTILITIES if cost is greater than 0
    if (utilitiesCost && utilitiesCost > 0) {
      ledgerEntry.push({
        batchId: newProductionEntry.id,
        transactionDate,
        transactionDetails: "UTILITIES FEE",
        transactionCategory: "UTILITIES",
        fundSource: "CASH ON HAND",
        fundAllocation: "UTILITIES",
        amount: utilitiesCost,
        remarks: batch,
        createdBy,
      });
    }

    // Only include LABOR if cost is greater than 0
    if (laborCost && laborCost > 0) {
      ledgerEntry.push({
        batchId: newProductionEntry.id,
        transactionDate,
        transactionDetails: "LABOR FEE",
        transactionCategory: "LABOR",
        fundSource: "CASH ON HAND",
        fundAllocation: "LABOR",
        amount: laborCost,
        remarks: batch,
        createdBy,
      });
    }

    const newLedgerEntry = await LedgerJD.bulkCreate(ledgerEntry, {
      validate: true,
    });

    broadcastMessage({
      type: "NEW_LEDGER_JD",
      data: newLedgerEntry,
    });

    const production = await ProductionJD.findByPk(newProductionEntry.id, {
      include: [
        {
          model: InventoryLedgerJD,
          as: "InventoryLedgerJD",
          attributes: ["id", "quantity", "transaction", "remarks"],
          include: {
            model: InventoryJD,
            as: "InventoryJD",
            attributes: [
              "id",
              "item",
              "transactionCategory",
              "quantity",
              "unit",
              "unitPrice",
              "amount",
            ],
          },
        },
        {
          model: EquipmentLedgerJD,
          as: "EquipmentLedgerJD",
          attributes: ["id", "amount"],
          include: {
            model: EquipmentJD,
            as: "EquipmentJD",
            attributes: ["id", "equipmentName", "amount"],
          },
        },
        {
          model: ProductLedgerJD,
          as: "ProductLedgerJD",
          attributes: [
            "id",
            "productId",
            "quantity",
            "unit",
            "unitPrice",
            "amount",
          ],
        },
      ],
      order: [["transactionDate", "DESC"]],
    });

    broadcastMessage({
      type: "NEW_PRODUCTION_JD",
      data: production,
    });

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
      include: [
        {
          model: InventoryLedgerJD,
          as: "InventoryLedgerJD",
          attributes: ["id", "quantity", "transaction", "remarks"],
          include: {
            model: InventoryJD,
            as: "InventoryJD",
            attributes: [
              "id",
              "item",
              "transactionCategory",
              "quantity",
              "unit",
              "unitPrice",
              "amount",
            ],
          },
        },
        {
          model: EquipmentLedgerJD,
          as: "EquipmentLedgerJD",
          attributes: ["id", "amount"],
          include: {
            model: EquipmentJD,
            as: "EquipmentJD",
            attributes: ["id", "equipmentName", "amount"],
          },
        },
        {
          model: ProductLedgerJD,
          as: "ProductLedgerJD",
          attributes: [
            "id",
            "productId",
            "quantity",
            "unit",
            "unitPrice",
            "amount",
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"], // Primary sort
        ["transactionDate", "DESC"], // Secondary sort
      ],
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

    const production = await ProductionJD.findByPk(id);
    if (!production) {
      return res.status(404).json({ message: "Production not found" });
    }

    // Update main Production record
    await production.update({
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
      updatedBy: createdBy,
    });

    const batch = production.batch;

    // === INVENTORY LEDGER - INGREDIENTS & PACKAGINGS ===
    const currentInventoryLedger = await InventoryLedgerJD.findAll({
      where: { batchId: id },
    });

    const updatedInventory = [...ingredients, ...packagings];

    // Smart sync: delete missing, update existing, create new
    await Promise.all(
      currentInventoryLedger.map(async (entry) => {
        const match = updatedInventory.find(
          (i) => i.id === entry.inventoryId && entry.transaction === "USED"
        );
        if (!match) {
          await entry.destroy();
        }
      })
    );

    for (const item of updatedInventory) {
      const existing = currentInventoryLedger.find(
        (i) => i.inventoryId === item.id && i.transaction === "USED"
      );
      if (existing) {
        await existing.update({
          transactionDate,
          quantity: item.quantity,
          remarks: item.remarks,
          updatedBy: createdBy,
        });
        broadcastMessage({
          type: "UPDATED_INVENTORY_LEDGER_JD",
          data: existing,
        });
      } else {
        const newEntry = await InventoryLedgerJD.create({
          inventoryId: item.id,
          batchId: id,
          transactionDate,
          transaction: "USED",
          quantity: item.quantity,
          remarks: item.remarks,
          createdBy,
        });
        broadcastMessage({ type: "USED_INVENTORY_LEDGER_JD", data: newEntry });
      }
    }

    // === EQUIPMENT LEDGER ===
    const currentEquipment = await EquipmentLedgerJD.findAll({
      where: { batchId: id },
    });

    // Smart sync for Equipment Ledger: delete missing, update existing, create new
    await Promise.all(
      currentEquipment.map(async (entry) => {
        const match = equipments.find((e) => e.id === entry.equipmentId);
        if (!match) {
          await entry.destroy();
        }
      })
    );

    for (const equipment of equipments) {
      const existing = currentEquipment.find(
        (e) => e.equipmentId === equipment.id
      );
      if (existing) {
        await existing.update({
          transactionDate,
          amount: equipment.amount,
          remarks: equipment.remarks,
          updatedBy: createdBy,
        });
        broadcastMessage({ type: "UPDATED_EQUIPMENT_JD", data: existing });
      } else {
        const newEntry = await EquipmentLedgerJD.create({
          equipmentId: equipment.id,
          batchId: id,
          transactionDate,
          transaction: "USED",
          amount: equipment.amount,
          remarks: equipment.remarks,
          createdBy,
        });
        broadcastMessage({ type: "USED_EQUIPMENT_JD", data: newEntry });
      }
    }

    // === PRODUCT & INGREDIENT OUTPUTS ===
    const currentProductLedgers = await ProductLedgerJD.findAll({
      where: { batchId: id },
    });
    const currentInventoryLedgers = await InventoryLedgerJD.findAll({
      where: { batchId: id, transaction: "IN" },
    });
    const currentInventoryEntries = await InventoryJD.findAll({
      where: { transactionDate, remarks: batch },
    });
    const currentOutputLedgers = await LedgerJD.findAll({
      where: { remarks: batch },
    });

    await Promise.all([
      // Deleting all existing entries before adding new ones
      ...currentProductLedgers.map((e) => e.destroy()),
      ...currentInventoryLedgers.map((e) => e.destroy()),
      ...currentInventoryEntries.map((e) => e.destroy()),
      ...currentOutputLedgers.map((e) => e.destroy()),
    ]);

    for (const output of outputs) {
      const {
        outputType,
        id: outputId,
        unit,
        quantity,
        unitPrice,
        amount,
        remarks,
      } = output;

      if (outputType === "PRODUCT") {
        const product = await ProductJD.findByPk(outputId, {
          attributes: ["productName"],
        });

        const ledgerEntry = await LedgerJD.create({
          batchId: id,
          transactionDate,
          transactionDetails: product?.productName,
          transactionCategory: "PRODUCTION",
          fundSource: "CASH IN",
          fundAllocation: "UNSOLD GOODS",
          amount,
          remarks: batch,
          createdBy,
        });

        broadcastMessage({ type: "NEW_LEDGER_JD", data: ledgerEntry });

        const productEntry = await ProductLedgerJD.create({
          productId: outputId,
          batchId: id,
          transactionDate,
          transaction: "IN",
          quantity,
          unit,
          unitPrice,
          amount,
          remarks,
          createdBy,
        });

        broadcastMessage({ type: "NEW_PRODUCT_LEDGER_JD", data: productEntry });
      } else if (
        outputType === "INGREDIENT" ||
        outputType === "PACKAGING AND LABELING"
      ) {
        const ledgerEntry = await LedgerJD.create({
          transactionDate,
          transactionDetails: outputId?.toUpperCase(),
          transactionCategory:
            outputType === "INGREDIENT"
              ? "INGREDIENTS"
              : "PACKAGING AND LABELING",
          fundSource: "CASH IN",
          fundAllocation:
            outputType === "INGREDIENT"
              ? "INGREDIENTS"
              : "PACKAGING AND LABELING",
          amount,
          remarks,
          createdBy,
        });

        broadcastMessage({ type: "NEW_LEDGER_JD", data: ledgerEntry });

        const inventoryEntry = await InventoryJD.create({
          transactionId: ledgerEntry.id,
          transactionDate,
          item: outputId?.toUpperCase(),
          transaction: "IN",
          transactionCategory: "INGREDIENTS",
          quantity,
          unit,
          unitPrice,
          amount,
          remarks,
          createdBy,
        });

        broadcastMessage({ type: "NEW_INVENTORY_JD", data: inventoryEntry });

        const inventoryLedgerEntry = await InventoryLedgerJD.create({
          inventoryId: outputId,
          batchId: id,
          transactionDate,
          transaction: "IN",
          quantity,
          remarks,
          createdBy,
        });

        broadcastMessage({
          type: "NEW_INVENTORY_LEDGER_JD",
          data: inventoryLedgerEntry,
        });
      }
    }

    const ledgerEntry = [];

    // Only include equipment-related entries if there are equipments
    if (equipments && equipments.length > 0) {
      ledgerEntry.push(
        {
          batchId: id,
          transactionDate,
          transactionDetails: "EQUIPMENT DEPRECIATION",
          transactionCategory: "EQUIPMENTS",
          fundSource: "EQUIPMENTS",
          fundAllocation: "CASH OUT",
          amount: equipmentCost,
          remarks: batch,
          createdBy,
        },
        {
          batchId: id,
          transactionDate,
          transactionDetails: "EQUIPMENT FEE",
          transactionCategory: "EQUIPMENTS",
          fundSource: "CASH ON HAND",
          fundAllocation: "EQUIPMENT FUNDS",
          amount: equipmentCost,
          remarks: batch,
          createdBy,
        }
      );
    }

    // Only include UTILITIES if cost is greater than 0
    if (utilitiesCost && utilitiesCost > 0) {
      ledgerEntry.push({
        batchId: id,
        transactionDate,
        transactionDetails: "UTILITIES FEE",
        transactionCategory: "UTILITIES",
        fundSource: "CASH ON HAND",
        fundAllocation: "UTILITIES",
        amount: utilitiesCost,
        remarks: batch,
        createdBy,
      });
    }

    // Only include LABOR if cost is greater than 0
    if (laborCost && laborCost > 0) {
      ledgerEntry.push({
        batchId: id,
        transactionDate,
        transactionDetails: "LABOR FEE",
        transactionCategory: "LABOR",
        fundSource: "CASH ON HAND",
        fundAllocation: "LABOR",
        amount: laborCost,
        remarks: batch,
        createdBy,
      });
    }

    // === LEDGER ENTRIES for costs ===
    await LedgerJD.bulkCreate(ledgerEntry, {
      validate: true,
    }).then((entries) =>
      broadcastMessage({ type: "NEW_LEDGER_JD", data: entries })
    );

    res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Error updating production:", error);
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

// createProductionLedgerEntries();

module.exports = {
  getProductionJDsController,
  createProductionJDController,
  updateProductionJDController,
  deleteProductionJDController,
};
