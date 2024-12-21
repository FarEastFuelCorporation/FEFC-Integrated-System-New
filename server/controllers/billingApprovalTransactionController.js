// controllers/billingApprovalTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const BilledTransaction = require("../models/BilledTransaction");
const { BillingApprovedEmailFormat } = require("../utils/emailFormat");
const sendEmail = require("../sendEmail");
const Client = require("../models/Client");
const transactionStatusId = 10;
const additionalStatusId = [5, 6, 7, 8];

// Create Billing Approval Transaction controller
async function createBillingApprovalTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      billedTransactionId,
      approvedDate,
      approvedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    remarks = remarks && remarks.toUpperCase();

    // Fetch the billing number using the billedTransactionId
    const billingTransaction = await BilledTransaction.findOne({
      where: { id: billedTransactionId },
      attributes: ["billingNumber"],
    });

    if (!billingTransaction) {
      await transaction.rollback();
      return res.status(404).json({ message: "Billed transaction not found" });
    }

    const billingNumber = billingTransaction.billingNumber;

    // Fetch all billed transaction IDs associated with the billing number
    const billedTransactionIds = await BilledTransaction.findAll({
      where: { billingNumber },
      attributes: ["id", "bookedTransactionId"],
    });

    if (!billedTransactionIds.length) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "No related billed transactions found" });
    }

    let clientName;
    let clientEmail;
    let transactions = {};

    // Create BillingApprovalTransaction entries for all related billed transactions
    for (const billedTransaction of billedTransactionIds) {
      await BillingApprovalTransaction.create(
        {
          billedTransactionId: billedTransaction.id,
          approvedDate,
          approvedTime,
          remarks,
          createdBy,
        },
        { transaction }
      );

      // Update the status of each related booked transaction
      const updatedBookedTransaction = await BookedTransaction.findByPk(
        billedTransaction.bookedTransactionId,
        {
          include: {
            model: Client,
            as: "Client",
            attributes: ["clientName", "email"],
          },
          transaction,
        }
      );

      console.log(updatedBookedTransaction);

      if (updatedBookedTransaction) {
        const transactionId = updatedBookedTransaction.transactionId;
        clientName = updatedBookedTransaction.Client.clientName;
        clientEmail = updatedBookedTransaction.Client.email;
        if (!transactions[transactionId]) {
          transactions[transactionId] = {};
        }
        transactions[transactionId].transactionId = transactionId;
        transactions[transactionId].haulingDate =
          updatedBookedTransaction.haulingDate;
        transactions[transactionId].billingNumber = billingNumber;
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });
      }
    }

    // Commit the transaction
    await transaction.commit();

    // Sorting transactions by transactionId
    const sortedTransactions = Object.values(transactions).sort((a, b) => {
      if (a.transactionId < b.transactionId) return -1; // Ascending order
      if (a.transactionId > b.transactionId) return 1;
      return 0;
    });

    const emailBody = await BillingApprovedEmailFormat(
      clientName,
      sortedTransactions
    );
    console.log(emailBody);

    try {
      sendEmail(
        // "jmfalar@fareastfuelcorp.com", // Recipient
        clientEmail, // Recipient
        `${billingNumber} - Billing Statement Notification`, // Subject
        "Please view this email in HTML format.", // Plain-text fallback
        emailBody,
        ["marketing@fareastfuelcorp.com", "accounting@fareastfuelcorp.com"], // HTML content // cc
        [
          "rmangaron@fareastfuelcorp.com",
          "edevera@fareastfuelcorp.com",
          "eb.devera410@gmail.com",
          "cc.duran@fareastfuel.com",
          "dm.cardinez@fareastfuel.com",
          "dcardinez@fareastfuelcorp.com",
        ] // bcc
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
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Billing Approval Transactions controller
async function getBillingApprovalTransactionsController(req, res) {
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

// Update Billing Approval Transaction controller
async function updateBillingApprovalTransactionController(req, res) {
  const id = req.params.id; // Expecting the BilledTransaction ID to update
  console.log("Updating billing approval transaction with ID:", id);

  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      billedTransactionId,
      approvedDate,
      approvedTime,
      remarks,
      statusId,
      updatedBy,
    } = req.body;

    console.log("req.body", req.body);

    remarks = remarks && remarks.toUpperCase();

    // Find the billing approval transaction by its billedTransactionId
    const billingApprovalTransaction =
      await BillingApprovalTransaction.findByPk(id, {
        include: {
          model: BilledTransaction,
          as: "BilledTransaction",
          attributes: ["billingNumber"],
        },
        transaction,
      });

    const billedTransactions = await BilledTransaction.findAll({
      attributes: ["bookedTransactionId"],
      where: {
        billingNumber:
          billingApprovalTransaction.BilledTransaction.billingNumber,
      },
      include: {
        model: BillingApprovalTransaction,
        as: "BillingApprovalTransaction",
      },
      transaction,
    });

    for (const billedTransaction of billedTransactions) {
      const billingApproval = billedTransaction.BillingApprovalTransaction;

      if (billingApproval) {
        // Update the BillingApprovalTransaction fields
        billingApproval.approvedDate = approvedDate;
        billingApproval.approvedTime = approvedTime;
        billingApproval.remarks = remarks;
        billingApproval.updatedBy = updatedBy;

        await billingApproval.save({
          transaction,
        });

        // Update the status of the booked transaction
        const updatedBookedTransaction = await BookedTransaction.findByPk(
          billedTransaction.bookedTransactionId,
          { transaction }
        );

        if (updatedBookedTransaction) {
          updatedBookedTransaction.statusId = statusId;
          await updatedBookedTransaction.save({ transaction });
        } else {
          // If booked transaction with the specified ID was not found
          await transaction.rollback();
          res.status(404).json({
            message: `Booked Transaction with ID ${bookedTransactionId} not found`,
          });
        }
      } else {
        // If billed transaction with the specified ID was not found
        await transaction.rollback();
        res.status(404).json({
          message: `Billing Approval Transaction with ID ${billedTransactionId} not found`,
        });
      }
    }

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
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Billing Approval Transaction controller
async function deleteBillingApprovalTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Billing Approval transaction with ID:", id);

    // Find the billing approval transaction by ID
    const billingApprovalTransactionToDelete =
      await BillingApprovalTransaction.findByPk(id);

    if (!billingApprovalTransactionToDelete) {
      return res.status(404).json({
        message: `Billing Approval Transaction with ID ${id} not found`,
      });
    }

    // Fetch the billing number using the related billed transaction ID
    const billingTransaction = await BilledTransaction.findOne({
      where: { id: billingApprovalTransactionToDelete.billedTransactionId },
      attributes: ["billingNumber"],
    });

    if (!billingTransaction) {
      return res.status(404).json({
        message: "Billed transaction associated with the approval not found",
      });
    }

    const billingNumber = billingTransaction.billingNumber;

    // Fetch all related billed transactions for the same billing number
    const billedTransactionIds = await BilledTransaction.findAll({
      where: { billingNumber },
      attributes: ["id", "bookedTransactionId"],
    });

    const billedTransactionIdList = billedTransactionIds.map((bt) => bt.id);

    // Fetch all billing approval transactions for the related billed transactions
    const billingApprovalTransactionsToDelete =
      await BillingApprovalTransaction.findAll({
        where: { billedTransactionId: billedTransactionIdList },
      });

    // Update and soft-delete all related billing approval transactions
    for (const transaction of billingApprovalTransactionsToDelete) {
      transaction.updatedBy = deletedBy;
      transaction.deletedBy = deletedBy;
      await transaction.save();
      await transaction.destroy(); // Soft delete (sets deletedAt timestamp)
    }

    // Update the status of all related booked transactions
    for (const bt of billedTransactionIds) {
      const bookedTransaction = await BookedTransaction.findByPk(
        bt.bookedTransactionId
      );
      if (bookedTransaction) {
        bookedTransaction.statusId = transactionStatusId; // Update to the desired status
        await bookedTransaction.save();
      }
    }

    // Fetch updated transactions
    const data = await fetchData(8); // Replace `8` with the appropriate status ID if needed

    // Respond with the updated data
    res.status(200).json({
      message:
        "Billing Approval Transactions and related Booked Transactions updated successfully",
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting billing approval transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBillingApprovalTransactionController,
  getBillingApprovalTransactionsController,
  updateBillingApprovalTransactionController,
  deleteBillingApprovalTransactionController,
};
