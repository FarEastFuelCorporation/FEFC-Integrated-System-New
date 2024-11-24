// controllers/billingDistributionTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const BillingDistributionTransaction = require("../models/BillingDistributionTransaction");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const BilledTransaction = require("../models/BilledTransaction");
const transactionStatusId = 11;

// Create Billing Distribution Transaction controller
async function createBillingDistributionTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      billingApprovalTransactionId,
      distributedDate,
      distributedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    remarks = remarks && remarks.toUpperCase();

    const billingApprovalTransaction = await BillingApprovalTransaction.findOne(
      {
        where: { id: billingApprovalTransactionId },
        include: {
          model: BilledTransaction,
          as: "BilledTransaction",
          attributes: ["billingNumber"],
        },
      }
    );

    const billingNumber =
      billingApprovalTransaction.BilledTransaction.billingNumber;

    // Fetch all billed transaction IDs associated with the billing number
    const billedTransactionIds = await BilledTransaction.findAll({
      where: { billingNumber },
      attributes: ["id", "bookedTransactionId"],
      include: {
        model: BillingApprovalTransaction,
        as: "BillingApprovalTransaction",
        attributes: ["id"],
      },
    });

    // Loop through the billedTransactionIds and create BillingDistributionTransaction entries for each
    for (const billedTransaction of billedTransactionIds) {
      const { bookedTransactionId: bookedTransactionIdFromDB } =
        billedTransaction;

      const billingApprovalTransactionId =
        billedTransaction.BillingApprovalTransaction.id;

      // Create BillingDistributionTransaction entry
      await BillingDistributionTransaction.create(
        {
          bookedTransactionId: bookedTransactionIdFromDB, // Use bookedTransactionId from the billed transaction
          billingApprovalTransactionId,
          distributedDate,
          distributedTime,
          remarks,
          createdBy,
        },
        { transaction }
      );

      // Update the status of the booked transaction
      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionIdFromDB,
        { transaction }
      );

      if (updatedBookedTransaction) {
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });
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

// Get Billing Distribution Transactions controller
async function getBillingDistributionTransactionsController(req, res) {
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

// Update Billing Distribution Transaction controller
async function updateBillingDistributionTransactionController(req, res) {
  const { id } = req.params; // Expecting the billingDistributionTransactionId from params
  console.log("Updating Billing Distribution Transaction with ID:", id);

  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billingApprovalTransactionId,
      distributedDate,
      distributedTime,
      remarks,
      statusId,
      updatedBy,
    } = req.body;

    console.log("req.body", req.body);

    remarks = remarks && remarks.toUpperCase();

    // Find the billing distribution transaction by its ID
    const billingDistributionTransaction =
      await BillingDistributionTransaction.findByPk(id, { transaction });

    if (billingDistributionTransaction) {
      // Update the BillingDistributionTransaction fields
      billingDistributionTransaction.bookedTransactionId = bookedTransactionId;
      billingDistributionTransaction.billingApprovalTransactionId =
        billingApprovalTransactionId;
      billingDistributionTransaction.distributedDate = distributedDate;
      billingDistributionTransaction.distributedTime = distributedTime;
      billingDistributionTransaction.remarks = remarks;
      billingDistributionTransaction.updatedBy = updatedBy;

      await billingDistributionTransaction.save({ transaction });

      // Update the status of the booked transaction
      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId,
        { transaction }
      );

      if (updatedBookedTransaction) {
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
      // If billing distribution transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Billing Distribution Transaction with ID ${billingDistributionTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Billing Distribution Transaction controller
async function deleteBillingDistributionTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Billing Distribution transaction with ID:", id);

    // Fetch the BillingDistributionTransaction to be deleted along with its associated BillingApprovalTransaction and BilledTransaction details
    const billingDistributionTransactionToDelete =
      await BillingDistributionTransaction.findByPk(id, {
        include: {
          model: BillingApprovalTransaction,
          as: "BillingApprovalTransaction",
          include: {
            model: BilledTransaction,
            as: "BilledTransaction",
            attributes: ["billingNumber"],
          },
        },
      });

    if (!billingDistributionTransactionToDelete) {
      return res.status(404).json({
        message: `Billing Distribution Transaction with ID ${id} not found`,
      });
    }

    const billingNumber =
      billingDistributionTransactionToDelete.BillingApprovalTransaction
        .BilledTransaction.billingNumber;

    // Fetch all BilledTransactions associated with the same billingNumber
    const billedTransactionIds = await BilledTransaction.findAll({
      where: { billingNumber },
      attributes: ["id", "bookedTransactionId"],
      include: {
        model: BillingApprovalTransaction,
        as: "BillingApprovalTransaction",
        include: {
          model: BillingDistributionTransaction,
          as: "BillingDistributionTransaction",
        },
      },
    });

    // Iterate over the fetched billedTransactionIds and delete the corresponding BillingDistributionTransactions
    for (const billedTransaction of billedTransactionIds) {
      const billingDistributionTransaction =
        billedTransaction.BillingApprovalTransaction
          .BillingDistributionTransaction;

      const bookedTransactionId = billedTransaction.bookedTransactionId;

      if (billingDistributionTransaction) {
        // Update the deletedBy field and perform soft delete (set deletedAt)
        billingDistributionTransaction.updatedBy = deletedBy;
        billingDistributionTransaction.deletedBy = deletedBy;
        await billingDistributionTransaction.save();
        await billingDistributionTransaction.destroy(); // Soft delete
      }

      // Update the BookedTransaction status
      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      if (updatedBookedTransaction) {
        updatedBookedTransaction.statusId = transactionStatusId; // Set to appropriate status
        await updatedBookedTransaction.save();
      }
    }

    // Fetch the updated data after deletion
    const data = await fetchData("transactionStatusId"); // Fetch with the updated status ID

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting billing approval transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBillingDistributionTransactionController,
  getBillingDistributionTransactionsController,
  updateBillingDistributionTransactionController,
  deleteBillingDistributionTransactionController,
};
