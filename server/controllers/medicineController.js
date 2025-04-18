// controllers/medicineController.js

const { Op } = require("sequelize");
const Medicine = require("../models/Medicine");
const MedicineLog = require("../models/MedicineLog");
const Employee = require("../models/Employee");

// Create Medicine controller
async function createMedicineController(req, res) {
  try {
    // Extracting data from the request body
    let { medicineName, createdBy } = req.body;

    medicineName = medicineName && medicineName.toUpperCase();

    // Creating a new medicines
    await Medicine.create({
      medicineName,
      createdBy,
    });

    // Fetch all medicines from the database
    const medicines = await Medicine.findAll({
      order: [["medicineName", "ASC"]],
    });

    // Respond with the updated data
    res.json({ medicines });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Medicines controller
async function getMedicinesController(req, res) {
  try {
    // Fetch all medicines from the database
    const medicines = await Medicine.findAll({
      order: [["medicineName", "ASC"]],
    });

    // Respond with the combined data
    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Error fetching medicines or logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get Medicines controller
async function getMedicinesQuantityController(req, res) {
  try {
    // Fetch all medicines from the database
    const medicines = await Medicine.findAll({
      order: [["medicineName", "ASC"]],
    });

    // Fetch all medicine logs from the database
    const medicineLogs = await MedicineLog.findAll({
      attributes: ["medicineId", "transaction", "quantity"],
    });

    // Calculate total quantities for each medicine
    const medicineQuantities = {};

    medicineLogs.forEach((log) => {
      const { medicineId, transaction, quantity } = log;

      if (!medicineQuantities[medicineId]) {
        medicineQuantities[medicineId] = 0;
      }

      // Adjust the quantity based on the transaction type
      if (transaction === "RE-STOCK") {
        medicineQuantities[medicineId] += quantity;
      } else if (transaction === "ISSUANCE") {
        medicineQuantities[medicineId] -= quantity;
      }
    });

    // Combine medicines with their calculated quantities
    const medicinesWithQuantities = medicines.map((medicine) => {
      return {
        ...medicine.get(), // Convert Sequelize instance to plain object
        quantity: medicineQuantities[medicine.id] || 0, // Default to 0 if no logs
      };
    });

    // Respond with the combined data
    res.status(200).json({ medicines: medicinesWithQuantities });
  } catch (error) {
    console.error("Error fetching medicines or logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update Medicine controller
async function updateMedicineController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating medicine with ID:", id);

    // Extracting data from the request body
    let { medicine, createdBy } = req.body;

    medicine = medicine && medicine.toUpperCase();

    // Find the medicine by UUID (id) and update it
    const updatedMedicine = await Medicine.findByPk(id);

    if (updatedMedicine) {
      // Update medicine attributes
      updatedMedicine.medicine = medicine;
      updatedMedicine.updatedBy = createdBy;

      // Save the updated medicine
      await updatedMedicine.save();

      // Fetch all medicines from the database
      const medicines = await Medicine.findAll({
        order: [["medicine", "ASC"]],
      });

      // Respond with the updated data
      res.json({ medicines });
    } else {
      // If dispatched transaction with the specified ID was not found
      res.status(404).json({ message: `Medicine with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Medicine controller
async function deleteMedicineController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting medicine with ID:", id);

    // Find the medicine by UUID (id)
    const medicineToDelete = await Medicine.findByPk(id);

    if (medicineToDelete) {
      // Update the deletedBy field
      medicineToDelete.updatedBy = deletedBy;
      medicineToDelete.deletedBy = deletedBy;
      await medicineToDelete.save();

      // Soft delete the medicine (sets deletedAt timestamp)
      await medicineToDelete.destroy();

      // Fetch all medicines from the database
      const medicines = await Medicine.findAll({
        order: [["medicine", "ASC"]],
      });

      // Respond with the updated data
      res.json({ medicines });
    } else {
      // If medicine with the specified ID was not found
      res.status(404).json({ message: `medicine with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting medicine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createMedicineController,
  getMedicinesController,
  getMedicinesQuantityController,
  updateMedicineController,
  deleteMedicineController,
};
