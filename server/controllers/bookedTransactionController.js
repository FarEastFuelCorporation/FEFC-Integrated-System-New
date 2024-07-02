// controllers/bookedTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");
const generateTransactionId = require("../utils/generateTransactionId");

// Create Booked Transaction controller
async function createBookedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      quotationWasteId,
      quotationTransportationId,
      haulingDate,
      haulingTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    const transactionId = await generateTransactionId();

    // Creating a new client
    await BookedTransaction.create({
      transactionId,
      quotationWasteId,
      quotationTransportationId,
      haulingDate,
      haulingTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      remarks,
      statusId,
      createdBy,
    });

    // Fetch all bookedTransactions from the database
    const bookedTransactions = await BookedTransaction.findAll({
      attributes: ["transactionId", "haulingDate", "haulingTime", "remarks"],
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

    // Respond with the newly created client data
    res.status(201).json({ bookedTransactions });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Booked Transactions controller
async function getBookedTransactionsController(req, res) {
  try {
    // Fetch all bookedTransactions from the database
    const bookedTransactions = await BookedTransaction.findAll({
      attributes: ["transactionId", "haulingDate", "haulingTime", "remarks"],
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

    res.json({ bookedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Booked Transaction controller
async function updateBookedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating booked transaction with ID:", id);

    let {
      quotationWasteId,
      quotationTransportationId,
      haulingDate,
      haulingTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the booked transaction by UUID (id) and update it
    const updatedBookedTransaction = await BookedTransaction.findByPk(id);

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

      // Fetch all bookedTransactions from the database
      const bookedTransactions = await BookedTransaction.findAll({
        attributes: ["transactionId", "haulingDate", "haulingTime", "remarks"],
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

// Delete Booked Transaction controller
async function deleteBookedTransactionController(req, res) {
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
  createBookedTransactionController,
  getBookedTransactionsController,
  updateBookedTransactionController,
  deleteBookedTransactionController,
};
