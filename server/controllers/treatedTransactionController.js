// controllers/treatedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const VehicleType = require("../models/VehicleType");
const { Op, literal } = require("sequelize");
const Vehicle = require("../models/Vehicle");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const SortedScrapTransaction = require("../models/SortedScrapTransaction");
const ScrapType = require("../models/ScrapType");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");

// Utility function to fetch pending transactions
async function fetchPendingTransactions() {
  return await SortedTransaction.findAll({
    attributes: [
      "id",
      "receivedTransactionId",
      "sortedDate",
      "sortedTime",
      "totalSortedWeight",
      "discrepancyWeight",
      "remarks",
      "createdBy",
      "createdAt",
    ],
    include: [
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        attributes: [
          "id",
          "dispatchedTransactionId",
          "receivedDate",
          "receivedTime",
          "pttNo",
          "manifestNo",
          "pullOutFormNo",
          "manifestWeight",
          "clientWeight",
          "grossWeight",
          "tareWeight",
          "netWeight",
          "remarks",
          "createdBy",
          "createdAt",
        ],
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            attributes: [
              "id",
              "scheduledTransactionId",
              "vehicleId",
              "driverId",
              "helperId",
              "isDispatched",
              "dispatchedDate",
              "dispatchedTime",
              "remarks",
              "createdBy",
              "createdAt",
            ],
            include: [
              {
                model: ScheduledTransaction,
                as: "ScheduledTransaction",
                attributes: [
                  "id",
                  "bookedTransactionId",
                  "scheduledDate",
                  "scheduledTime",
                  "remarks",
                  "createdBy",
                  "createdAt",
                ],
                include: [
                  {
                    model: BookedTransaction,
                    as: "BookedTransaction",
                    attributes: [
                      "transactionId",
                      "haulingDate",
                      "haulingTime",
                      "remarks",
                      "statusId",
                      "createdAt",
                    ],
                    include: [
                      {
                        model: QuotationWaste,
                        as: "QuotationWaste",
                        attributes: ["wasteName"],
                      },
                      {
                        model: QuotationTransportation,
                        as: "QuotationTransportation",
                        attributes: ["id", "vehicleTypeId"],
                        include: [
                          {
                            model: VehicleType,
                            as: "VehicleType",
                            attributes: ["typeOfVehicle"],
                          },
                        ],
                      },
                      {
                        model: Client,
                        as: "Client",
                        attributes: ["clientId", "clientName"],
                      },
                    ],
                  },
                  {
                    model: Employee,
                    as: "Employee",
                    attributes: ["firstName", "lastName"],
                  },
                ],
              },
              {
                model: Employee,
                as: "EmployeeDriver",
                attributes: ["firstName", "lastName"],
              },
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
              {
                model: Vehicle,
                as: "Vehicle",
                attributes: ["plateNumber"],
              },
            ],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        ],
      },
      {
        model: SortedWasteTransaction,
        as: "SortedWasteTransaction",
        attributes: {
          include: [
            [
              sequelize.literal(`
                (
                  SELECT COALESCE(SUM(TreatedWasteTransaction.weight), 0)
                  FROM TreatedWasteTransactions AS TreatedWasteTransaction
                  WHERE TreatedWasteTransaction.sortedWasteTransactionId = SortedWasteTransaction.id
                )
              `),
              "treatedWeight",
            ],
          ],
        },
        include: [
          {
            model: TreatedWasteTransaction,
            as: "TreatedWasteTransaction",
          },
        ],
      },
      {
        model: SortedScrapTransaction,
        as: "SortedScrapTransaction",
        include: [
          {
            model: ScrapType,
            as: "ScrapType",
          },
        ],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
    where: sequelize.literal(`
      EXISTS (
        SELECT 1
        FROM SortedWasteTransactions AS swt
        LEFT JOIN (
          SELECT sortedWasteTransactionId, COALESCE(SUM(weight), 0) AS totalTreatedWeight
          FROM TreatedWasteTransactions
          GROUP BY sortedWasteTransactionId
        ) AS twt ON swt.id = twt.sortedWasteTransactionId
        WHERE swt.sortedTransactionId = SortedTransaction.id
        AND COALESCE(twt.totalTreatedWeight, 0) < swt.weight
      )
    `),
    order: [["id", "DESC"]],
  });
}

// Utility function to fetch finished transactions
async function fetchFinishedTransactions() {
  return await TreatedTransaction.findAll({
    attributes: [
      "id",
      "sortedTransactionId",
      "remarks",
      "createdBy",
      "createdAt",
    ],
    include: [
      {
        model: SortedTransaction,
        as: "SortedTransaction",
        attributes: [
          "id",
          "receivedTransactionId",
          "sortedDate",
          "sortedTime",
          "totalSortedWeight",
          "discrepancyWeight",
          "remarks",
          "createdBy",
          "createdAt",
        ],
        include: [
          {
            model: ReceivedTransaction,
            as: "ReceivedTransaction",
            attributes: [
              "id",
              "dispatchedTransactionId",
              "receivedDate",
              "receivedTime",
              "pttNo",
              "manifestNo",
              "pullOutFormNo",
              "manifestWeight",
              "clientWeight",
              "grossWeight",
              "tareWeight",
              "netWeight",
              "remarks",
              "createdBy",
              "createdAt",
            ],
            include: [
              {
                model: DispatchedTransaction,
                as: "DispatchedTransaction",
                attributes: [
                  "id",
                  "scheduledTransactionId",
                  "vehicleId",
                  "driverId",
                  "helperId",
                  "isDispatched",
                  "dispatchedDate",
                  "dispatchedTime",
                  "remarks",
                  "createdBy",
                  "createdAt",
                ],
                include: [
                  {
                    model: ScheduledTransaction,
                    as: "ScheduledTransaction",
                    attributes: [
                      "id",
                      "bookedTransactionId",
                      "scheduledDate",
                      "scheduledTime",
                      "remarks",
                      "createdBy",
                      "createdAt",
                    ],
                    include: [
                      {
                        model: BookedTransaction,
                        as: "BookedTransaction",
                        attributes: [
                          "transactionId",
                          "haulingDate",
                          "haulingTime",
                          "remarks",
                          "statusId",
                          "createdAt",
                        ],
                        include: [
                          {
                            model: QuotationWaste,
                            as: "QuotationWaste",
                            attributes: ["wasteName"],
                          },
                          {
                            model: QuotationTransportation,
                            as: "QuotationTransportation",
                            attributes: ["id", "vehicleTypeId"],
                            include: [
                              {
                                model: VehicleType,
                                as: "VehicleType",
                                attributes: ["typeOfVehicle"],
                              },
                            ],
                          },
                          {
                            model: Client,
                            as: "Client",
                            attributes: ["clientId", "clientName"],
                          },
                        ],
                      },
                      {
                        model: Employee,
                        as: "Employee",
                        attributes: ["firstName", "lastName"],
                      },
                    ],
                  },
                  {
                    model: Employee,
                    as: "EmployeeDriver",
                    attributes: ["firstName", "lastName"],
                  },
                  {
                    model: Employee,
                    as: "Employee",
                    attributes: ["firstName", "lastName"],
                  },
                  {
                    model: Vehicle,
                    as: "Vehicle",
                    attributes: ["plateNumber"],
                  },
                ],
              },
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: SortedWasteTransaction,
            as: "SortedWasteTransaction",
            attributes: ["id", "weight"],
            include: [
              {
                model: TreatedWasteTransaction,
                as: "TreatedWasteTransaction",
              },
            ],
          },
          {
            model: SortedScrapTransaction,
            as: "SortedScrapTransaction",
            include: [
              {
                model: ScrapType,
                as: "ScrapType",
              },
            ],
          },
          {
            model: TreatedTransaction,
            as: "TreatedTransaction",
            attributes: [
              "id",
              "sortedTransactionId",
              "remarks",
              "createdBy",
              "createdAt",
            ],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        ],
        order: [["id", "DESC"]],
      },
      {
        model: TreatedWasteTransaction,
        as: "TreatedWasteTransaction",
        attributes: ["id", "sortedWasteTransactionId", "weight"],
      },
    ],
    where: sequelize.literal(`
      EXISTS (
        SELECT 1
        FROM SortedTransactions AS st
        INNER JOIN SortedWasteTransactions AS swt ON st.id = swt.sortedTransactionId
        LEFT JOIN (
          SELECT sortedWasteTransactionId, COALESCE(SUM(weight), 0) AS totalTreatedWeight
          FROM TreatedWasteTransactions
          GROUP BY sortedWasteTransactionId
        ) AS twt ON swt.id = twt.sortedWasteTransactionId
        WHERE TreatedTransaction.sortedTransactionId = st.id
        GROUP BY st.id
        HAVING COUNT(swt.id) = COUNT(twt.sortedWasteTransactionId) AND
               SUM(swt.weight) = SUM(twt.totalTreatedWeight)
      )
    `),
    order: [["id", "DESC"]],
  });
}

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

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
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
    // Fetch pending and finished transactions
    const pendingTransactions = await fetchPendingTransactions();
    const finishedTransactions = await fetchFinishedTransactions();

    res.json({ pendingTransactions, finishedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Treated Transaction controller
async function updateTreatedTransactionController(req, res) {
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
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

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
              wasteName: waste.wasteName ? waste.wasteName.toUpperCase() : null,
              weight: waste.weight,
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
              wasteName: waste.wasteName ? waste.wasteName.toUpperCase() : null,
              weight: waste.weight,
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

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });

      // Commit the transaction
      await transaction.commit();
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

// Delete Treated Transaction controller
async function deleteTreatedTransactionController(req, res) {
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

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
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
  updateTreatedTransactionController,
  deleteTreatedTransactionController,
};
