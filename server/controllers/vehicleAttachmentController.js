// controllers/vehicleAttachmentController.js

const Employee = require("../models/Employee");
const VehicleAttachment = require("../models/VehicleAttachment");

// Create Vehicle Attachment controller
async function createVehicleAttachmentController(req, res) {
  try {
    // Extracting data from the request body
    let { plateNumber, fileName, createdBy } = req.body;
    console.log(req.body);

    fileName = fileName && fileName.toUpperCase();

    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Attachment entry
    const newAttachmentData = await VehicleAttachment.create({
      plateNumber,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachment with the associated Vehicle data
    const newAttachment = await VehicleAttachment.findByPk(
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

// Get Vehicle Attachments controller
async function getVehicleAttachmentsController(req, res) {
  try {
    // Fetch all Vehicle Attachments from the database
    const vehicleAttachments = await VehicleAttachment.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ vehicleAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Vehicle Attachment controller
async function getVehicleAttachmentController(req, res) {
  try {
    const plateNumber = req.params.id;
    // Fetch Vehicle Attachment from the database
    const vehicleAttachments = await VehicleAttachment.findAll({
      where: { plateNumber },
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ vehicleAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createVehicleAttachmentController,
  getVehicleAttachmentsController,
  getVehicleAttachmentController,
};
