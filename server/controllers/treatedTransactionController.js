// controllers/treatedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const transactionStatusId = 5;
const additionalStatusId = 7;

// Create Treated Transaction controller
async function createTreatedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      isFinished,
      bookedTransactionId,
      sortedTransactionId,
      warehousedTransactionId,
      submitTo,
      waste, // Now an array of waste objects
      remarks,
      statusId,
      createdBy,
    } = req.body;
    console.log("Logger:", req.body);

    remarks = remarks?.toUpperCase();

    // Create TreatedTransaction entry
    const newTreatedTransaction = await TreatedTransaction.create(
      {
        sortedTransactionId:
          submitTo === "SORTING" ? sortedTransactionId : null,
        warehousedTransactionId:
          submitTo === "WAREHOUSE" ? warehousedTransactionId : null,
        remarks,
        createdBy,
      },
      { transaction }
    );

    // Iterate over the waste array and process treatedWastes
    if (waste && waste.length > 0) {
      const treatedWastePromises = waste.flatMap((w) =>
        (w.treatedWastes || []).map((treatedWaste) =>
          TreatedWasteTransaction.create(
            {
              treatedTransactionId: newTreatedTransaction.id,
              sortedWasteTransactionId:
                submitTo === "SORTING" ? w.sortedWasteTransactionId : null,
              warehousedTransactionItemId:
                submitTo === "WAREHOUSE" ? w.warehousedTransactionItemId : null,
              treatmentProcessId: treatedWaste.treatmentProcessId,
              treatmentMachineId: treatedWaste.treatmentMachineId,
              weight: treatedWaste.weight,
              treatedDate: treatedWaste.treatedDate,
              treatedTime: treatedWaste.treatedTime,
            },
            { transaction }
          )
        )
      );

      await Promise.all(treatedWastePromises);
    }

    // Fetch and update booked transaction
    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );

    if (updatedBookedTransaction) {
      // Update status if isFinished is true
      if (isFinished) {
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });
      }

      // Commit the transaction
      await transaction.commit();

      // Fetch transactions
      const data = await fetchData(statusId);

      // Respond with updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If booked transaction is not found, rollback
      await transaction.rollback();
      res.status(404).json({
        message: `Booked Transaction with ID ${bookedTransactionId} not found`,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Treated Transactions controller
async function getTreatedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(transactionStatusId, null, additionalStatusId);

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
    const { deletedBy, bookedTransactionId, submitTo } = req.body;

    console.log(bookedTransactionId);
    console.log("Soft deleting sorted transaction with ID:", id);

    // Find the treated waste transaction by UUID (id)
    const treatedWasteTransactionToDelete =
      await TreatedWasteTransaction.findByPk(id);

    if (!treatedWasteTransactionToDelete) {
      return res
        .status(404)
        .json({ message: `Treated Waste Transaction with ID ${id} not found` });
    }

    // Find the associated treated transaction
    const treatedTransactionToDelete = await TreatedTransaction.findByPk(
      treatedWasteTransactionToDelete.treatedTransactionId
    );

    if (!treatedTransactionToDelete) {
      return res.status(404).json({ message: `Treated Transaction not found` });
    }

    // Find other TreatedWasteTransaction records associated with this treated transaction
    const otherTreatedWasteTransactions = await TreatedWasteTransaction.findAll(
      {
        where: { treatedTransactionId: treatedTransactionToDelete.id },
      }
    );

    // Soft delete logic
    if (otherTreatedWasteTransactions.length === 1) {
      // This means there is no other associated TreatedWasteTransaction, so we can delete the TreatedTransaction
      treatedTransactionToDelete.updatedBy = deletedBy;
      treatedTransactionToDelete.deletedBy = deletedBy;
      await treatedTransactionToDelete.save();

      // Soft delete the TreatedTransaction
      await treatedTransactionToDelete.destroy();
    }

    // Update the booked transaction status
    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    updatedBookedTransaction.statusId =
      submitTo === "SORTING" ? transactionStatusId : additionalStatusId;
    await updatedBookedTransaction.save();

    // Soft delete the TreatedWasteTransaction
    await treatedWasteTransactionToDelete.destroy();

    // Fetch transactions
    const data = await fetchData(transactionStatusId);

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
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
