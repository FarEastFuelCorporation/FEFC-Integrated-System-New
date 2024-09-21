// controllers/certifiedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const generateCertificateNumber = require("../utils/generateCertificateNumber");
const { fetchData } = require("../utils/getBookedTransactions");
const transactionStatusId = 6;

// Create Certified Transaction controller
async function createCertifiedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      sortedTransactionId,
      certifiedDate,
      certifiedTime,
      typeOfCertificate,
      typeOfWeight,
      remarks,
      statusId,
      createdBy,
    } = req.body;
    console.log(req.body);
    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    const certificateNumber = await generateCertificateNumber();

    // Create CertifiedTransaction entry
    await CertifiedTransaction.create(
      {
        bookedTransactionId,
        sortedTransactionId,
        certificateNumber,
        certifiedDate,
        certifiedTime,
        typeOfCertificate,
        typeOfWeight,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );
    // Adding treated wastes to TreatedWasteTransaction table

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );
    if (updatedBookedTransaction) {
      updatedBookedTransaction.statusId = statusId;
      await updatedBookedTransaction.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

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

// Get Certified Transactions controller
async function getCertifiedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(transactionStatusId);

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

// Delete Certified Transaction controller
async function deleteCertifiedTransactionController(req, res) {
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
      const data = await fetchData(transactionStatusId);

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
  createCertifiedTransactionController,
  getCertifiedTransactionsController,
  deleteCertifiedTransactionController,
};
