// controllers/employeeAttachmentMemoController.js

const Employee = require("../models/Employee");
const EmployeeAttachmentMemo = require("../models/EmployeeAttachmentMemo");

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

// Create Employee AttachmentMemo controller
async function createEmployeeAttachmentMemoController(req, res) {
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

    // Create AttachmentMemo entry
    const newAttachmentMemoData = await EmployeeAttachmentMemo.create({
      employeeId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachmentMemo with the associated Employee data
    const newAttachmentMemo = await EmployeeAttachmentMemo.findByPk(
      newAttachmentMemoData.id,
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
    res.status(201).json({ newAttachmentMemo });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentMemos controller
async function getEmployeeAttachmentsMemoController(req, res) {
  try {
    // Fetch all Employee AttachmentMemos from the database
    const employeeAttachmentMemos = await EmployeeAttachmentMemo.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName", "affix"], // Include only necessary fields
        },
      ],
    });

    res.json({ employeeAttachmentMemos });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentMemo controller
async function getEmployeeAttachmentMemoController(req, res) {
  try {
    const employeeId = req.params.id;
    // Fetch Employee AttachmentMemo from the database
    const employeeAttachmentMemos = await EmployeeAttachmentMemo.findAll({
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

    res.json({ employeeAttachmentMemos });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee AttachmentMemo controller
async function getEmployeeAttachmentMemoFullController(req, res) {
  try {
    const id = req.params.id;

    // Fetch Employee AttachmentMemo from the database
    const employeeAttachmentMemo = await EmployeeAttachmentMemo.findOne({
      where: { id },
      attributes: ["attachment"],
    });

    // Check if attachment exists
    if (!employeeAttachmentMemo || !employeeAttachmentMemo.attachment) {
      return res.status(404).json({ message: "AttachmentMemo not found" });
    }

    const attachmentBuffer = employeeAttachmentMemo.attachment; // Binary data of the attachment

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

// Delete Employee AttachmentMemo controller
async function deleteEmployeeAttachmentMemoController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Employee AttachmentMemo with ID:", id);

    // Find the Employee AttachmentMemo by ID
    const employeeAttachmentMemoToDelete =
      await EmployeeAttachmentMemo.findByPk(id);

    if (employeeAttachmentMemoToDelete) {
      // Soft delete the Employee AttachmentMemoType (sets deletedAt timestamp)
      await employeeAttachmentMemoToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Employee AttachmentMemo with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Employee AttachmentMemo with the specified ID was not found
      res
        .status(404)
        .json({ message: `Employee AttachmentMemo with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Employee AttachmentMemo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeAttachmentMemoController,
  getEmployeeAttachmentsMemoController,
  getEmployeeAttachmentMemoController,
  getEmployeeAttachmentMemoFullController,
  deleteEmployeeAttachmentMemoController,
};
