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
      updatedBy,
    } = req.body;

    const existingEntry = await GatePass.findByPk(id);

    if (!existingEntry) {
      return res.status(404).json({
        message: `Gate Pass with ID ${id} not found`,
      });
    }

    // Update main GatePass fields
    existingEntry.dateIn = dateIn;
    existingEntry.timeIn = timeIn;
    existingEntry.dateOut = dateOut;
    existingEntry.timeOut = timeOut;
    existingEntry.issuedTo = issuedTo?.toUpperCase() || null;
    existingEntry.company = company?.toUpperCase() || null;
    existingEntry.address = address?.toUpperCase() || null;
    existingEntry.plateNumber = plateNumber?.toUpperCase() || null;
    existingEntry.vehicle = vehicle?.toUpperCase() || null;
    existingEntry.category = category;
    existingEntry.category2 = category2;
    existingEntry.truckScaleNo = truckScaleNo;
    existingEntry.remarks = remarks?.toUpperCase() || null;
    existingEntry.updatedBy = updatedBy;

    await existingEntry.save();

    // Handle GatePassItems update (delete old, insert new)
    if (Array.isArray(items)) {
      await GatePassItem.destroy({ where: { gatePassId: id } });

      const formattedItems = items.map((item) => ({
        gatePassId: id,
        description: item.description?.toUpperCase() || "",
        quantity: item.quantity || "",
        unit: item.unit || "",
      }));

      await GatePassItem.bulkCreate(formattedItems);
    }

    // Fetch the updated GatePass with relations
    const updatedData = await GatePass.findByPk(id, {
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

    // Broadcast the updated gate pass
    broadcastMessage({
      type: "UPDATE_GATE_PASS",
      data: updatedData,
    });

    res.status(200).json({
      message: "Gate pass updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating gate pass:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Gate Pass Controller
async function deleteGatePassController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting gate pass record with ID:", id);

    // Find the gate pass entry by its primary key
    const gatePassToDelete = await GatePass.findByPk(id);

    if (!gatePassToDelete) {
      return res.status(404).json({
        message: `Gate Pass entry with ID ${id} not found`,
      });
    }

    // Set updatedBy and deletedBy
    gatePassToDelete.updatedBy = deletedBy;
    gatePassToDelete.deletedBy = deletedBy;

    // Save the updates before soft deleting
    await gatePassToDelete.save();

    // Soft delete the gate pass entry (sets deletedAt timestamp if paranoid: true)
    await gatePassToDelete.destroy();

    broadcastMessage({
      type: "DELETED_GATE_PASS",
      data: gatePassToDelete.id,
    });

    res.status(200).json({
      message: "Gate Pass entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gate pass entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createGatePassController,
  getGatePassesController,
  updateGatePassController,
  deleteGatePassController,
};
