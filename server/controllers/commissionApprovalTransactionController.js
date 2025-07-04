// controllers/commissionApprovalTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const CommissionApprovalTransaction = require("../models/CommissionApprovalTransaction");
const CommissionedTransaction = require("../models/CommissionedTransaction");
const { CommissionApprovedEmailFormat } = require("../utils/emailFormat");
const sendEmail = require("../sendEmail");
const Client = require("../models/Client");
const Commission = require("../models/Commission");
const Agent = require("../models/Agent");
const transactionStatusId = 10;
const statusId = 10;
const additionalStatusId = [11, 12, 13];

// Create Commission Approval Transaction controller
async function createCommissionApprovalTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      commissionedTransactionId,
      approvedDate,
      approvedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    remarks = remarks && remarks.toUpperCase();

    // Fetch the commission number using the commissionedTransactionId
    const commissionTransaction = await CommissionedTransaction.findOne({
      where: { id: commissionedTransactionId },
      attributes: ["commissionNumber"],
      include: {
        model: BookedTransaction,
        as: "BookedTransaction",
        attributes: ["id"],
        include: {
          model: Client,
          as: "Client",
          attributes: ["id"],
          include: {
            model: Commission,
            as: "Commission",
            attributes: ["id"],
            include: {
              model: Agent,
              as: "Agent",
            },
          },
        },
      },
    });

    if (!commissionTransaction) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Commissioned transaction not found" });
    }

    const commissionNumber = commissionTransaction.commissionNumber;

    // Fetch all commissioned transaction IDs associated with the commission number
    const commissionedTransactionIds = await CommissionedTransaction.findAll({
      where: { commissionNumber },
      attributes: ["id", "bookedTransactionId"],
    });

    if (!commissionedTransactionIds.length) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "No related commissioned transactions found" });
    }

    let clientName;
    let agentName;
    let clientEmail;
    let agentEmail;
    let transactions = {};

    // Create CommissionApprovalTransaction entries for all related commissioned transactions
    for (const commissionedTransaction of commissionedTransactionIds) {
      await CommissionApprovalTransaction.create(
        {
          commissionedTransactionId: commissionedTransaction.id,
          approvedDate,
          approvedTime,
          remarks,
          createdBy,
        },
        { transaction }
      );

      // Update the status of each related booked transaction
      const updatedBookedTransaction = await BookedTransaction.findByPk(
        commissionedTransaction.bookedTransactionId,
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
        transactions[transactionId].commissionNumber = commissionNumber;
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });
      }
    }

    agentName = `${
      commissionTransaction.BookedTransaction?.Client?.Commission?.[0]?.Agent
        ?.firstName
    } ${
      commissionTransaction.BookedTransaction?.Client?.Commission?.[0]?.Agent
        ?.lastName
    } ${
      commissionTransaction.BookedTransaction?.Client?.Commission?.[0]?.Agent
        ?.affix
        ? commissionTransaction.BookedTransaction?.Client?.Commission?.[0]
            ?.Agent?.affix
        : ""
    }`;
    agentEmail =
      commissionTransaction.BookedTransaction?.Client?.Commission?.[0]?.Agent
        ?.emailAddress;

    // Commit the transaction
    await transaction.commit();

    // Sorting transactions by transactionId
    const sortedTransactions = Object.values(transactions).sort((a, b) => {
      if (a.transactionId < b.transactionId) return -1; // Ascending order
      if (a.transactionId > b.transactionId) return 1;
      return 0;
    });

    const emailBody = await CommissionApprovedEmailFormat(
      agentName,
      clientName,
      sortedTransactions
    );

    try {
      sendEmail(
        // "jmfalar@fareastfuelcorp.com", // Recipient
        agentEmail, // Recipient
        `${commissionNumber} - Commission Statement Notification`, // Subject
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

// Get Commission Approval Transactions controller
async function getCommissionApprovalTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId, null, additionalStatusId);

    const filteredPending = data.pending.filter(
      (item) =>
        item.Client?.Commission?.length > 0 &&
        item.CommissionedTransaction &&
        !item.CommissionedTransaction?.[0]?.CommissionApprovalTransaction
    );
    const filteredInProgress = data.pending.filter(
      (item) =>
        item.Client?.Commission?.length > 0 &&
        item.CommissionedTransaction?.[0]?.CommissionApprovalTransaction &&
        item.CommissionedTransaction?.[0]?.CommissionApprovalTransaction
    );
    const filteredFinished = data.finished.filter(
      (item) => item.Client?.Commission?.length > 0
    );

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: filteredPending,
      inProgressTransactions: filteredInProgress,
      finishedTransactions: filteredFinished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Commission Approval Transaction controller
async function updateCommissionApprovalTransactionController(req, res) {
  const id = req.params.id; // Expecting the CommissionedTransaction ID to update
  console.log("Updating commission approval transaction with ID:", id);

  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      commissionedTransactionId,
      approvedDate,
      approvedTime,
      remarks,
      statusId,
      updatedBy,
    } = req.body;

    console.log("req.body", req.body);

    remarks = remarks && remarks.toUpperCase();

    // Find the commission approval transaction by its commissionedTransactionId
    const commissionApprovalTransaction =
      await CommissionApprovalTransaction.findByPk(id, {
        include: {
          model: CommissionedTransaction,
          as: "CommissionedTransaction",
          attributes: ["commissionNumber"],
        },
        transaction,
      });

    const commissionedTransactions = await CommissionedTransaction.findAll({
      attributes: ["bookedTransactionId"],
      where: {
        commissionNumber:
          commissionApprovalTransaction.CommissionedTransaction
            .commissionNumber,
      },
      include: {
        model: CommissionApprovalTransaction,
        as: "CommissionApprovalTransaction",
      },
      transaction,
    });

    for (const commissionedTransaction of commissionedTransactions) {
      const commissionApproval =
        commissionedTransaction.CommissionApprovalTransaction;

      if (commissionApproval) {
        // Update the CommissionApprovalTransaction fields
        commissionApproval.approvedDate = approvedDate;
        commissionApproval.approvedTime = approvedTime;
        commissionApproval.remarks = remarks;
        commissionApproval.updatedBy = updatedBy;

        await commissionApproval.save({
          transaction,
        });

        // Update the status of the booked transaction
        const updatedBookedTransaction = await BookedTransaction.findByPk(
          commissionedTransaction.bookedTransactionId,
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
        // If commissioned transaction with the specified ID was not found
        await transaction.rollback();
        res.status(404).json({
          message: `Commission Approval Transaction with ID ${commissionedTransactionId} not found`,
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

// Delete Commission Approval Transaction controller
async function deleteCommissionApprovalTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Commission Approval transaction with ID:", id);

    // Find the commission approval transaction by ID
    const commissionApprovalTransactionToDelete =
      await CommissionApprovalTransaction.findByPk(id);

    if (!commissionApprovalTransactionToDelete) {
      return res.status(404).json({
        message: `Commission Approval Transaction with ID ${id} not found`,
      });
    }

    // Fetch the commission number using the related commissioned transaction ID
    const commissionTransaction = await CommissionedTransaction.findOne({
      where: {
        id: commissionApprovalTransactionToDelete.commissionedTransactionId,
      },
      attributes: ["commissionNumber"],
    });

    if (!commissionTransaction) {
      return res.status(404).json({
        message:
          "Commissioned transaction associated with the approval not found",
      });
    }

    const commissionNumber = commissionTransaction.commissionNumber;

    // Fetch all related commissioned transactions for the same commission number
    const commissionedTransactionIds = await CommissionedTransaction.findAll({
      where: { commissionNumber },
      attributes: ["id", "bookedTransactionId"],
    });

    const commissionedTransactionIdList = commissionedTransactionIds.map(
      (bt) => bt.id
    );

    // Fetch all commission approval transactions for the related commissioned transactions
    const commissionApprovalTransactionsToDelete =
      await CommissionApprovalTransaction.findAll({
        where: { commissionedTransactionId: commissionedTransactionIdList },
      });

    // Update and soft-delete all related commission approval transactions
    for (const transaction of commissionApprovalTransactionsToDelete) {
      transaction.updatedBy = deletedBy;
      transaction.deletedBy = deletedBy;
      await transaction.save();
      await transaction.destroy(); // Soft delete (sets deletedAt timestamp)
    }

    // Update the status of all related booked transactions
    for (const bt of commissionedTransactionIds) {
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
        "Commission Approval Transactions and related Booked Transactions updated successfully",
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    // Handle errors
    console.error(
      "Error soft-deleting commission approval transactions:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createCommissionApprovalTransactionController,
  getCommissionApprovalTransactionsController,
  updateCommissionApprovalTransactionController,
  deleteCommissionApprovalTransactionController,
};
