// controllers/dispatchedTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const VehicleType = require("../models/VehicleType");
const { Op, literal } = require("sequelize");
const Vehicle = require("../models/Vehicle");

// Utility function to fetch pending transactions
async function fetchPendingTransactions() {
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
          "statusId",
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
            attributes: ["id", "vehicleTypeId"],
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
            attributes: ["clientId", "clientName"],
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
    where: {
      id: {
        [Op.notIn]: literal(
          "(SELECT `scheduledTransactionId` FROM `DispatchedTransactions` WHERE `deletedAt` IS NULL)"
        ),
      },
    },
  });
}

// Utility function to fetch finished transactions
async function fetchFinishedTransactions() {
  return await DispatchedTransaction.findAll({
    attributes: [
      "id",
      "scheduledTransactionId",
      "vehicleId",
      "driverId",
      "helperId",
      "isDispatched",
      "dispatchedDate",
      "dispatchedTime",
      "remarks",
      "createdBy",
      "createdAt",
    ],
    include: [
      {
        model: ScheduledTransaction,
        as: "ScheduledTransaction",
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
              "statusId",
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
                attributes: ["id", "vehicleTypeId"],
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
                attributes: ["clientId", "clientName"],
              },
            ],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        ],
      },
      {
        model: Employee,
        as: "EmployeeDriver",
        attributes: ["firstName", "lastName"],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
      {
        model: Vehicle,
        as: "Vehicle",
        attributes: ["plateNumber"],
      },
    ],
    order: [["id", "DESC"]],
  });
}

// Create Dispatched Transaction controller
async function createDispatchedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledTransactionId,
      vehicleId,
      driverId,
      helperIds,
      isDispatched,
      dispatchedDate,
      dispatchedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new transaction
    await DispatchedTransaction.create({
      scheduledTransactionId,
      vehicleId,
      driverId,
      helperId: helperIds,
      isDispatched,
      dispatchedDate,
      dispatchedTime,
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

// Get Dispatched Transactions controller
async function getDispatchedTransactionsController(req, res) {
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

// Update Dispatched Transaction controller
async function updateDispatchedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating dispatched transaction with ID:", id);

    let {
      scheduledTransactionId,
      vehicleId,
      driverId,
      helperIds,
      isDispatched,
      dispatchedDate,
      dispatchedTime,
      remarks,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the dispatched transaction by UUID (id) and update it
    const updatedDispatchedTransaction = await DispatchedTransaction.findByPk(
      id
    );

    if (updatedDispatchedTransaction) {
      // Update dispatched transaction attributes
      updatedDispatchedTransaction.scheduledTransactionId =
        scheduledTransactionId;
      updatedDispatchedTransaction.vehicleId = vehicleId;
      updatedDispatchedTransaction.driverId = driverId;
      updatedDispatchedTransaction.helperId = helperIds;
      updatedDispatchedTransaction.isDispatched = isDispatched;
      updatedDispatchedTransaction.dispatchedDate = dispatchedDate;
      updatedDispatchedTransaction.dispatchedTime = dispatchedTime;
      updatedDispatchedTransaction.remarks = remarks;
      updatedDispatchedTransaction.updatedBy = createdBy;

      // Save the updated dispatched transaction
      await updatedDispatchedTransaction.save();

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
    } else {
      // If dispatched transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Dispatched Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating dispatched transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Dispatched Transaction controller
async function deleteDispatchedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const dispatchedTransactionToDelete = await DispatchedTransaction.findByPk(
      id
    );

    if (dispatchedTransactionToDelete) {
      // Update the deletedBy field
      dispatchedTransactionToDelete.updatedBy = deletedBy;
      dispatchedTransactionToDelete.deletedBy = deletedBy;
      await dispatchedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 2;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await dispatchedTransactionToDelete.destroy();

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
  createDispatchedTransactionController,
  getDispatchedTransactionsController,
  updateDispatchedTransactionController,
  deleteDispatchedTransactionController,
};
