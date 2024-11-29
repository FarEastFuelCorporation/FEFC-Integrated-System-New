// controllers/billedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const BilledTransaction = require("../models/BilledTransaction");
const generateBillingNumber = require("../utils/generateBillingNumber");
const {
  fetchData,
  getIncludeOptions,
} = require("../utils/getBookedTransactions");
const { BillingApprovalEmailFormat } = require("../utils/emailFormat");
const Client = require("../models/Client");
const sendEmail = require("../sendEmail");
const transactionStatusId = 9;
const additionalStatusId = [5, 6, 7, 8];

// Create Billed Transaction controller
async function createBilledTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId, // Now an array
      isCertified,
      billedDate,
      billedTime,
      billingNumber,
      serviceInvoiceNumber,
      billedAmount,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    if (!Array.isArray(bookedTransactionId)) {
      throw new Error("bookedTransactionId must be an array");
    }

    remarks = remarks && remarks.toUpperCase();

    // const billingNumber = await generateBillingNumber();

    let clientName;
    let transactions = {};

    // Iterate over the bookedTransactionId array and create multiple entries
    for (const id of bookedTransactionId) {
      // Create BilledTransaction entry
      await BilledTransaction.create(
        {
          bookedTransactionId: id,
          billingNumber,
          billedDate,
          billedTime,
          serviceInvoiceNumber,
          billedAmount,
          remarks,
          createdBy,
        },
        { transaction }
      );

      // Update the status of the booked transaction
      const updatedBookedTransaction = await BookedTransaction.findByPk(id, {
        attributes: ["id", "transactionId", "createdBy"],
        include: {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
        transaction,
      });

      clientName = updatedBookedTransaction.Client.clientName;

      if (!transactions[id]) {
        transactions[id] = {}; // Initialize as an object if not already set
      }

      transactions[id].transactionId = updatedBookedTransaction.transactionId;
      transactions[id].billingNumber = billingNumber;

      if (updatedBookedTransaction && isCertified) {
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });
      } else {
        // If booked transaction with the specified ID was not found
        throw new Error(`Booked Transaction with ID ${id} not found`);
      }
    }

    // Commit the transaction
    await transaction.commit();

    const emailBody = await BillingApprovalEmailFormat(
      clientName,
      transactions
    );
    console.log(emailBody);

    try {
      sendEmail(
        "jmfalar@fareastfuelcorp.com", // Recipient
        `${billingNumber} - For Billing Approval: ${clientName}`, // Subject
        "Please view this email in HTML format.", // Plain-text fallback
        emailBody // HTML content
        // [
        //   "rmangaron@fareastfuelcorp.com",
        //   "edevera@fareastfuelcorp.com",
        //   "eb.devera410@gmail.com",
        //   "cc.duran@fareastfuel.com",
        // ] // cc
      ).catch((emailError) => {
        console.error("Error sending email:", emailError);
      });
    } catch (error) {
      console.error("Unexpected error when sending email:", error);
    }

    // Fetch updated transaction data
    const data = await fetchData(statusId);

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}

// Get Billed Transactions controller
async function getBilledTransactionsController(req, res) {
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

// Get Billed Transactions controller
async function getBilledStatementsController(req, res) {
  try {
    const billingNumber = req.params.billingNumber;

    const transactions = await BilledTransaction.findAll({
      where: { billingNumber }, // Match records with the given billingNumber
      attributes: ["bookedTransactionId"], // Fetch only the bookedTransactionId field
    });

    // Extract the bookedTransactionId values into an array
    const bookedTransactionIds = transactions.map(
      (transaction) => transaction.bookedTransactionId
    );

    console.log("bookedTransactionIds", bookedTransactionIds);

    // Pass the IDs to the next query
    const bookedTransactions = await BookedTransaction.findAll({
      where: { id: bookedTransactionIds },
      include: getIncludeOptions(),
      order: [["transactionId", "DESC"]],
    });

    // Respond with the updated data
    res.status(200).json({
      bookedTransactions,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Billed Transaction controller
async function updateBilledTransactionController(req, res) {
  try {
    const id = req.params.id; // Expecting the BilledTransaction ID to update
    console.log("Updating billed transaction with ID:", id);

    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      // Extracting data from the request body
      let {
        bookedTransactionId,
        isCertified,
        billedDate,
        billedTime,
        billingNumber,
        serviceInvoiceNumber,
        billedAmount,
        remarks,
        statusId,
        updatedBy,
      } = req.body;

      // Uppercase the remarks if present
      const updatedRemarks = remarks && remarks.toUpperCase();

      // Find the billed transaction by ID
      const billedTransaction = await BilledTransaction.findByPk(id, {
        attributes: ["billingNumber"],
      });

      if (billedTransaction) {
        // Retrieve all billed transactions with the same billingNumber
        const billedTransactions = await BilledTransaction.findAll({
          where: { billingNumber: billedTransaction.billingNumber },
        });

        if (billedTransactions.length > 0) {
          // Update each related billed transaction
          for (const transactionEntry of billedTransactions) {
            transactionEntry.billedDate = billedDate;
            transactionEntry.billedTime = billedTime;
            transactionEntry.billingNumber = billingNumber;
            transactionEntry.serviceInvoiceNumber = serviceInvoiceNumber;
            transactionEntry.billedAmount = billedAmount;
            transactionEntry.remarks = updatedRemarks;
            transactionEntry.updatedBy = updatedBy;

            // Save changes for each transaction
            await transactionEntry.save({ transaction });
          }

          // Update the status of the booked transaction
          const updatedBookedTransaction = await BookedTransaction.findByPk(
            bookedTransactionId,
            { transaction }
          );

          if (updatedBookedTransaction && isCertified) {
            updatedBookedTransaction.statusId = statusId;
            await updatedBookedTransaction.save({ transaction });

            // Commit the transaction
            await transaction.commit();

            // Fetch updated transaction data
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
        } else {
          // If no related billed transactions were found
          await transaction.rollback();
          res.status(404).json({
            message: `No related Billed Transactions found for billingNumber ${billedTransaction.billingNumber}`,
          });
        }
      } else {
        // If billed transaction with the specified ID was not found
        await transaction.rollback();
        res
          .status(404)
          .json({ message: `Billed Transaction with ID ${id} not found` });
      }
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error("Error updating billed transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Billed Transaction controller
async function deleteBilledTransactionController(req, res) {
  try {
    const id = req.params.id; // ID of the billed transaction to delete
    const { deletedBy, isCertified } = req.body;

    console.log("Soft deleting billed transaction with ID:", id);

    // Find the billed transaction by UUID (id)
    const billedTransactionToDelete = await BilledTransaction.findByPk(id, {
      attributes: ["billingNumber"],
    });

    if (billedTransactionToDelete) {
      // Retrieve all billed transactions with the same billingNumber
      const billedTransactions = await BilledTransaction.findAll({
        where: { billingNumber: billedTransactionToDelete.billingNumber },
      });

      if (billedTransactions.length > 0) {
        // Soft delete each billed transaction
        for (const transactionEntry of billedTransactions) {
          transactionEntry.updatedBy = deletedBy;
          transactionEntry.deletedBy = deletedBy;
          await transactionEntry.save();
          await transactionEntry.destroy(); // Soft delete (sets deletedAt timestamp)
        }

        // Retrieve all related BookedTransactions by billingNumber
        const bookedTransactionIds = billedTransactions.map(
          (transaction) => transaction.bookedTransactionId
        );

        const updatedBookedTransactions = await BookedTransaction.findAll({
          where: { id: bookedTransactionIds },
        });

        if (updatedBookedTransactions.length > 0 && isCertified) {
          // Update status of all related booked transactions
          for (const bookedTransaction of updatedBookedTransactions) {
            bookedTransaction.statusId = transactionStatusId; // Status for "deleted" or equivalent
            bookedTransaction.updatedBy = deletedBy;
            await bookedTransaction.save();
          }
        } else {
          console.warn(
            `No Booked Transactions found for IDs: ${bookedTransactionIds}`
          );
        }

        // Fetch updated transaction data
        const data = await fetchData(transactionStatusId); // Replace with relevant statusId if needed

        // Respond with the updated data
        res.status(200).json({
          pendingTransactions: data.pending,
          inProgressTransactions: data.inProgress,
          finishedTransactions: data.finished,
        });
      } else {
        res.status(404).json({
          message: `No related Billed Transactions found for billingNumber ${billedTransactionToDelete.billingNumber}`,
        });
      }
    } else {
      // If billed transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Billed Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting billed transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBilledTransactionController,
  getBilledTransactionsController,
  getBilledStatementsController,
  updateBilledTransactionController,
  deleteBilledTransactionController,
};
