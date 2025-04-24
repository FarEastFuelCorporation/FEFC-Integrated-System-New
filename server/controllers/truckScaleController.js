// controllers/truckScaleController.js

const { Op } = require("sequelize");
const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const Client = require("../models/Client");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const generateTruckScaleNumber = require("../utils/generateTruckScaleNumber");
const TruckScale = require("../models/TruckScale");
const Employee = require("../models/Employee");
const { broadcastMessage } = require("../websocketManager");
const statusId = 2;
const additionalStatusId = 3;

// Create Truck Scale controller
async function createTruckScaleController(req, res) {
  try {
    const {
      transactionType,
      clientName,
      commodity,
      driver,
      plateNumber,
      firstScaleDate,
      firstScaleTime,
      secondScaleDate,
      secondScaleTime,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      createdBy,
    } = req.body;

    const truckScaleNumber = await generateTruckScaleNumber();

    const newEntry = await TruckScale.create({
      truckScaleNo: truckScaleNumber,
      transactionType,
      clientName: clientName?.toUpperCase() || null,
      commodity: commodity?.toUpperCase() || null,
      driver: driver?.toUpperCase() || null,
      plateNumber: plateNumber?.toUpperCase() || null,
      firstScaleDate,
      firstScaleTime,
      secondScaleDate: null,
      secondScaleTime: null,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      createdBy,
    });

    const truckScale = await TruckScale.findByPk(newEntry.id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Employee,
          as: "Employee2",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    broadcastMessage({
      type: "NEW_TRUCK_SCALE",
      data: truckScale,
    });

    res.status(201).json({
      message: "Truck scale entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error creating truck scale entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Truck Scales controller
async function getTruckScalesController(req, res) {
  try {
    // Fetch all truckScales from the database
    const truckScales = await TruckScale.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Employee,
          as: "Employee2",
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [
        ["createdAt", "DESC"], // Primary sort
      ],
    });

    res.json({ truckScales });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Truck Scale controller
async function updateTruckScaleController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Truck Scale entry with ID:", id);

    const {
      transactionType,
      clientName,
      commodity,
      driver,
      plateNumber,
      firstScaleDate,
      firstScaleTime,
      secondScaleDate,
      secondScaleTime,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      createdBy,
    } = req.body;

    const existingEntry = await TruckScale.findByPk(id);

    if (!existingEntry) {
      return res
        .status(404)
        .json({ message: `Truck Scale with ID ${id} not found` });
    }

    // Update fields
    existingEntry.transactionType = transactionType;
    existingEntry.clientName = clientName?.toUpperCase() || null;
    existingEntry.commodity = commodity?.toUpperCase() || null;
    existingEntry.driver = driver?.toUpperCase() || null;
    existingEntry.plateNumber = plateNumber?.toUpperCase() || null;
    existingEntry.firstScaleDate = firstScaleDate;
    existingEntry.firstScaleTime = firstScaleTime;
    existingEntry.secondScaleDate = secondScaleDate;
    existingEntry.secondScaleTime = secondScaleTime;
    existingEntry.grossWeight = grossWeight;
    existingEntry.tareWeight = tareWeight;
    existingEntry.netWeight = netWeight;
    existingEntry.remarks = remarks;
    existingEntry.updatedBy = createdBy;

    await existingEntry.save();

    const truckScale = await TruckScale.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: Employee,
          as: "Employee2",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    broadcastMessage({
      type: "UPDATE_TRUCK_SCALE",
      data: truckScale,
    });

    res.status(200).json({
      message: "Truck scale entry updated successfully",
      data: existingEntry,
    });
  } catch (error) {
    console.error("Error updating truck scale entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Truck Scale Controller
async function deleteTruckScaleController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting truck scale record with ID:", id);

    // Find the truck scale entry by its primary key
    const truckScaleToDelete = await TruckScale.findByPk(id);

    if (!truckScaleToDelete) {
      return res.status(404).json({
        message: `Truck Scale entry with ID ${id} not found`,
      });
    }

    // Set updatedBy and deletedBy
    truckScaleToDelete.updatedBy = deletedBy;
    truckScaleToDelete.deletedBy = deletedBy;

    // Save the updates before soft deleting
    await truckScaleToDelete.save();

    // Soft delete the truck scale entry (sets deletedAt timestamp if paranoid: true)
    await truckScaleToDelete.destroy();

    broadcastMessage({
      type: "DELETED_TRUCK_SCALE",
      data: truckScaleToDelete.id,
    });

    res.status(200).json({
      message: "Truck scale entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting truck scale entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTruckScaleController,
  getTruckScalesController,
  updateTruckScaleController,
  deleteTruckScaleController,
};
