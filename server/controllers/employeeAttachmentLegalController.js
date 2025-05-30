// controllers/employeeAttachmentLegalLegalController.js

const Employee = require("../models/Employee");
const EmployeeAttachmentLegal = require("../models/EmployeeAttachmentLegal");

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

// Create Employee AttachmentLegal controller
async function createEmployeeAttachmentLegalController(req, res) {
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

    // Create AttachmentLegal entry
    const newAttachmentLegalData = await EmployeeAttachmentLegal.create({
      employeeId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachmentLegal with the associated Employee data
    const newAttachmentLegal = await EmployeeAttachmentLegal.findByPk(
      newAttachmentLegalData.id,
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
    res.status(201).json({ newAttachmentLegal });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentLegals controller
async function getEmployeeAttachmentsLegalController(req, res) {
  try {
    // Fetch all Employee AttachmentLegals from the database
    const employeeAttachmentLegals = await EmployeeAttachmentLegal.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ employeeAttachmentLegals });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentLegal controller
async function getEmployeeAttachmentLegalController(req, res) {
  try {
    const employeeId = req.params.id;
    // Fetch Employee AttachmentLegal from the database
    const employeeAttachmentLegals = await EmployeeAttachmentLegal.findAll({
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

    res.json({ employeeAttachmentLegals });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentLegal controller
async function getEmployeeAttachmentLegalFullController(req, res) {
  try {
    const id = req.params.id;

    // Fetch Employee AttachmentLegal from the database
    const employeeAttachmentLegal = await EmployeeAttachmentLegal.findOne({
      where: { id },
      attributes: ["attachment"],
    });

    // Check if attachment exists
    if (!employeeAttachmentLegal || !employeeAttachmentLegal.attachment) {
      return res.status(404).json({ message: "AttachmentLegal not found" });
    }

    const attachmentBuffer = employeeAttachmentLegal.attachment; // Binary data of the attachment

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

// Delete Employee AttachmentLegal controller
async function deleteEmployeeAttachmentLegalController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Employee AttachmentLegal with ID:", id);

    // Find the Employee AttachmentLegal by ID
    const employeeAttachmentLegalToDelete =
      await EmployeeAttachmentLegal.findByPk(id);

    if (employeeAttachmentLegalToDelete) {
      // Soft delete the Employee AttachmentLegalType (sets deletedAt timestamp)
      await employeeAttachmentLegalToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Employee AttachmentLegal with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Employee AttachmentLegal with the specified ID was not found
      res
        .status(404)
        .json({ message: `Employee AttachmentLegal with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Employee AttachmentLegal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeAttachmentLegalController,
  getEmployeeAttachmentsLegalController,
  getEmployeeAttachmentLegalController,
  getEmployeeAttachmentLegalFullController,
  deleteEmployeeAttachmentLegalController,
};
