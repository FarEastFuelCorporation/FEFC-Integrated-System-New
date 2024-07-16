// controllers/attachmentController.js

const Attachment = require("../models/Attachment");

// Create Certified Transaction controller
async function createAttachmentController(req, res) {
  try {
    // Extracting data from the request body
    let { bookedTransactionId, fileName, createdBy } = req.body;
    console.log(req.body);

    if (fileName) {
      fileName = fileName.toUpperCase();
    }
    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Attachment entry
    const newAttachment = await Attachment.create({
      bookedTransactionId,
      fileName,
      attachment,
      createdBy,
    });

    // Fetch all attachments from the database
    const attachments = await Attachment.findAll();

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
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createAttachmentController,
  getAttachmentsController,
};
