// controllers/sortedTransactionController.js

const { Op } = require("sequelize");
const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const SortedScrapTransaction = require("../models/SortedScrapTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const Client = require("../models/Client");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const statusId = 4;

// Create Sorted Transaction controller
async function createSortedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      receivedTransactionId,
      sortedDate,
      sortedTime,
      totalSortedWeight,
      discrepancyWeight,
      sortedWastes,
      sortedScraps,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    // Creating a new sorted transaction
    const newSortedTransaction = await SortedTransaction.create(
      {
        receivedTransactionId,
        sortedDate,
        sortedTime,
        totalSortedWeight,
        discrepancyWeight,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );

    // Adding sorted wastes to SortedWasteTransaction table
    if (sortedWastes && sortedWastes.length > 0) {
      const sortedWastePromises = sortedWastes.map((waste) => {
        let wasteName = waste.wasteName;

        wasteName = wasteName && wasteName.toUpperCase();
        const transporterClientId = waste.transporterClientId
          ? waste.transporterClientId
          : null;

        return SortedWasteTransaction.create(
          {
            sortedTransactionId: newSortedTransaction.id,
            quotationWasteId: waste.quotationWasteId,
            transporterClientId: transporterClientId,
            treatmentProcessId: waste.treatmentProcessId,
            wasteName: wasteName,
            weight: waste.weight,
            clientWeight: waste.clientWeight,
            clientUnit: waste.clientUnit,
            formNo: waste.formNo,
          },
          { transaction: transaction }
        );
      });

      await Promise.all(sortedWastePromises);
    }

    // Adding sorted scraps to SortedScrapTransaction table
    if (sortedScraps && sortedScraps.length > 0) {
      const sortedScrapPromises = sortedScraps.map((scrap) => {
        return SortedScrapTransaction.create(
          {
            sortedTransactionId: newSortedTransaction.id,
            scrapTypeId: scrap.scrapTypeId,
            weight: scrap.weight,
          },
          { transaction: transaction }
        );
      });

      await Promise.all(sortedScrapPromises);
    }

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

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

// Get Sorted Transactions controller
async function getSortedTransactionsController(req, res) {
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

// Update Sorted Transaction controller
async function updateSortedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    console.log("Updating Sorted transaction with ID:", id);

    let {
      receivedTransactionId,
      sortedDate,
      sortedTime,
      totalSortedWeight,
      discrepancyWeight,
      sortedWastes,
      sortedScraps,
      remarks,
      createdBy,
    } = req.body;

    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    // Find the sorted transaction by ID and update it
    const updatedSortedTransaction = await SortedTransaction.findByPk(id);

    if (updatedSortedTransaction) {
      // Update sorted transaction attributes
      updatedSortedTransaction.receivedTransactionId = receivedTransactionId;
      updatedSortedTransaction.sortedDate = sortedDate;
      updatedSortedTransaction.sortedTime = sortedTime;
      updatedSortedTransaction.totalSortedWeight = totalSortedWeight;
      updatedSortedTransaction.discrepancyWeight = discrepancyWeight;
      updatedSortedTransaction.remarks = remarks;
      updatedSortedTransaction.updatedBy = createdBy;

      // Save the updated sorted transaction
      await updatedSortedTransaction.save({ transaction });

      // Fetch existing sorted wastes and scraps from the database
      const existingSortedWastes = await SortedWasteTransaction.findAll({
        where: { sortedTransactionId: id },
        transaction,
      });

      const existingSortedScraps = await SortedScrapTransaction.findAll({
        where: { sortedTransactionId: id },
        transaction,
      });

      // Extract existing sorted waste and scrap IDs
      const existingWasteIds = existingSortedWastes.map((waste) => waste.id);
      const existingScrapIds = existingSortedScraps.map((scrap) => scrap.id);

      // Extract updated sorted waste and scrap IDs from the request body
      const updatedWasteIds = sortedWastes.map((waste) => waste.id);
      const updatedScrapIds = sortedScraps.map((scrap) => scrap.id);

      // Identify wastes and scraps to delete (those not present in the updated data)
      const wastesToDelete = existingSortedWastes.filter(
        (waste) => !updatedWasteIds.includes(waste.id)
      );

      const scrapsToDelete = existingSortedScraps.filter(
        (scrap) => !updatedScrapIds.includes(scrap.id)
      );

      // Identify wastes and scraps to update and create
      const sortedWastePromises = sortedWastes.map(async (waste) => {
        if (waste.id && existingWasteIds.includes(waste.id)) {
          // Update existing waste
          await SortedWasteTransaction.update(
            {
              quotationWasteId: waste.quotationWasteId,
              transporterClientId: waste.transporterClientId
                ? waste.transporterClientId
                : null,
              treatmentProcessId: waste.treatmentProcessId,
              wasteName: waste.wasteName && waste.wasteName.toUpperCase(),
              weight: waste.weight,
              clientWeight: waste.clientWeight,
              clientUnit: waste.clientUnit,
              formNo: waste.formNo,
            },
            { where: { id: waste.id }, transaction }
          );
        } else {
          // Create new waste
          await SortedWasteTransaction.create(
            {
              sortedTransactionId: id,
              quotationWasteId: waste.quotationWasteId,
              transporterClientId: waste.transporterClientId
                ? waste.transporterClientId
                : null,
              treatmentProcessId: waste.treatmentProcessId,
              wasteName: waste.wasteName && waste.wasteName.toUpperCase(),
              weight: waste.weight,
              clientWeight: waste.clientWeight,
              clientUnit: waste.clientUnit,
              formNo: waste.formNo,
            },
            { transaction }
          );
        }
      });

      const sortedScrapPromises = sortedScraps.map(async (scrap) => {
        if (scrap.id && existingScrapIds.includes(scrap.id)) {
          // Update existing scrap
          await SortedScrapTransaction.update(
            {
              scrapTypeId: scrap.scrapTypeId,
              weight: scrap.weight,
            },
            { where: { id: scrap.id }, transaction }
          );
        } else {
          // Create new scrap
          await SortedScrapTransaction.create(
            {
              sortedTransactionId: id,
              scrapTypeId: scrap.scrapTypeId,
              weight: scrap.weight,
            },
            { transaction }
          );
        }
      });

      // Delete wastes and scraps that are no longer present
      const deleteWastePromises = wastesToDelete.map((waste) =>
        SortedWasteTransaction.destroy({ where: { id: waste.id }, transaction })
      );

      const deleteScrapPromises = scrapsToDelete.map((scrap) =>
        SortedScrapTransaction.destroy({ where: { id: scrap.id }, transaction })
      );

      // Wait for all promises to resolve
      await Promise.all([
        ...sortedWastePromises,
        ...sortedScrapPromises,
        ...deleteWastePromises,
        ...deleteScrapPromises,
      ]);

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
      // If sorted transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Sorted Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating sorted transaction:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Sorted Transaction controller
async function deleteSortedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting sorted transaction with ID:", id);

    // Find the sorted transaction by UUID (id)
    const sortedTransactionToDelete = await SortedTransaction.findByPk(id);

    if (sortedTransactionToDelete) {
      // Update the deletedBy field
      sortedTransactionToDelete.updatedBy = deletedBy;
      sortedTransactionToDelete.deletedBy = deletedBy;
      await sortedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 4;

      await updatedBookedTransaction.save();

      // Soft delete the sorted transaction (sets deletedAt timestamp)
      await sortedTransactionToDelete.destroy();

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

// Get Sorted Transactions Dashboard controller
async function getSortedTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate } = req.params;

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const [result] = await sequelize.query(
      `
        SELECT COUNT(*) AS receivedTransactionCount
        FROM ReceivedTransactions rt
        LEFT JOIN SortedTransactions st ON rt.id = st.receivedTransactionId
        WHERE rt.submitTo = 'SORTING'
          AND st.id IS NULL
          AND rt.deletedAt IS NULL;
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    // Fetch all dispatched transactions between the provided date range
    const sortedTransactions = await SortedTransaction.findAll({
      attributes: [
        "id",
        "sortedDate",
        "sortedTime",
        "totalSortedWeight",
        "discrepancyWeight",
      ],
      where: {
        sortedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: ReceivedTransaction,
          as: "ReceivedTransaction",
          attributes: ["id", "receivedDate", "receivedTime", "netWeight"],
          required: false,
          include: [
            {
              model: ScheduledTransaction,
              as: "ScheduledTransaction",
              attributes: ["id"],
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
                    attributes: ["clientId", "clientName"],
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
        },
      ],
    });

    // Initialize counters for on-time and late dispatches
    let onTimeSorted = 0;
    let lateSorted = 0;

    // Initialize variable for totalWeight calculation
    let totalWeight = 0;

    // Iterate through dispatched transactions and compare dates and times
    // Iterate through dispatched transactions and compare dates and times

    sortedTransactions.forEach((transaction) => {
      const receivedTransaction = transaction.ReceivedTransaction;

      const sortedDate = new Date(transaction.sortedDate);
      const sortedTime = transaction.sortedTime?.split(":"); // Safely access sortedTime
      if (sortedTime) {
        sortedDate.setHours(sortedTime[0], sortedTime[1], 0); // Set the time to received time
      }

      if (receivedTransaction) {
        const receivedDate = new Date(receivedTransaction.receivedDate);
        const receivedTime = receivedTransaction.receivedTime?.split(":"); // Safely access receivedTime
        if (receivedTime) {
          receivedDate.setHours(receivedTime[0], receivedTime[1], 0); // Set the time to scheduled time
        }

        // Calculate the difference in milliseconds
        const timeDifference = sortedDate - receivedDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

        // Check if the difference exceeds48 hours
        if (hoursDifference <= 48) {
          // On time
          onTimeSorted++;
        } else {
          // Late
          lateSorted++;
        }
      }

      const totalSortedWeight = transaction.totalSortedWeight;
      totalWeight += totalSortedWeight;
    });

    // Process the received transactions into an object with unique keys
    const processedTransactionsObject = sortedTransactions.reduce(
      (acc, transaction, index) => {
        const clientName =
          transaction.ReceivedTransaction.ScheduledTransaction
            ?.BookedTransaction?.Client?.clientName || null;
        const wasteName =
          transaction.ReceivedTransaction.ScheduledTransaction
            ?.BookedTransaction?.QuotationWaste?.wasteName || null;
        const wasteCode =
          transaction.ReceivedTransaction.ScheduledTransaction
            ?.BookedTransaction?.QuotationWaste?.TypeOfWaste?.wasteCode || null;
        const netWeight = transaction.ReceivedTransaction.netWeight;
        const totalSortedWeight = transaction.totalSortedWeight;
        const discrepancyWeight = transaction.discrepancyWeight;

        // Creating a key for each entry (using index or any unique identifier)
        const key = `transaction_${index}`;

        // Assigning the processed data to the key
        acc[key] = {
          id: index++,
          clientName,
          wasteName,
          wasteCode,
          netWeight,
          totalSortedWeight,
          discrepancyWeight,
        };

        return acc;
      },
      {}
    );

    // Consolidate client data by summing net weight and counting trips
    const clientSummary = sortedTransactions.reduce((acc, transaction) => {
      const clientId =
        transaction.ReceivedTransaction?.ScheduledTransaction?.BookedTransaction
          ?.Client?.clientId || null;
      const clientName =
        transaction.ReceivedTransaction?.ScheduledTransaction?.BookedTransaction
          ?.Client?.clientName || null;
      const netWeight = transaction.ReceivedTransaction?.netWeight;
      const totalSortedWeight = transaction.totalSortedWeight;
      const discrepancyWeight = transaction.discrepancyWeight;

      if (clientId) {
        // If the client already exists in the accumulator, add to the existing summary
        if (acc[clientId]) {
          acc[clientId].trips += 1; // Increment trips count
          acc[clientId].netWeight += netWeight; // Add to total weight
          acc[clientId].totalSortedWeight += totalSortedWeight;
          acc[clientId].discrepancyWeight += discrepancyWeight;
        } else {
          // Otherwise, initialize the summary for this client
          acc[clientId] = {
            id: clientId,
            clientName,
            trips: 1,
            netWeight,
            totalSortedWeight,
            discrepancyWeight,
          };
        }
      }

      return acc;
    }, {});

    const transaction = Object.values(processedTransactionsObject);
    // const transaction = sortedTransactions;
    const transactionSummary = Object.values(clientSummary);

    const totalReceived = onTimeSorted + lateSorted;
    const onTimeSortedPercentage =
      totalReceived > 0
        ? ((onTimeSorted / totalReceived) * 100).toFixed(2)
        : "0.00";
    const pending = result.receivedTransactionCount;

    console.log(pending);
    console.log(totalReceived);
    console.log(onTimeSorted);
    console.log(onTimeSortedPercentage);
    console.log(lateSorted);

    // Respond with the updated data
    res.status(200).json({
      pending,
      totalReceived,
      onTimeSorted,
      onTimeSortedPercentage,
      lateSorted,
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
  createSortedTransactionController,
  getSortedTransactionsController,
  updateSortedTransactionController,
  deleteSortedTransactionController,
  getSortedTransactionsDashboardController,
};
