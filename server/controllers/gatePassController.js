// controllers/gatePassController.js

const generateGatePassNumber = require("../utils/generateGatePassNumber");
const GatePass = require("../models/GatePass");
const Employee = require("../models/Employee");
const { broadcastMessage } = require("../websocketManager");
const GatePassItem = require("../models/GatePassItem");

// Create Gate Pass controller
async function createGatePassController(req, res) {
  try {
    const {
      dateIn,
      timeIn,
      dateOut,
      timeOut,
      issuedTo,
      company,
      address,
      plateNumber,
      vehicle,
      category,
      category2,
      truckScaleNo,
      remarks,
      items,
      createdBy,
    } = req.body;

    const gatePassNo = await generateGatePassNumber();

    // Create the main GatePass record
    const newEntry = await GatePass.create({
      gatePassNo,
      dateIn,
      timeIn,
      dateOut,
      timeOut,
      issuedTo: issuedTo?.toUpperCase() || null,
      company: company?.toUpperCase() || null,
      address: address?.toUpperCase() || null,
      plateNumber: plateNumber?.toUpperCase() || null,
      vehicle: vehicle?.toUpperCase() || null,
      category,
      category2,
      truckScaleNo,
      remarks: remarks?.toUpperCase() || null,
      createdBy,
    });

    // Create associated GatePassItems if any
    if (Array.isArray(items) && items.length > 0) {
      const formattedItems = items.map((item) => ({
        gatePassId: newEntry.id,
        description: item.description?.toUpperCase() || "",
        quantity: item.quantity || "",
        unit: item.unit || "",
      }));

      await GatePassItem.bulkCreate(formattedItems);
    }

    // Fetch the newly created GatePass along with Employee and GatePassItems
    const fullData = await GatePass.findByPk(newEntry.id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: GatePassItem,
          as: "GatePassItem",
        },
      ],
    });

    // Broadcast the new gate pass to connected clients
    broadcastMessage({
      type: "NEW_GATE_PASS",
      data: fullData,
    });

    // Respond to the client
    res.status(201).json({
      message: "Gate pass created successfully",
      data: fullData,
    });
  } catch (error) {
    console.error("Error creating gate pass:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Gate Passes controller
async function getGatePassesController(req, res) {
  try {
    // Fetch all gatePasses from the database
    const gatePasses = await GatePass.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: GatePassItem,
          as: "GatePassItem",
        },
      ],
      order: [
        ["createdAt", "DESC"], // Primary sort
      ],
    });

    res.json({ gatePasses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Gate Pass controller
async function updateGatePassController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Gate Pass entry with ID:", id);

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

    const existingEntry = await GatePass.findByPk(id);

    if (!existingEntry) {
      return res
        .status(404)
        .json({ message: `Gate Pass with ID ${id} not found` });
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

    const truckScale = await GatePass.findByPk(id, {
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

// Delete Gate Pass Controller
async function deleteGatePassController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting truck scale record with ID:", id);

    // Find the truck scale entry by its primary key
    const truckScaleToDelete = await GatePass.findByPk(id);

    if (!truckScaleToDelete) {
      return res.status(404).json({
        message: `Gate Pass entry with ID ${id} not found`,
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
  createGatePassController,
  getGatePassesController,
  updateGatePassController,
  deleteGatePassController,
};
