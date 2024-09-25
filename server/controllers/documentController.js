// controllers/documentController.js

const Document = require("../models/Document");
const Employee = require("../models/Employee");

// Create Document controller
async function createDocumentController(req, res) {
  try {
    // Extracting data from the request body
    let { fileName, createdBy } = req.body;
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

module.exports = {
  createDocumentController,
  getDocumentsController,
};
