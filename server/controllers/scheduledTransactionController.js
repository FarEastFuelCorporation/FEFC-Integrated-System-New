// controllers/scheduledTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");
const { Op, literal } = require("sequelize");

// Create Scheduled Transaction controller
async function createScheduledTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledDate,
      scheduledTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new client
    await ScheduledTransaction.create({
      bookedTransactionId,
      scheduledDate,
      scheduledTime,
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

      // Fetch pending transactions
      const pendingTransactions = await BookedTransaction.findAll({
        attributes: ["transactionId", "haulingDate", "haulingTime", "remarks"],
        where: {
          id: {
            [Op.notIn]: literal(
              "(SELECT `bookedTransactionId` FROM `ScheduledTransactions`)"
            ),
          },
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
            attributes: ["id"],
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
            attributes: ["clientName"],
          },
        ],
        order: [["transactionId", "DESC"]],
      });

      // Fetch finished transactions
      const finishedTransactions = await ScheduledTransaction.findAll({
        attributes: ["scheduledDate", "scheduledTime", "remarks", "createdBy"],
        include: [
          {
            model: BookedTransaction,
            as: "BookedTransaction",
            attributes: [
              "transactionId",
              "haulingDate",
              "haulingTime",
              "remarks",
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
                attributes: ["id"],
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
                attributes: ["clientName"],
              },
            ],
            order: [["transactionId", "DESC"]],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        ],
      });

      // Respond with the updated booked transaction data
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

// Get Scheduled Transactions controller
async function getScheduledTransactionsController(req, res) {
  try {
    // Fetch pending transactions
    const pendingTransactions = await BookedTransaction.findAll({
      attributes: [
        "transactionId",
        "haulingDate",
        "haulingTime",
        "remarks",
        "createdAt",
      ],
      where: {
        id: {
          [Op.notIn]: literal(
            "(SELECT `bookedTransactionId` FROM `ScheduledTransactions`)"
          ),
        },
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
          attributes: ["id"],
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
          attributes: ["clientName"],
        },
      ],
      order: [["transactionId", "DESC"]],
    });

    // Fetch finished transactions
    const finishedTransactions = await ScheduledTransaction.findAll({
      attributes: [
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
              attributes: ["id"],
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
              attributes: ["clientName"],
            },
          ],
          order: [["transactionId", "DESC"]],
        },
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    res.json({ pendingTransactions, finishedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Scheduled Transaction controller
async function updateScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating booked transaction with ID:", id);

    let {
      bookedTransactionId,
      scheduledDate,
      scheduledTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    remarks = remarks.toUpperCase();

    // Find the booked transaction by UUID (id) and update it
    const updatedBookedTransaction = await ScheduledTransaction.findByPk(id);

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.quotationWasteId = quotationWasteId;
      updatedBookedTransaction.quotationTransportationId =
        quotationTransportationId;
      updatedBookedTransaction.haulingDate = haulingDate;
      updatedBookedTransaction.haulingTime = haulingTime;
      updatedBookedTransaction.pttNo = pttNo;
      updatedBookedTransaction.manifestNo = manifestNo;
      updatedBookedTransaction.pullOutFormNo = pullOutFormNo;
      updatedBookedTransaction.remarks = remarks;
      updatedBookedTransaction.statusId = statusId;
      updatedBookedTransaction.updatedBy = createdBy;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      const bookedTransactions = await BookedTransaction.findAll({
        include: [
          {
            model: QuotationWaste,
            as: "QuotationWaste",
            include: [
              {
                model: TypeOfWaste,
                as: "TypeOfWaste",
              },
            ],
          },
          {
            model: QuotationTransportation,
            as: "QuotationTransportation",
            include: [
              {
                model: VehicleType,
                as: "VehicleType",
              },
            ],
          },
        ],
        order: [["transactionId", "DESC"]],
      });

      // Respond with the updated booked transaction data
      res.json({ bookedTransactions });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating booked transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Scheduled Transaction controller
async function deleteScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting booked transaction with ID:", id);

    // Find the booked transaction by UUID (id)
    const bookedTransactionToDelete = await BookedTransaction.findByPk(id);

    if (bookedTransactionToDelete) {
      // Update the deletedBy field
      bookedTransactionToDelete.updatedBy = deletedBy;
      bookedTransactionToDelete.deletedBy = deletedBy;
      await bookedTransactionToDelete.save();

      // Soft delete the booked transaction (sets deletedAt timestamp)
      await bookedTransactionToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Booked Transaction with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting booked transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createScheduledTransactionController,
  getScheduledTransactionsController,
  updateScheduledTransactionController,
  deleteScheduledTransactionController,
};
