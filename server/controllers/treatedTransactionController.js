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
const TreatmentProcess = require("../models/TreatmentProcess");
const TreatmentMachine = require("../models/TreatmentMachine");

// Utility function to fetch pending transactions
async function fetchPendingTransactions() {
  return await SortedTransaction.findAll({
    attributes: {
      exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
    },
    include: [
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        attributes: {
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
            include: [
              {
                model: ScheduledTransaction,
                as: "ScheduledTransaction",
                attributes: {
                  exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
                },
                include: [
                  {
                    model: BookedTransaction,
                    as: "BookedTransaction",
                    attributes: {
                      exclude: [
                        "updatedAt",
                        "updatedBy",
                        "deletedAt",
                        "deletedBy",
                      ],
                    },
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
                  AND TreatedWasteTransaction.deletedAt IS NULL
                )
              `),
              "treatedWeight",
            ],
          ],
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: TreatedWasteTransaction,
            as: "TreatedWasteTransaction",
            include: [
              {
                model: TreatmentProcess,
                as: "TreatmentProcess",
              },
              {
                model: TreatmentMachine,
                as: "TreatmentMachine",
              },
              {
                model: TreatedTransaction,
                as: "TreatedTransaction",
                include: [
                  {
                    model: Employee,
                    as: "Employee",
                    attributes: ["firstName", "lastName"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: SortedScrapTransaction,
        as: "SortedScrapTransaction",
        attributes: {
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: ScrapType,
            as: "ScrapType",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
          },
        ],
      },
      {
        model: TreatedTransaction,
        as: "TreatedTransaction",
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
          WHERE deletedAt IS NULL  -- Exclude deleted TreatedWasteTransactions
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
  return await SortedTransaction.findAll({
    attributes: {
      exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
    },
    include: [
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        attributes: {
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: DispatchedTransaction,
            as: "DispatchedTransaction",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
            include: [
              {
                model: ScheduledTransaction,
                as: "ScheduledTransaction",
                attributes: {
                  exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
                },
                include: [
                  {
                    model: BookedTransaction,
                    as: "BookedTransaction",
                    attributes: {
                      exclude: [
                        "updatedAt",
                        "updatedBy",
                        "deletedAt",
                        "deletedBy",
                      ],
                    },
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
                  AND TreatedWasteTransaction.deletedAt IS NULL
                )
              `),
              "treatedWeight",
            ],
          ],
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: TreatedWasteTransaction,
            as: "TreatedWasteTransaction",
            include: [
              {
                model: TreatmentProcess,
                as: "TreatmentProcess",
              },
              {
                model: TreatmentMachine,
                as: "TreatmentMachine",
              },
              {
                model: TreatedTransaction,
                as: "TreatedTransaction",
                include: [
                  {
                    model: Employee,
                    as: "Employee",
                    attributes: ["firstName", "lastName"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: SortedScrapTransaction,
        as: "SortedScrapTransaction",
        attributes: {
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: ScrapType,
            as: "ScrapType",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
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
      NOT EXISTS (
        SELECT 1
        FROM SortedWasteTransactions AS swt
        LEFT JOIN (
          SELECT sortedWasteTransactionId, COALESCE(SUM(weight), 0) AS totalTreatedWeight
          FROM TreatedWasteTransactions
          WHERE deletedAt IS NULL
          GROUP BY sortedWasteTransactionId
        ) AS twt ON swt.id = twt.sortedWasteTransactionId
        WHERE swt.sortedTransactionId = SortedTransaction.id
        AND COALESCE(twt.totalTreatedWeight, 0) != swt.weight
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

// Delete Treated Transaction controller
async function deleteTreatedTransactionController(req, res) {
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
  deleteTreatedTransactionController,
};
