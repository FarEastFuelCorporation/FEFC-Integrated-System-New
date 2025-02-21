// controllers/vehicleLocationController.js

const { Op } = require("sequelize");
const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");

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

    remarks = remarks && remarks.toUpperCase();

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
      bookedTransactionId,
      {
        attributes: ["id", "transactionId", "statusId"],
      }
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // fetch transactions
      const transactionId = updatedBookedTransaction.transactionId;

      const newTransaction = await fetchData(
        statusId,
        null,
        null,
        transactionId
      );

      // Respond with the updated data
      res.status(201).json({
        pendingTransactions: newTransaction.pending,
        inProgressTransactions: newTransaction.inProgress,
        finishedTransactions: newTransaction.finished,
      });
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

module.exports = {
  createDispatchedTransactionController,
};
