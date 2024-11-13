// controllers/attachmentController.js

const Attachment = require("../models/Attachment");
const Employee = require("../models/Employee");

// Create Certified Transaction controller
async function createAttachmentController(req, res) {
  try {
    // Extracting data from the request body
    let { bookedTransactionId, fileName, createdBy } = req.body;
    console.log(req.body);

    fileName = fileName && fileName.toUpperCase();

    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Attachment entry
    const newAttachmentData = await Attachment.create({
      bookedTransactionId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachment with the associated Employee data
    const newAttachment = await Attachment.findByPk(newAttachmentData.id, {
      attributes: { exclude: ["attachment"] },
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"], // Include only necessary fields
        },
      ],
    });
    // Respond with the updated data
    res.status(201).json({ newAttachment });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Attachments controller
async function getAttachmentsController(req, res) {
  try {
    // Fetch all clients from the database
    const attachments = await Attachment.findAll();

    res.json({ attachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Attachment controller
async function getAttachmentController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all clients from the database
    const attachments = await Attachment.findByPk(id, {});

    res.json({ attachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Attachment controller with hard delete
async function deleteAttachmentController(req, res) {
  try {
    const id = req.params.id;

    console.log("Hard deleting Attachment with ID:", id);

    // Find the Attachment by UUID (id)
    const attachmentToDelete = await Attachment.findByPk(id);

    if (attachmentToDelete) {
      // Hard delete the Attachment (permanently removes it from the database)
      await attachmentToDelete.destroy({ force: true });

      res.json({
        message: `Attachment with ID ${id} hard-deleted successfully`,
      });
    } else {
      // If Attachment with the specified ID was not found
      res.status(404).json({ message: `Attachment with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error hard-deleting Attachment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createAttachmentController,
  getAttachmentsController,
  getAttachmentController,
  deleteAttachmentController,
};
