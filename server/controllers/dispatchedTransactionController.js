// controllers/dispatchedTransactionController.js

const { Op } = require("sequelize");
const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const QuotationTransportation = require("../models/QuotationTransportation");
const statusId = 2;

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

// Get Dispatched Transactions controller
async function getDispatchedTransactionsController(req, res) {
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

// Update Dispatched Transaction controller
async function updateDispatchedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating dispatched transaction with ID:", id);

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
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

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

      // Save the updated booked transaction
      await updatedDispatchedTransaction.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId,
        {
          attributes: ["id", "transactionId"],
        }
      );

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

      // Respond with a success message
      res.json({
        message: `Dispatched Transaction with ID ${id} soft-deleted successfully`,
      });
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

// Get Dispatched Transactions Dashboard controller
async function getDispatchedTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate } = req.params;
    const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const scheduledTransactionsNoDispatchCount =
      await ScheduledTransaction.count({
        where: {
          logisticsId: "0577d985-8f6f-47c7-be3c-20ca86021154",
          scheduledDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            required: false, // LEFT JOIN to include rows even without matching DispatchedTransaction
            where: {
              id: null, // Ensure no matching DispatchedTransaction
            },
          },
        ],
      });

    const scheduledTransactionsWithDispatchCount =
      await ScheduledTransaction.count({
        where: {
          logisticsId: "0577d985-8f6f-47c7-be3c-20ca86021154",
          scheduledDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            required: true, // Ensures only records with a corresponding DispatchedTransaction are counted
          },
        ],
      });

    // Fetch all dispatched transactions between the provided date range
    const dispatchedTransactions = await DispatchedTransaction.findAll({
      where: {
        dispatchedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: ReceivedTransaction,
          as: "ReceivedTransaction",
          required: false,
        },
        {
          model: ScheduledTransaction,
          as: "ScheduledTransaction",
          required: false,
          include: {
            model: BookedTransaction,
            as: "BookedTransaction",
            required: false,
            include: {
              model: QuotationTransportation,
              as: "QuotationTransportation",
              required: false,
            },
          },
        },
      ],
    });

    // Initialize counters for on-time and late dispatches
    let ontimeDispatch = 0;
    let lateDispatch = 0;

    // Initialize variable for income calculation
    let income = 0;

    // Iterate through dispatched transactions and compare dates and times
    dispatchedTransactions.forEach((dispatch) => {
      const scheduledTransaction = dispatch.ScheduledTransaction;
      if (scheduledTransaction) {
        const scheduledDate = new Date(scheduledTransaction.scheduledDate);
        const scheduledTime = scheduledTransaction.scheduledTime.split(":"); // split time into hours and minutes
        scheduledDate.setHours(scheduledTime[0], scheduledTime[1], 0); // set the time to scheduled time

        const dispatchedDate = new Date(dispatch.dispatchedDate);
        const dispatchedTime = dispatch.dispatchedTime.split(":");
        dispatchedDate.setHours(dispatchedTime[0], dispatchedTime[1], 0); // set the time to dispatched time

        // Compare dispatched time and date with scheduled time and date
        if (dispatchedDate <= scheduledDate) {
          // On time
          ontimeDispatch++;
        } else {
          // Late
          lateDispatch++;
        }

        // Calculate the total income from QuotationTransportation's unitPrice
        if (scheduledTransaction?.BookedTransaction) {
          // Directly access the QuotationTransportation since BookedTransaction is an object
          const bookedTransaction = scheduledTransaction.BookedTransaction;
          const quotationTransportation =
            bookedTransaction?.QuotationTransportation;

          if (
            quotationTransportation &&
            typeof quotationTransportation.unitPrice === "number"
          ) {
            income += quotationTransportation.unitPrice || 0;
          }
        }
      }
    });

    console.log("On-time Dispatches:", ontimeDispatch);
    console.log("Late Dispatches:", lateDispatch);
    console.log("Total Income:", income);

    console.log("Total Income:", income);
    console.log("On-time Dispatches:", ontimeDispatch);
    console.log("Late Dispatches:", lateDispatch);
    console.log("Total Income:", income);

    const totalDispatch = dispatchedTransactions.length;
    const onTimePercentage =
      totalDispatch > 0
        ? ((ontimeDispatch / totalDispatch) * 100).toFixed(2)
        : "0.00";
    const pending =
      scheduledTransactionsNoDispatchCount -
      scheduledTransactionsWithDispatchCount;

    // Log the results for debugging
    console.log(
      "Total Schedule With Dispatch:",
      scheduledTransactionsWithDispatchCount
    );
    console.log("Total Dispatches:", totalDispatch);
    console.log("On-time Dispatches:", ontimeDispatch);
    console.log("Late Dispatches:", lateDispatch);

    // Respond with the updated data
    res.status(200).json({
      pending,
      totalDispatch,
      ontimeDispatch,
      onTimePercentage,
      lateDispatch,
      income,
      dispatchedTransactions,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createDispatchedTransactionController,
  getDispatchedTransactionsController,
  updateDispatchedTransactionController,
  deleteDispatchedTransactionController,
  getDispatchedTransactionsDashboardController,
};
