// controllers/employeeAttachmentController.js

const Employee = require("../models/Employee");
const EmployeeAttachment = require("../models/EmployeeAttachment");

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

// Delete Employee Attachment controller
async function deleteEmployeeAttachmentController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Employee Attachment with ID:", id);

    // Find the Employee Attachment by ID
    const employeeAttachmentToDelete = await EmployeeAttachment.findByPk(id);

    if (employeeAttachmentToDelete) {
      // Update the deletedBy field
      employeeAttachmentToDelete.updatedBy = deletedBy;
      employeeAttachmentToDelete.deletedBy = deletedBy;
      await employeeAttachmentToDelete.save();

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
  deleteEmployeeAttachmentController,
};
