// controllers/sortingTransactionController.js

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

// Utility function to fetch pending transactions
async function fetchPendingTransactions() {
  return await ReceivedTransaction.findAll({
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
    where: {
      id: {
        [Op.notIn]: literal(
          "(SELECT `receivedTransactionId` FROM `SortedTransactions` WHERE `deletedAt` IS NULL)"
        ),
      },
    },
    order: [["id", "DESC"]],
  });
}

// Utility function to fetch finished transactions
async function fetchFinishedTransactions() {
  return await SortedTransaction.findAll({
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
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],

    order: [["id", "DESC"]],
  });
}

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

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new sorted transaction
    const newSortedTransaction = await SortedTransaction.create(
      {
        receivedTransactionId,
        sortedDate,
        sortedTime,
        totalSortedWeight,
        discrepancyWeight,
        createdBy,
      },
      { transaction: transaction }
    );

    // Adding sorted wastes to SortedWasteTransaction table
    if (sortedWastes && sortedWastes.length > 0) {
      const sortedWastePromises = sortedWastes.map((waste) => {
        let wasteName = waste.wasteName;

        if (wasteName) {
          wasteName = wasteName.toUpperCase();
        }

        return SortedWasteTransaction.create(
          {
            sortedTransactionId: newSortedTransaction.id,
            quotationWasteId: waste.quotationWasteId,
            treatmentProcessId: waste.treatmentProcessId,
            wasteName: wasteName,
            weight: waste.weight,
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

      // Fetch pending and finished transactions
      const pendingTransactions = await fetchPendingTransactions();
      const finishedTransactions = await fetchFinishedTransactions();

      // Respond with the updated data
      res.json({ pendingTransactions, finishedTransactions });
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
    // Fetch pending and finished transactions
    const pendingTransactions = await fetchPendingTransactions();
    const finishedTransactions = await fetchFinishedTransactions();

    res.json({ pendingTransactions, finishedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Sorted Transaction controller
async function updateSortedTransactionController(req, res) {
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
      remarks,
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
      updatedSortedTransaction.updatedBy = createdBy;

      // Save the updated sorted transaction
      await updatedSortedTransaction.save();

      // Fetch existing sorted wastes from the database
      const existingSortedWastes = await SortedWasteTransaction.findAll({
        where: { sortedTransactionId: id },
      });

      // Extract existing sorted waste IDs
      const existingWasteIds = existingSortedWastes.map((waste) => waste.id);

      // Extract updated sorted waste IDs from the request body
      const updatedWasteIds = sortedWastes.map((waste) => waste.id);

      // Identify wastes to delete (those not present in the updated data)
      const wastesToDelete = existingSortedWastes.filter(
        (waste) => !updatedWasteIds.includes(waste.id)
      );

      // Identify wastes to update and create
      const sortedWastePromises = sortedWastes.map(async (waste) => {
        if (waste.id && existingWasteIds.includes(waste.id)) {
          // Update existing waste
          let wasteName = waste.wasteName;

          if (wasteName) {
            wasteName = wasteName.toUpperCase();
          }
          await SortedWasteTransaction.update(
            {
              quotationWasteId: waste.quotationWasteId,
              treatmentProcessId: waste.treatmentProcessId,
              wasteName: wasteName,
              weight: waste.weight,
              formNo: waste.formNo,
            },
            { where: { id: waste.id } }
          );
        } else {
          // Create new waste
          await SortedWasteTransaction.create({
            sortedTransactionId: id,
            quotationWasteId: waste.quotationWasteId,
            treatmentProcessId: waste.treatmentProcessId,
            wasteName: waste.wasteName ? waste.wasteName.toUpperCase() : null,
            weight: waste.weight,
            formNo: waste.formNo,
          });
        }
      });

      // Delete wastes that are no longer present
      const deleteWastePromises = wastesToDelete.map((waste) =>
        SortedWasteTransaction.destroy({ where: { id: waste.id } })
      );

      // Wait for all promises to resolve
      await Promise.all([...sortedWastePromises, ...deleteWastePromises]);

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
    console.error("Error updating sorted transaction:", error);
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
  createSortedTransactionController,
  getSortedTransactionsController,
  updateSortedTransactionController,
  deleteSortedTransactionController,
};
