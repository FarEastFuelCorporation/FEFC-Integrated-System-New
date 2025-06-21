// controllers/clientController.js

const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const ClientAttachment = require("../models/ClientAttachment");
const Employee = require("../models/Employee");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const generateClientId = require("../utils/generateClientId");

// Create Client controller
async function createClientController(req, res) {
  try {
    // Extracting data from the request body
    let {
      clientActivityStatus,
      clientTransactionStatus,
      clientHaulingStatus,
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      billerTinNumber,
      email,
      moaDate,
      moaEndDate,
      createdBy,
    } = req.body;

    let clientPicture = null;
    if (req.file) {
      clientPicture = req.file.buffer;
    }

    clientName = clientName && clientName.toUpperCase();
    address = address && address.toUpperCase();
    natureOfBusiness = natureOfBusiness && natureOfBusiness.toUpperCase();
    billerName = billerName && billerName.toUpperCase();
    billerAddress = billerAddress && billerAddress.toUpperCase();
    billerContactPerson =
      billerContactPerson && billerContactPerson.toUpperCase();

    // Generate a new client ID based on the client type
    const clientId = await generateClientId(clientType);

    // Creating a new client
    await Client.create({
      clientId,
      clientActivityStatus,
      clientTransactionStatus,
      clientHaulingStatus,
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      billerTinNumber,
      email,
      moaDate,
      moaEndDate,
      clientPicture,
      createdBy,
    });

    const clients = await Client.findAll();

    // Respond with the newly created client data
    res.status(201).json({ clients });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Clients controller
async function getClientsController(req, res) {
  try {
    const clients = await Client.findAll({
      where: { clientStatus: "ACTIVE" },
      order: [["clientName", "ASC"]],
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: BookedTransaction,
          as: "BookedTransaction",
          separate: true, // Fetch only the last transaction separately
          limit: 1,
          order: [["createdAt", "DESC"]], // Assumes you have createdAt timestamps
          include: [
            {
              model: ScheduledTransaction,
              as: "ScheduledTransaction",
              attributes: ["scheduledDate"],
            },
          ],
        },
      ],
    });

    res.json({ clients });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Client controller
async function getClientController(req, res) {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: ClientAttachment,
          as: "ClientAttachment",
          attributes: {
            exclude: ["attachment"], // Exclude the BLOB
          },
        },
        {
          model: BookedTransaction,
          as: "BookedTransaction",
          separate: true,
          limit: 1,
          order: [["createdAt", "DESC"]], // Assumes you have createdAt in BookedTransaction
          include: [
            {
              model: ScheduledTransaction,
              as: "ScheduledTransaction",
              attributes: ["scheduledDate"],
            },
          ],
        },
      ],
    });

    res.json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: error.message });
  }
}

// Update Client controller
async function updateClientController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating client with ID:", id);

    let {
      clientActivityStatus,
      clientTransactionStatus,
      clientHaulingStatus,
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      billerTinNumber,
      email,
      moaDate,
      moaEndDate,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    let clientPicture = null;
    if (req.file) {
      clientPicture = req.file.buffer;
    }

    console.log(clientPicture);

    clientName = clientName && clientName.toUpperCase();
    address = address && address.toUpperCase();
    natureOfBusiness = natureOfBusiness && natureOfBusiness.toUpperCase();
    billerName = billerName && billerName.toUpperCase();
    billerAddress = billerAddress && billerAddress.toUpperCase();
    billerContactPerson =
      billerContactPerson && billerContactPerson.toUpperCase();

    // Find the client by UUID (id) and update it
    const updatedClient = await Client.findByPk(id);

    if (updatedClient) {
      updatedClient.clientActivityStatus = clientActivityStatus || "";
      updatedClient.clientTransactionStatus = clientTransactionStatus || "";
      updatedClient.clientHaulingStatus = clientHaulingStatus || "";
      updatedClient.clientName = clientName || "";
      // Update client attributes
      updatedClient.address = address || "";
      updatedClient.natureOfBusiness = natureOfBusiness || "";
      updatedClient.contactNumber = contactNumber || "";
      updatedClient.clientType = clientType || "";
      updatedClient.billerName = billerName || "";
      updatedClient.billerAddress = billerAddress || "";
      updatedClient.billerContactPerson = billerContactPerson || "";
      updatedClient.billerContactNumber = billerContactNumber || "";
      updatedClient.billerTinNumber = billerTinNumber || "";
      updatedClient.email = email || "";
      updatedClient.updatedBy = createdBy;
      if (clientPicture !== null) {
        updatedClient.clientPicture = clientPicture;
      }
      updatedClient.moaDate = moaDate || null;
      updatedClient.moaEndDate = moaEndDate || null;

      // Save the updated client
      await updatedClient.save();

      const client = await Client.findByPk(id);

      console.log(client);

      // Respond with the updated client object
      res.json({ client });
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

// Delete Client controller
async function deleteClientController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting client with ID:", id);

    // Find the client by UUID (id)
    const clientToDelete = await Client.findByPk(id);

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
  createClientController,
  getClientsController,
  getClientController,
  updateClientController,
  deleteClientController,
};
