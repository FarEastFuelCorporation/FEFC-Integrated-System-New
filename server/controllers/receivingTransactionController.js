// controllers/receivingTransactionController.js

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
const ReceivedTransaction = require("../models/ReceivedTransaction");

// Utility function to fetch pending transactions
async function fetchPendingTransactions() {
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
    where: {
      id: {
        [Op.notIn]: literal(
          "(SELECT `dispatchedTransactionId` FROM `ReceivedTransactions` WHERE `deletedAt` IS NULL)"
        ),
      },
    },
    order: [["id", "DESC"]],
  });
}

// Utility function to fetch finished transactions
async function fetchFinishedTransactions() {
  return await ReceivedTransaction.findAll({
    attributes: [
      "id",
      "dispatchedTransactionId",
      "receivedDate",
      "receivedTime",
      "pttNo",
      "manifestNo",
      "pullOutFormNo",
      "manifestWeight",
      "clientWeight",
      "grossWeight",
      "tareWeight",
      "netWeight",
      "remarks",
      "createdBy",
      "createdAt",
    ],
    include: [
      {
        model: DispatchedTransaction,
        as: "DispatchedTransaction",
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
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
    order: [["id", "DESC"]],
  });
}

// Create Received Transaction controller
async function createReceivedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new transaction
    await ReceivedTransaction.create({
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
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

// Get Received Transactions controller
async function getReceivedTransactionsController(req, res) {
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

// Update Received Transaction controller
async function updateReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Received transaction with ID:", id);

    let {
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the booked transaction by UUID (id) and update it
    const updatedReceivedTransaction = await ReceivedTransaction.findByPk(id);

    if (updatedReceivedTransaction) {
      // Update booked transaction attributes
      updatedReceivedTransaction.scheduledTransactionId =
        scheduledTransactionId;
      updatedReceivedTransaction.scheduledTransactionId =
        scheduledTransactionId;
      updatedReceivedTransaction.dispatchedTransactionId =
        dispatchedTransactionId;
      updatedReceivedTransaction.receivedDate = receivedDate;
      updatedReceivedTransaction.receivedTime = receivedTime;
      updatedReceivedTransaction.pttNo = pttNo;
      updatedReceivedTransaction.manifestNo = manifestNo;
      updatedReceivedTransaction.pullOutFormNo = pullOutFormNo;
      updatedReceivedTransaction.manifestWeight = manifestWeight;
      updatedReceivedTransaction.clientWeight = clientWeight;
      updatedReceivedTransaction.grossWeight = grossWeight;
      updatedReceivedTransaction.tareWeight = tareWeight;
      updatedReceivedTransaction.netWeight = netWeight;
      updatedReceivedTransaction.remarks = remarks;
      updatedReceivedTransaction.updatedBy = createdBy;

      // Save the updated received transaction
      await updatedReceivedTransaction.save();

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
    } else {
      // If received transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Received Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating received transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Received Transaction controller
async function deleteReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const receivedTransactionToDelete = await ReceivedTransaction.findByPk(id);

    if (receivedTransactionToDelete) {
      // Update the deletedBy field
      receivedTransactionToDelete.updatedBy = deletedBy;
      receivedTransactionToDelete.deletedBy = deletedBy;
      await receivedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 3;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await receivedTransactionToDelete.destroy();

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
  createReceivedTransactionController,
  getReceivedTransactionsController,
  updateReceivedTransactionController,
  deleteReceivedTransactionController,
};
