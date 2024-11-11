// controllers/receivedTransactionController.js

const { Op } = require("sequelize");
const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const Client = require("../models/Client");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const statusId = 2;
const additionalStatusId = 3;

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
      vehicle,
      driver,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Creating a new transaction
    await ReceivedTransaction.create({
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      vehicle,
      driver,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
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
    // fetch transactions
    const data = await fetchData(statusId, null, additionalStatusId);

    console.log(data);

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

// Update Received Transaction controller
async function updateReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Received transaction with ID:", id);

    let {
      receivedDate,
      receivedTime,
      vehicle,
      driver,
      pttNo,
      manifestNo,
      pullOutFormNo,
      truckScaleNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      submitTo,
      remarks,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Find the booked transaction by UUID (id) and update it
    const updatedReceivedTransaction = await ReceivedTransaction.findByPk(id);

    if (updatedReceivedTransaction) {
      // Update booked transaction attributes
      updatedReceivedTransaction.receivedDate = receivedDate;
      updatedReceivedTransaction.receivedTime = receivedTime;
      updatedReceivedTransaction.vehicle = vehicle;
      updatedReceivedTransaction.driver = driver;
      updatedReceivedTransaction.pttNo = pttNo;
      updatedReceivedTransaction.manifestNo = manifestNo;
      updatedReceivedTransaction.pullOutFormNo = pullOutFormNo;
      updatedReceivedTransaction.truckScaleNo = truckScaleNo;
      updatedReceivedTransaction.manifestWeight = manifestWeight;
      updatedReceivedTransaction.clientWeight = clientWeight;
      updatedReceivedTransaction.grossWeight = grossWeight;
      updatedReceivedTransaction.tareWeight = tareWeight;
      updatedReceivedTransaction.netWeight = netWeight;
      updatedReceivedTransaction.submitTo = submitTo;
      updatedReceivedTransaction.remarks = remarks;
      updatedReceivedTransaction.updatedBy = createdBy;

      // Save the updated received transaction
      await updatedReceivedTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
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

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
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
async function getReceivedTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate } = req.params;
    const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const [result] = await sequelize.query(
      `
        SELECT COUNT(*) AS scheduledTransactionCount
        FROM ScheduledTransactions st
        LEFT JOIN ReceivedTransactions rt ON st.id = rt.scheduledTransactionId
        WHERE st.logisticsId != :matchingLogisticsId
          AND rt.id IS NULL
          AND st.deletedAt IS NULL
          AND rt.deletedAt IS NULL;
      `,
      {
        replacements: { matchingLogisticsId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const scheduledTransactionCount = result.scheduledTransactionCount;

    console.log(scheduledTransactionCount);

    const [result2] = await sequelize.query(
      `
        SELECT COUNT(*) AS dispatchedTransactionCount
        FROM DispatchedTransactions dt
        LEFT JOIN ReceivedTransactions rt ON dt.id = rt.dispatchedTransactionId
        WHERE rt.id IS NULL
          AND dt.deletedAt IS NULL
          AND rt.deletedAt IS NULL;
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const dispatchedTransactionCount = result2.dispatchedTransactionCount;

    console.log(dispatchedTransactionCount);

    // Fetch all dispatched transactions between the provided date range
    const receivedTransactions = await ReceivedTransaction.findAll({
      attributes: ["id", "receivedDate", "receivedTime", "netWeight"],
      where: {
        receivedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: DispatchedTransaction,
          as: "DispatchedTransaction",
          attributes: ["id"],
          required: false,
        },
        {
          model: ScheduledTransaction,
          as: "ScheduledTransaction",
          attributes: ["scheduledDate", "scheduledTime"],
          required: false,
          include: {
            model: BookedTransaction,
            as: "BookedTransaction",
            attributes: ["id"],
            required: false,
            include: [
              {
                model: Client,
                as: "Client",
                attributes: ["clientName"],
              },
              {
                model: QuotationWaste,
                as: "QuotationWaste",
                attributes: ["wasteName"],
                include: [
                  {
                    model: TypeOfWaste,
                    as: "TypeOfWaste",
                    attributes: ["wasteCode"],
                  },
                ],
              },
            ],
          },
        },
      ],
    });

    // Initialize counters for on-time and late dispatches
    let onTimeReceived = 0;
    let lateReceived = 0;

    // Initialize variable for totalWeight calculation
    let totalWeight = 0;

    // Iterate through dispatched transactions and compare dates and times
    // Iterate through dispatched transactions and compare dates and times
    receivedTransactions.forEach((transaction) => {
      const scheduledTransaction = transaction.ScheduledTransaction;
      const dispatchedTransaction = transaction.DispatchedTransaction;

      const receivedDate = new Date(transaction.receivedDate);
      const receivedTime = transaction.receivedTime?.split(":"); // Safely access receivedTime
      if (receivedTime) {
        receivedDate.setHours(receivedTime[0], receivedTime[1], 0); // Set the time to received time
      }

      if (dispatchedTransaction) {
        const dispatchedDate = new Date(dispatchedTransaction.dispatchedDate);
        const dispatchedTime = dispatchedTransaction.dispatchedTime?.split(":"); // Safely access dispatchedTime
        if (dispatchedTime) {
          dispatchedDate.setHours(dispatchedTime[0], dispatchedTime[1], 0); // Set the time to scheduled time
        }

        // Calculate the difference in milliseconds
        const timeDifference = receivedDate - dispatchedDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

        // Check if the difference exceeds48 hours
        if (hoursDifference <= 48) {
          // On time
          onTimeReceived++;
        } else {
          // Late
          lateReceived++;
        }
      } else if (scheduledTransaction) {
        const scheduledDate = new Date(scheduledTransaction.scheduledDate);
        const scheduledTime = scheduledTransaction.scheduledTime?.split(":"); // Safely access scheduledTime
        if (scheduledTime) {
          scheduledDate.setHours(scheduledTime[0], scheduledTime[1], 0); // Set the time to scheduled time
        }

        // Calculate the difference in milliseconds
        const timeDifference = receivedDate - scheduledDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

        // Check if the difference exceeds48 hours
        if (hoursDifference <= 48) {
          // On time
          onTimeReceived++;
        } else {
          // Late
          lateReceived++;
        }
      }

      const netWeight = transaction.netWeight;
      totalWeight += netWeight;
    });

    // Process the received transactions into an object with unique keys
    const processedTransactionsObject = receivedTransactions.reduce(
      (acc, transaction, index) => {
        const clientName =
          transaction.ScheduledTransaction?.BookedTransaction?.Client
            ?.clientName || null;
        transaction.ScheduledTransaction?.BookedTransaction?.Client
          ?.clientName || null;
        const wasteName =
          transaction.ScheduledTransaction?.BookedTransaction?.QuotationWaste
            ?.wasteName || null;
        const wasteCode =
          transaction.ScheduledTransaction?.BookedTransaction?.QuotationWaste
            ?.TypeOfWaste?.wasteCode || null;
        const netWeight = transaction.netWeight;

        // Creating a key for each entry (using index or any unique identifier)
        const key = `transaction_${index}`;

        // Assigning the processed data to the key
        acc[key] = {
          id: index++,
          clientName,
          wasteName,
          wasteCode,
          netWeight,
        };

        return acc;
      },
      {}
    );

    // Consolidate client data by summing net weight and counting trips
    const clientSummary = receivedTransactions.reduce((acc, transaction) => {
      const clientName =
        transaction.ScheduledTransaction?.BookedTransaction?.Client
          ?.clientName || null;
      const netWeight = transaction.netWeight;

      if (clientName) {
        // If the client already exists in the accumulator, add to the existing summary
        if (acc[clientName]) {
          acc[clientName].trips += 1; // Increment trips count
          acc[clientName].totalNetWeight += netWeight; // Add to total weight
        } else {
          // Otherwise, initialize the summary for this client
          acc[clientName] = {
            id: clientName,
            clientName,
            trips: 1,
            netWeight,
          };
        }
      }

      return acc;
    }, {});

    const transaction = Object.values(processedTransactionsObject);
    const transactionSummary = Object.values(clientSummary);

    const totalReceived = onTimeReceived + lateReceived;
    const onTimeReceivedPercentage =
      totalReceived > 0
        ? ((onTimeReceived / totalReceived) * 100).toFixed(2)
        : "0.00";
    const pending = scheduledTransactionCount + dispatchedTransactionCount;

    console.log(pending);
    console.log(totalReceived);
    console.log(onTimeReceived);
    console.log(onTimeReceivedPercentage);
    console.log(lateReceived);

    // Respond with the updated data
    res.status(200).json({
      pending,
      totalReceived,
      onTimeReceived,
      onTimeReceivedPercentage,
      lateReceived,
      transaction,
      transactionSummary,
      totalWeight,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createReceivedTransactionController,
  getReceivedTransactionsController,
  updateReceivedTransactionController,
  deleteReceivedTransactionController,
  getReceivedTransactionsDashboardController,
};
