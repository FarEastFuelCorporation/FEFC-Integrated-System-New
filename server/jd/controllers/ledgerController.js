// controllers/ledgerController.js.js

const { broadcastMessage } = require("../../websocketManager");
const LedgerJD = require("../models/Ledger");

// Create Ledger controller
async function createLedgerJDController(req, res) {
  try {
    // Extracting data from the request body
    let {
      transactionDate,
      transactionDetails,
      transactionCategory,
      fundSource,
      fundAllocation,
      amount,
      remarks,
      createdBy,
    } = req.body;

    transactionDetails = transactionDetails && transactionDetails.toUpperCase();

    // Creating a new Ledger
    const newEntry = await LedgerJD.create({
      transactionDate,
      transactionDetails,
      transactionCategory,
      fundSource,
      fundAllocation,
      amount,
      remarks,
      createdBy,
    });

    const newCategory = await LedgerJD.findByPk(newEntry.id);

    broadcastMessage({
      type: "NEW_LEDGER_JD",
      data: newCategory,
    });

    res.status(201).json({
      message: "submitted successfully!",
    });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Ledgers controller
async function getLedgerJDsController(req, res) {
  try {
    // Fetch all ledger from the database
    const ledger = await LedgerJD.findAll({
      order: [["transactionDate", "ASC"]],
    });

    res.json({ ledger });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Ledger controller
async function updateLedgerJDController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Ledger with ID:", id);

    let { transactionDetails, createdBy } = req.body;

    transactionDetails = transactionDetails && transactionDetails.toUpperCase();

    // Find the Ledger by ID and update it
    const updatedLedgerJD = await LedgerJD.findByPk(id);

    if (updatedLedgerJD) {
      // Update Ledger attributes
      updatedLedgerJD.transactionDetails = transactionDetails;
      updatedLedgerJD.updatedBy = createdBy;

      // Save the updated Ledger
      await updatedLedgerJD.save();

      const updatedEntry = await LedgerJD.findByPk(id);

      broadcastMessage({
        type: "UPDATED_PRODUCT_CATEGORY_JD",
        data: updatedEntry,
      });

      res.status(201).json({
        message: "updated successfully!",
      });
    } else {
      // If Ledger with the specified ID was not found
      res.status(404).json({ message: `Ledger with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Ledger:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Ledger controller
async function deleteLedgerJDController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting LedgerJD with ID:", id);

    // Find the LedgerJD by ID
    const ledgerToDelete = await LedgerJD.findByPk(id);

    if (ledgerToDelete) {
      // Update the deletedBy field
      ledgerToDelete.updatedBy = deletedBy;
      ledgerToDelete.deletedBy = deletedBy;
      await ledgerToDelete.save();

      // Soft delete the LedgerJD (sets deletedAt timestamp)
      await ledgerToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PRODUCT_CATEGORY_JD",
        data: ledgerToDelete.id,
      });

      // Respond with a success message
      res.status(201).json({
        message: "deleted successfully!",
      });
    } else {
      // If LedgerJD with the specified ID was not found
      res.status(404).json({ message: `LedgerJD with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting LedgerJD:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getLedgerJDsController,
  createLedgerJDController,
  updateLedgerJDController,
  deleteLedgerJDController,
};
