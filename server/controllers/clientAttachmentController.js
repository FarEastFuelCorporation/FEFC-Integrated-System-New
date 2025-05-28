// controllers/clientAttachmentController.js

const ClientAttachment = require("../models/ClientAttachment");
const Employee = require("../models/Employee");

// Create Client Attachment controller
async function createClientAttachmentController(req, res) {
  try {
    // Extracting data from the request body
    let { clientId, fileName, createdBy } = req.body;
    console.log(req.body);

    fileName = fileName && fileName.toUpperCase();

    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Attachment entry
    const newAttachmentData = await ClientAttachment.create({
      clientId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachment with the associated Client data
    const newAttachment = await ClientAttachment.findByPk(
      newAttachmentData.id,
      {
        include: [
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
          },
        ],
      }
    );
    // Respond with the updated data
    res.status(201).json({ newAttachment });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Client Attachments controller
async function getClientAttachmentsController(req, res) {
  try {
    // Fetch all Client Attachments from the database
    const clientAttachments = await ClientAttachment.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ clientAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Client Attachment controller
async function getClientAttachmentController(req, res) {
  try {
    const clientId = req.params.id;
    // Fetch Client Attachment from the database
    const clientAttachments = await ClientAttachment.findAll({
      where: { clientId },
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ clientAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Client Attachment controller
async function deleteClientAttachmentController(req, res) {
  try {
    const id = req.params.id;

    console.log("Deleting client with ID:", id);

    // Find the client by UUID (id)
    const clientToDelete = await ClientAttachment.findByPk(id);

    if (clientToDelete) {
      await clientToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Client Attachment with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If client with the specified ID was not found
      res
        .status(404)
        .json({ message: `Client Attachment with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting client attachment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createClientAttachmentController,
  getClientAttachmentsController,
  getClientAttachmentController,
  deleteClientAttachmentController,
};
