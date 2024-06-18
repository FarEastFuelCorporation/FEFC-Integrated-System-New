require("dotenv").config();
const Client = require("../models/Client");
const generateClientId = require("../utils/generateClientId");

// Dashboard controller

// Get Clients controller
async function getClientsController(req, res) {
  try {
    // Fetch all clients from the database
    const clients = await Client.findAll();

    res.json({ clients });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Client controller
async function createClientController(req, res) {
  try {
    // Extracting data from the request body
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
    } = req.body;

    // Generate a new client ID based on the client type
    const clientId = await generateClientId(clientType);

    // Creating a new client
    const newClient = await Client.create({
      clientId,
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
    });

    // Respond with the newly created client data
    res.status(201).json(newClient);
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Client controller
async function updateClientController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating client with ID:", id);

    const { clientName, address, natureOfBusiness, contactNumber, clientType } =
      req.body;

    // Find the client by UUID (id) and update it
    const updatedClient = await Client.findByPk(id);

    if (updatedClient) {
      // Update client attributes
      updatedClient.clientName = clientName;
      updatedClient.address = address;
      updatedClient.natureOfBusiness = natureOfBusiness;
      updatedClient.contactNumber = contactNumber;
      updatedClient.clientType = clientType;

      // Save the updated client
      await updatedClient.save();

      // Respond with the updated client object
      res.json(updatedClient);
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
    console.log("Soft deleting client with ID:", id);

    // Find the client by UUID (id)
    const clientToDelete = await Client.findByPk(id);

    if (clientToDelete) {
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
  getClientsController,
  createClientController,
  updateClientController,
  deleteClientController,
};
