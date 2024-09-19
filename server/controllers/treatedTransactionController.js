// controllers/treatedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 5;

// Create Treated Transaction controller
async function createTreatedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      isFinished,
      bookedTransactionId,
      sortedTransactionId,
      sortedWasteTransactionId,
      treatedWastes,
      remarks,
      statusId,
      createdBy,
    } = req.body;
    console.log(req.body);
    if (remarks) {
      remarks = remarks.toUpperCase();
    }
    // Create TreatedTransaction entry
    const newTreatedTransaction = await TreatedTransaction.create(
      {
        sortedTransactionId,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );
    // Adding treated wastes to TreatedWasteTransaction table
    if (treatedWastes && treatedWastes.length > 0) {
      const treatedWastePromises = treatedWastes.map((waste) => {
        return TreatedWasteTransaction.create(
          {
            treatedTransactionId: newTreatedTransaction.id,
            sortedWasteTransactionId,
            treatmentProcessId: waste.treatmentProcessId,
            treatmentMachineId: waste.treatmentMachineId,
            weight: waste.weight,
            treatedDate: waste.treatedDate,
            treatedTime: waste.treatedTime,
          },
          { transaction: transaction }
        );
      });
      await Promise.all(treatedWastePromises);
    }
    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );
    if (updatedBookedTransaction) {
      // Update booked transaction attributes if isFinished is true
      if (isFinished) {
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });
      }
      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Booked Transaction with ID ${bookedTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Treated Transactions controller
async function getTreatedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId);

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Delete Treated Transaction controller
async function deleteTreatedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting sorted transaction with ID:", id);

    // Find the sorted transaction by UUID (id)
    const treatedWasteTransactionToDelete =
      await TreatedWasteTransaction.findByPk(id);

    if (treatedWasteTransactionToDelete) {
      // Update the deletedBy field
      treatedWasteTransactionToDelete.updatedBy = deletedBy;
      treatedWasteTransactionToDelete.deletedBy = deletedBy;
      await treatedWasteTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 5;

      await updatedBookedTransaction.save();

      // Soft delete the sorted transaction (sets deletedAt timestamp)
      await treatedWasteTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If sorted transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Sorted Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting sorted transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTreatedTransactionController,
  getTreatedTransactionsController,
  deleteTreatedTransactionController,
};
