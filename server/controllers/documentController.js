// controllers/documentController.js

const Document = require("../models/Document");
const Employee = require("../models/Employee");

// Create Document controller
async function createDocumentController(req, res) {
  try {
    // Extracting data from the request body
    let { fileName, expirationDate, createdBy } = req.body;
    console.log(req.body);

    if (fileName) {
      fileName = fileName.toUpperCase();
    }
    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Document entry
    await Document.create({
      fileName,
      expirationDate,
      attachment,
      createdBy,
    });

    const documents = await Document.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"], // Include only necessary fields
        },
      ],
      order: [["fileName", "ASC"]],
    });

    res.status(200).json({ documents }); // Send the documents directly in the response
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Documents controller
async function getDocumentsController(req, res) {
  try {
    // Fetch all documents from the database with related Employee data
    const documents = await Document.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"], // Include only necessary fields
        },
      ],
      order: [["fileName", "ASC"]],
    });

    res.status(200).json({ documents }); // Send the documents directly in the response
  } catch (error) {
    // Log error for debugging and send a response with a message
    console.error("Error fetching documents:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch documents. Internal server error." });
  }
}

// Update Document controller
async function updateDocumentController(req, res) {
  try {
    // Extracting document ID from request parameters
    const { id } = req.params;
    // Extracting data from the request body
    let { fileName, expirationDate, createdBy } = req.body;

    console.log(req.body);

    if (fileName) {
      fileName = fileName.toUpperCase(); // Optionally format the file name
    }

    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer; // Store the uploaded file if available
    }

    // Find the existing document
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Update the document fields
    document.fileName = fileName || document.fileName;
    document.expirationDate = expirationDate || document.expirationDate;
    document.createdBy = createdBy || document.createdBy;

    // Update attachment only if a new file is uploaded
    if (attachment) {
      document.attachment = attachment;
    }

    // Save the updated document
    await document.save();

    // Fetch updated document with associated Employee details
    const documents = await Document.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"], // Include only necessary fields
        },
      ],
      order: [["fileName", "ASC"]],
    });

    res.status(200).json({ documents }); // Send the documents directly in the response
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Document controller
async function deleteDocumentsController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Document with ID:", id);

    // Find the Document by UUID (id)
    const documentToDelete = await Document.findByPk(id);

    if (documentToDelete) {
      // Update the deletedBy field
      documentToDelete.updatedBy = deletedBy;
      documentToDelete.deletedBy = deletedBy;
      await documentToDelete.save();

      // Soft delete the Document (sets deletedAt timestamp)
      await documentToDelete.destroy();

      // Fetch all Document from the database
      const documents = await Document.findAll({
        include: [
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"], // Include only necessary fields
          },
        ],
        order: [["fileName", "ASC"]],
      });

      res.status(200).json({ documents }); // Send the documents directly in the response
    } else {
      // If Document with the specified ID was not found
      res.status(404).json({ message: `Document with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createDocumentController,
  getDocumentsController,
  updateDocumentController,
  deleteDocumentsController,
};
