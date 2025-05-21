// controllers/commissionControllers.js

const Client = require("../models/Client");
const EmployeeRecord = require("../models/EmployeeRecord");
const CommissionWaste = require("../models/CommissionWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const QuotationWaste = require("../models/QuotationWaste");
const Quotation = require("../models/Quotation");
const Commission = require("../models/Commission");
const generateCommissionCode = require("../utils/generateCommissionCode");

// Create Commission controller
async function createCommissionController(req, res) {
  const {
    clientId,
    employeeId,
    transactionDate,
    remarks,
    createdBy,
    items, // This is the array of items (wastes)
  } = req.body;

  const commissionCode = await generateCommissionCode(); // Generate a new commission code

  try {
    // Create the commission record
    const commission = await Commission.create({
      employeeId,
      clientId,
      commissionCode,
      transactionDate,
      remarks: remarks?.toUpperCase() || "",
      createdBy,
    });

    // Create the commission items associated with this commission
    await Promise.all(
      items.map(async (item) => {
        const { quotationWasteId, amount } = item;

        // Validation for each item
        if (!quotationWasteId || quotationWasteId.trim() === "") {
          throw new Error("Waste Type is required for each item.");
        }

        if (amount <= 0) {
          throw new Error("Amount must be greater than 0 for each item.");
        }

        return await CommissionWaste.create({
          commissionId: commission.id,
          quotationWasteId,
          amount,
          createdBy,
        });
      })
    );

    // Retrieve the commission with its items and related data for the response
    const commissions = await Commission.findAll({
      where: { id: commission.id },
      include: [
        {
          model: CommissionWaste,
          as: "CommissionWaste",
          include: [
            {
              model: QuotationWaste,
              as: "QuotationWaste",
            },
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
      ],
      order: [["commissionCode", "ASC"]],
    });

    // Respond with the newly created commission and its associated items
    res.status(201).json({ commissions });
  } catch (error) {
    console.error("Error creating commission:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create commission" });
  }
}

// Get Commissions controller
async function getCommissionsController(req, res) {
  try {
    // Fetch all commissions from the database
    const commissions = await Commission.findAll({
      include: [
        {
          model: CommissionWaste,
          as: "CommissionWaste",
          include: [
            {
              model: QuotationWaste,
              as: "QuotationWaste",
              include: [
                {
                  model: TypeOfWaste,
                  as: "TypeOfWaste",
                  attributes: ["wasteCode"],
                },
              ],
            },
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
      ],
    });

    // Send the formatted data
    res.json({ commissions });
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get Commission controller
async function getCommissionController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all clients from the database
    const commissions = await Commission.findAll({
      include: [
        {
          model: CommissionWaste,
          as: "CommissionWaste",
          include: [
            {
              model: QuotationWaste,
              as: "QuotationWaste",
              include: [
                {
                  model: TypeOfWaste,
                  as: "TypeOfWaste",
                  attributes: ["wasteCode"],
                },
              ],
            },
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
          where: {
            status: "active",
            clientId: id,
          },
        },
      ],

      order: [["commissionCode", "ASC"]],
    });

    res.json({ commissions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Commission controller
async function updateCommissionController(req, res) {
  const {
    id,
    clientId,
    employeeId,
    commissionCode,
    transactionDate,
    remarks,
    createdBy,
    items,
  } = req.body;

  try {
    const commission = await Commission.findByPk(id);
    if (!commission) {
      return res.status(404).json({ error: "Commission not found." });
    }

    // Update main commission
    await commission.update({
      employeeId,
      clientId,
      commissionCode,
      transactionDate,
      remarks: remarks?.toUpperCase() || "",
      createdBy,
    });

    // Get existing CommissionWaste entries
    const existingItems = await CommissionWaste.findAll({
      where: { commissionId: id },
    });

    // Track incoming item IDs
    const incomingIds = items
      .filter((item) => item.id) // only items with IDs
      .map((item) => item.id);

    // Delete CommissionWaste items not present in incoming data
    await Promise.all(
      existingItems.map(async (existingItem) => {
        if (!incomingIds.includes(existingItem.id.toString())) {
          await existingItem.destroy(); // delete removed items
        }
      })
    );

    // Add or update items
    await Promise.all(
      items.map(async (item) => {
        const { id: itemId, quotationWasteId, amount } = item;

        if (!quotationWasteId || quotationWasteId.trim() === "") {
          throw new Error("Waste Type is required for each item.");
        }

        if (amount <= 0) {
          throw new Error("Amount must be greater than 0 for each item.");
        }

        if (itemId) {
          const existingItem = await CommissionWaste.findByPk(itemId);
          if (existingItem) {
            return await existingItem.update({
              quotationWasteId,
              amount,
              createdBy,
            });
          }
        }

        // If no id or not found, create new
        await CommissionWaste.create({
          commissionId: id,
          quotationWasteId,
          amount,
          createdBy,
        });
      })
    );

    // Final fetch
    const commissions = await Commission.findAll({
      where: { id },
      include: [
        {
          model: CommissionWaste,
          as: "CommissionWaste",
          include: [
            {
              model: QuotationWaste,
              as: "QuotationWaste",
            },
          ],
        },
        {
          model: EmployeeRecord,
          as: "EmployeeRecord",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
      ],
      order: [["commissionCode", "ASC"]],
    });

    res.status(200).json({ commissions });
  } catch (error) {
    console.error("Error updating commission:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update commission" });
  }
}

// Delete Commission controller
async function deleteCommissionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Soft deleting commission with ID:", id);

    // Find the commission by primary key
    const commissionToDelete = await Commission.findByPk(id);

    if (!commissionToDelete) {
      return res
        .status(404)
        .json({ message: `Commission with ID ${id} not found` });
    }

    // Soft delete associated CommissionWaste records
    await CommissionWaste.destroy({
      where: { commissionId: id },
    });

    // Soft delete the commission itself
    await commissionToDelete.destroy();

    res.json({
      message: `Commission ${commissionToDelete.commissionCode} and its items soft-deleted successfully`,
    });
  } catch (error) {
    console.error("Error soft-deleting commission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getCommissionsController,
  getCommissionController,
  createCommissionController,
  updateCommissionController,
  deleteCommissionController,
};
