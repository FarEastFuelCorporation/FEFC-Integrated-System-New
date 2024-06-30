// controllers/bookedTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");
const generateTransactionId = require("../utils/generateTransactionId");

// Create Booked Transaction controller
async function createBookedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    const {
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

    const bookedTransactions = await BookedTransaction.findAll();

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
    // Fetch all clients from the database
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
    });

    res.json({ bookedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Booked Transaction controller
async function getBookedTransactionController(req, res) {
  try {
    const client = await Client.findByPk(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update Booked Transaction controller
async function updateBookedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating client with ID:", id);

    const {
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      createdBy,
    } = req.body;

    let clientPicture = null;
    if (req.file) {
      clientPicture = req.file.buffer;
    }

    // Find the client by UUID (id) and update it
    const updatedClient = await Client.findOne({ id });

    if (updatedClient) {
      // Update client attributes
      updatedClient.clientName = clientName;
      updatedClient.address = address;
      updatedClient.natureOfBusiness = natureOfBusiness;
      updatedClient.contactNumber = contactNumber;
      updatedClient.clientType = clientType;
      updatedClient.billerName = billerName;
      updatedClient.billerAddress = billerAddress;
      updatedClient.billerContactPerson = billerContactPerson;
      updatedClient.billerContactNumber = billerContactNumber;
      updatedClient.updatedBy = createdBy;
      updatedClient.clientPicture = clientPicture;

      // Save the updated client
      await updatedClient.save();

      const clients = await Client.findAll();

      // Respond with the updated client object
      res.json({ clients });
    } else {
      // If client with the specified ID was not found
      res.status(404).json({ message: `Client with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Booked Transaction controller
async function deleteBookedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting client with ID:", id);

    // Find the client by UUID (id)
    const clientToDelete = await Client.findOne({ id });

    if (clientToDelete) {
      // Update the deletedBy field
      clientToDelete.updatedBy = deletedBy;
      clientToDelete.deletedBy = deletedBy;
      await clientToDelete.save();

      // Soft delete the client (sets deletedAt timestamp)
      await clientToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Client with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If client with the specified ID was not found
      res.status(404).json({ message: `Client with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBookedTransactionController,
  getBookedTransactionsController,
  getBookedTransactionController,
  updateBookedTransactionController,
  deleteBookedTransactionController,
};
