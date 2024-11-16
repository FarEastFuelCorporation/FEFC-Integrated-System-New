// controllers/transporterClientController.js

const TransporterClient = require("../models/TransporterClient");

// Create Transporter Client controller
async function createTransporterClientController(req, res) {
  try {
    // Extracting data from the request body
    let { clientName, address, contactNumber, createdBy } = req.body;

    clientName = clientName && clientName.toUpperCase();
    address = address && address.toUpperCase();

    // Creating a new transporterClients
    await TransporterClient.create({
      clientName,
      address,
      contactNumber,
      createdBy,
    });

    const transporterClients = await TransporterClient.findAll({
      order: [["clientName", "ASC"]],
    });

    // Respond with the updated transporterClients data
    res.status(201).json({ transporterClients });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Transporter Clients controller
async function getTransporterClientsController(req, res) {
  try {
    // Fetch all transporterClients from the database
    const transporterClients = await TransporterClient.findAll({
      order: [["clientName", "ASC"]],
    });

    console.log(transporterClients);

    res.json({ transporterClients });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Transporter Client controller
async function getTransporterClientController(req, res) {
  try {
    const id = req.params.id;

    // Fetch all transporterClients from the database
    const transporterClients = await TransporterClient.findAll({
      where: { createdBy: id },
      order: [["clientName", "ASC"]],
    });

    console.log(transporterClients);

    res.json({ transporterClients });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Transporter Client controller
async function updateTransporterClientController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating transporterClients with ID:", id);

    let { transporterClientsName, address, contactNumber, createdBy } =
      req.body;

    transporterClientsName =
      transporterClientsName && transporterClientsName.toUpperCase();
    address = address && address.toUpperCase();

    // Find the transporterClients by ID and update it
    const updatedTransporterClient = await TransporterClient.findByPk(id);

    if (updatedTransporterClient) {
      // Update transporterClients attributes
      updatedTransporterClient.transporterClientsName = transporterClientsName;
      updatedTransporterClient.address = address;
      updatedTransporterClient.contactNumber = contactNumber;
      updatedTransporterClient.updatedBy = createdBy;

      // Save the updated transporterClients
      await updatedTransporterClient.save();

      const transporterClients = await TransporterClient.findAll({
        order: [["transporterClientsName", "ASC"]],
      });
      // Respond with the updated transporterClients data
      res.json({ transporterClients });
    } else {
      // If transporterClients with the specified ID was not found
      res
        .status(404)
        .json({ message: ` TransporterClient with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating transporterClients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Transporter Client controller
async function deleteTransporterClientController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting TransporterClient with ID:", id);

    // Find the TransporterClient by ID
    const transporterClientsToDelete = await TransporterClient.findByPk(id);

    if (transporterClientsToDelete) {
      // Update the deletedBy field
      transporterClientsToDelete.updatedBy = deletedBy;
      transporterClientsToDelete.deletedBy = deletedBy;
      await transporterClientsToDelete.save();

      // Soft delete the TransporterClient (sets deletedAt timestamp)
      await transporterClientsToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `TransporterClient with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If TransporterClient with the specified ID was not found
      res
        .status(404)
        .json({ message: `TransporterClient with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting TransporterClient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTransporterClientController,
  getTransporterClientsController,
  getTransporterClientController,
  updateTransporterClientController,
  deleteTransporterClientController,
};
