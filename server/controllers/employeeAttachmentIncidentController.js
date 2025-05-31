// controllers/employeeAttachmentIncidentController.js

const Employee = require("../models/Employee");
const EmployeeAttachmentIncident = require("../models/EmployeeAttachmentIncident");

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

// Create Employee AttachmentIncident controller
async function createEmployeeAttachmentIncidentController(req, res) {
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

    // Create AttachmentIncident entry
    const newAttachmentIncidentData = await EmployeeAttachmentIncident.create({
      employeeId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachmentIncident with the associated Employee data
    const newAttachmentIncident = await EmployeeAttachmentIncident.findByPk(
      newAttachmentIncidentData.id,
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
    res.status(201).json({ newAttachmentIncident });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentIncidents controller
async function getEmployeeAttachmentsIncidentController(req, res) {
  try {
    // Fetch all Employee AttachmentIncidents from the database
    const employeeAttachmentIncidents =
      await EmployeeAttachmentIncident.findAll({
        include: [
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
          },
        ],
      });

    res.json({ employeeAttachmentIncidents });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentIncident controller
async function getEmployeeAttachmentIncidentController(req, res) {
  try {
    const employeeId = req.params.id;
    // Fetch Employee AttachmentIncident from the database
    const employeeAttachmentIncidents =
      await EmployeeAttachmentIncident.findAll({
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

    res.json({ employeeAttachmentIncidents });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentIncident controller
async function getEmployeeAttachmentIncidentFullController(req, res) {
  try {
    const id = req.params.id;

    // Fetch Employee AttachmentIncident from the database
    const employeeAttachmentIncident = await EmployeeAttachmentIncident.findOne(
      {
        where: { id },
        attributes: ["attachment"],
      }
    );

    // Check if attachment exists
    if (!employeeAttachmentIncident || !employeeAttachmentIncident.attachment) {
      return res.status(404).json({ message: "AttachmentIncident not found" });
    }

    const attachmentBuffer = employeeAttachmentIncident.attachment; // Binary data of the attachment

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

// Delete Employee AttachmentIncident controller
async function deleteEmployeeAttachmentIncidentController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Employee AttachmentIncident with ID:", id);

    // Find the Employee AttachmentIncident by ID
    const employeeAttachmentIncidentToDelete =
      await EmployeeAttachmentIncident.findByPk(id);

    if (employeeAttachmentIncidentToDelete) {
      // Soft delete the Employee AttachmentIncidentType (sets deletedAt timestamp)
      await employeeAttachmentIncidentToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Employee AttachmentIncident with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Employee AttachmentIncident with the specified ID was not found
      res.status(404).json({
        message: `Employee AttachmentIncident with ID ${id} not found`,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Employee AttachmentIncident:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeAttachmentIncidentController,
  getEmployeeAttachmentsIncidentController,
  getEmployeeAttachmentIncidentController,
  getEmployeeAttachmentIncidentFullController,
  deleteEmployeeAttachmentIncidentController,
};
