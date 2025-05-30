// controllers/employeeAttachmentController.js

const Employee = require("../models/Employee");
const EmployeeAttachment = require("../models/EmployeeAttachment");

// Helper function to determine MIME type
function determineMimeType(buffer) {
  const magicNumbers = Array.from(new Uint8Array(buffer.slice(0, 4))).join(",");

  if (magicNumbers.startsWith("255,216,255")) {
    return "image/jpeg";
  } else if (magicNumbers.startsWith("137,80,78,71")) {
    return "image/png";
  } else if (magicNumbers.startsWith("37,80,68,70")) {
    return "application/pdf";
  }
  return "application/octet-stream"; // Default MIME type
}

// Create Employee Attachment controller
async function createEmployeeAttachmentController(req, res) {
  try {
    // Extracting data from the request body
    let { employeeId, fileName, createdBy } = req.body;
    console.log(req.body);

    fileName = fileName && fileName.toUpperCase();

    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Attachment entry
    const newAttachmentData = await EmployeeAttachment.create({
      employeeId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachment with the associated Employee data
    const newAttachment = await EmployeeAttachment.findByPk(
      newAttachmentData.id,
      {
        attributes: { exclude: ["attachment"] },
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

// Get Employee Attachments controller
async function getEmployeeAttachmentsController(req, res) {
  try {
    // Fetch all Employee Attachments from the database
    const employeeAttachments = await EmployeeAttachment.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ employeeAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee Attachment controller
async function getEmployeeAttachmentController(req, res) {
  try {
    const employeeId = req.params.id;
    // Fetch Employee Attachment from the database
    const employeeAttachments = await EmployeeAttachment.findAll({
      attributes: { exclude: ["attachment"] },
      where: { employeeId },
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ employeeAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee Attachment controller
async function getEmployeeAttachmentFullController(req, res) {
  try {
    const id = req.params.id;

    // Fetch Employee Attachment from the database
    const employeeAttachment = await EmployeeAttachment.findOne({
      where: { id },
      attributes: ["attachment"],
    });

    // Check if attachment exists
    if (!employeeAttachment || !employeeAttachment.attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const attachmentBuffer = employeeAttachment.attachment; // Binary data of the attachment

    // Determine MIME type based on file signature or metadata (optional enhancement)
    // For now, let's assume you know the file type
    const mimeType = determineMimeType(attachmentBuffer);

    // Set headers for the response
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", "inline"); // For viewing in the browser

    // Send the binary attachment
    res.send(attachmentBuffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Employee Attachment controller
async function deleteEmployeeAttachmentController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Employee Attachment with ID:", id);

    // Find the Employee Attachment by ID
    const employeeAttachmentToDelete = await EmployeeAttachment.findByPk(id);

    if (employeeAttachmentToDelete) {
      // Soft delete the Employee AttachmentType (sets deletedAt timestamp)
      await employeeAttachmentToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Employee Attachment with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Employee Attachment with the specified ID was not found
      res
        .status(404)
        .json({ message: `Employee Attachment with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Employee Attachment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeAttachmentController,
  getEmployeeAttachmentsController,
  getEmployeeAttachmentController,
  getEmployeeAttachmentFullController,
  deleteEmployeeAttachmentController,
};
