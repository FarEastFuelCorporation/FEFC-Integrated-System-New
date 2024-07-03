// controllers/scheduledTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const VehicleType = require("../models/VehicleType");
const { Op, literal } = require("sequelize");

// Utility function to fetch pending transactions
async function fetchPendingTransactions() {
  return await BookedTransaction.findAll({
    attributes: [
      "id",
      "transactionId",
      "haulingDate",
      "haulingTime",
      "remarks",
      "createdAt",
    ],
    where: {
      id: {
        [Op.notIn]: literal(
          "(SELECT `bookedTransactionId` FROM `ScheduledTransactions` WHERE `deletedAt` IS NULL)"
        ),
      },
    },
    include: [
      {
        model: QuotationWaste,
        as: "QuotationWaste",
        attributes: ["wasteName"],
      },
      {
        model: QuotationTransportation,
        as: "QuotationTransportation",
        attributes: ["id"],
        include: [
          {
            model: VehicleType,
            as: "VehicleType",
            attributes: ["typeOfVehicle"],
          },
        ],
      },
      {
        model: Client,
        as: "Client",
        attributes: ["clientName"],
      },
    ],
    order: [["transactionId", "DESC"]],
  });
}

// Utility function to fetch finished transactions
async function fetchFinishedTransactions() {
  return await ScheduledTransaction.findAll({
    attributes: [
      "id",
      "bookedTransactionId",
      "scheduledDate",
      "scheduledTime",
      "remarks",
      "createdBy",
      "createdAt",
    ],
    include: [
      {
        model: BookedTransaction,
        as: "BookedTransaction",
        attributes: [
          "transactionId",
          "haulingDate",
          "haulingTime",
          "remarks",
          "createdAt",
        ],
        include: [
          {
            model: QuotationWaste,
            as: "QuotationWaste",
            attributes: ["wasteName"],
          },
          {
            model: QuotationTransportation,
            as: "QuotationTransportation",
            attributes: ["id"],
            include: [
              {
                model: VehicleType,
                as: "VehicleType",
                attributes: ["typeOfVehicle"],
              },
            ],
          },
          {
            model: Client,
            as: "Client",
            attributes: ["clientName"],
          },
        ],
        order: [["transactionId", "DESC"]],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
  });
}

// Create Scheduled Transaction controller
async function createScheduledTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledDate,
      scheduledTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new client
    await ScheduledTransaction.create({
      bookedTransactionId,
      scheduledDate,
      scheduledTime,
      remarks,
      createdBy,
    });

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Scheduled Transactions controller
async function getScheduledTransactionsController(req, res) {
  try {
    // Fetch pending and finished transactions
    const pendingTransactions = await fetchPendingTransactions();
    const finishedTransactions = await fetchFinishedTransactions();

    res.json({ pendingTransactions, finishedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Scheduled Transaction controller
async function updateScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating booked transaction with ID:", id);

    let {
      bookedTransactionId,
      scheduledDate,
      scheduledTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the booked transaction by UUID (id) and update it
    const updatedScheduledTransaction = await ScheduledTransaction.findByPk(id);

    if (updatedScheduledTransaction) {
      // Update booked transaction attributes
      updatedScheduledTransaction.bookedTransactionId = bookedTransactionId;
      updatedScheduledTransaction.scheduledDate = scheduledDate;
      updatedScheduledTransaction.scheduledTime = scheduledTime;
      updatedScheduledTransaction.remarks = remarks;
      updatedScheduledTransaction.statusId = statusId;
      updatedScheduledTransaction.updatedBy = createdBy;

      // Save the updated booked transaction
      await updatedScheduledTransaction.save();

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating booked transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Scheduled Transaction controller
async function deleteScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const scheduledTransactionToDelete = await ScheduledTransaction.findByPk(
      id
    );

    if (scheduledTransactionToDelete) {
      // Update the deletedBy field
      scheduledTransactionToDelete.updatedBy = deletedBy;
      scheduledTransactionToDelete.deletedBy = deletedBy;
      await scheduledTransactionToDelete.save();

      console.log(scheduledTransactionToDelete.bookedTransactionId);

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        scheduledTransactionToDelete.bookedTransactionId
      );
      updatedBookedTransaction.statusId = 1;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await scheduledTransactionToDelete.destroy();

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
    } else {
      // If scheduled transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Scheduled Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createScheduledTransactionController,
  getScheduledTransactionsController,
  updateScheduledTransactionController,
  deleteScheduledTransactionController,
};
