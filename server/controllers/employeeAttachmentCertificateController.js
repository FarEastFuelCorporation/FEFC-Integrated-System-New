// controllers/employeeAttachmentCertificateController.js

const Employee = require("../models/Employee");
const EmployeeAttachmentCertificate = require("../models/EmployeeAttachmentCertificate");

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

// Create Employee AttachmentCertificate controller
async function createEmployeeAttachmentCertificateController(req, res) {
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

    // Create AttachmentCertificate entry
    const newAttachmentCertificateData =
      await EmployeeAttachmentCertificate.create({
        employeeId,
        fileName,
        attachment,
        createdBy,
      });

    // Retrieve the newAttachmentCertificate with the associated Employee data
    const newAttachmentCertificate =
      await EmployeeAttachmentCertificate.findByPk(
        newAttachmentCertificateData.id,
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
    res.status(201).json({ newAttachmentCertificate });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentCertificates controller
async function getEmployeeAttachmentsCertificateController(req, res) {
  try {
    // Fetch all Employee AttachmentCertificates from the database
    const employeeAttachmentCertificates =
      await EmployeeAttachmentCertificate.findAll({
        include: [
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
          },
        ],
      });

    res.json({ employeeAttachmentCertificates });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentCertificate controller
async function getEmployeeAttachmentCertificateController(req, res) {
  try {
    const employeeId = req.params.id;
    // Fetch Employee AttachmentCertificate from the database
    const employeeAttachmentCertificates =
      await EmployeeAttachmentCertificate.findAll({
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

    res.json({ employeeAttachmentCertificates });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentCertificate controller
async function getEmployeeAttachmentCertificateFullController(req, res) {
  try {
    const id = req.params.id;

    // Fetch Employee AttachmentCertificate from the database
    const employeeAttachmentCertificate =
      await EmployeeAttachmentCertificate.findOne({
        where: { id },
        attributes: ["attachment"],
      });

    // Check if attachment exists
    if (
      !employeeAttachmentCertificate ||
      !employeeAttachmentCertificate.attachment
    ) {
      return res
        .status(404)
        .json({ message: "AttachmentCertificate not found" });
    }

    const attachmentBuffer = employeeAttachmentCertificate.attachment; // Binary data of the attachment

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

// Delete Employee AttachmentCertificate controller
async function deleteEmployeeAttachmentCertificateController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Employee AttachmentCertificate with ID:", id);

    // Find the Employee AttachmentCertificate by ID
    const employeeAttachmentCertificateToDelete =
      await EmployeeAttachmentCertificate.findByPk(id);

    if (employeeAttachmentCertificateToDelete) {
      // Soft delete the Employee AttachmentCertificateType (sets deletedAt timestamp)
      await employeeAttachmentCertificateToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Employee AttachmentCertificate with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Employee AttachmentCertificate with the specified ID was not found
      res.status(404).json({
        message: `Employee AttachmentCertificate with ID ${id} not found`,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Employee AttachmentCertificate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeAttachmentCertificateController,
  getEmployeeAttachmentsCertificateController,
  getEmployeeAttachmentCertificateController,
  getEmployeeAttachmentCertificateFullController,
  deleteEmployeeAttachmentCertificateController,
};
