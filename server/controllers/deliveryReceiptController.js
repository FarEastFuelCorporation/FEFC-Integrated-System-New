// controllers/deliveryReceiptController.js

const generateDeliveryReceiptNumber = require("../utils/generateDeliveryReceiptNumber");
const DeliveryReceipt = require("../models/DeliveryReceipt");
const Employee = require("../models/Employee");
const { broadcastMessage } = require("../websocketManager");
const DeliveryReceiptItem = require("../models/DeliveryReceiptItem");

// Create Delivery Receipt controller
async function createDeliveryReceiptController(req, res) {
  try {
    const {
      dateOfDelivery,
      company,
      address,
      driver,
      plateNumber,
      remarks,
      items,
      createdBy,
    } = req.body;

    const deliveryReceiptNo = await generateDeliveryReceiptNumber();

    // Create the main DeliveryReceipt record
    const newEntry = await DeliveryReceipt.create({
      deliveryReceiptNo,
      dateOfDelivery,
      company: company?.toUpperCase() || "",
      address: address?.toUpperCase() || "",
      plateNumber: plateNumber?.toUpperCase() || "",
      driver: driver?.toUpperCase() || "",
      remarks: remarks?.toUpperCase() || "",
      createdBy,
    });

    // Create associated DeliveryReceiptItems if any
    if (Array.isArray(items) && items.length > 0) {
      const formattedItems = items.map((item) => ({
        deliveryReceiptId: newEntry.id,
        description: item.description?.toUpperCase() || "",
        quantity: item.quantity || "",
        unit: item.unit || "",
      }));

      await DeliveryReceiptItem.bulkCreate(formattedItems);
    }

    // Fetch the newly created DeliveryReceipt along with Employee and DeliveryReceiptItems
    const fullData = await DeliveryReceipt.findByPk(newEntry.id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: DeliveryReceiptItem,
          as: "DeliveryReceiptItem",
        },
      ],
    });

    // Broadcast the new gate pass to connected clients
    broadcastMessage({
      type: "NEW_DELIVERY_RECEIPT",
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

// Get Delivery Receipts controller
async function getDeliveryReceiptsController(req, res) {
  try {
    // Fetch all gatePasses from the database
    const deliveryReceipts = await DeliveryReceipt.findAll({
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: DeliveryReceiptItem,
          as: "DeliveryReceiptItem",
        },
      ],
      order: [
        ["createdAt", "DESC"], // Primary sort
      ],
    });

    res.json({ deliveryReceipts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Delivery Receipt controller
async function updateDeliveryReceiptController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Delivery Receipt entry with ID:", id);

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

    const existingEntry = await DeliveryReceipt.findByPk(id);

    if (!existingEntry) {
      return res.status(404).json({
        message: `Delivery Receipt with ID ${id} not found`,
      });
    }

    // Update main DeliveryReceipt fields
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

    // Handle DeliveryReceiptItems update (delete old, insert new)
    if (Array.isArray(items)) {
      await DeliveryReceiptItem.destroy({ where: { gatePassId: id } });

      const formattedItems = items.map((item) => ({
        gatePassId: id,
        description: item.description?.toUpperCase() || "",
        quantity: item.quantity || "",
        unit: item.unit || "",
      }));

      await DeliveryReceiptItem.bulkCreate(formattedItems);
    }

    // Fetch the updated DeliveryReceipt with relations
    const updatedData = await DeliveryReceipt.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "Employee",
          attributes: ["firstName", "lastName"],
        },
        {
          model: DeliveryReceiptItem,
          as: "DeliveryReceiptItem",
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

// Delete Delivery Receipt Controller
async function deleteDeliveryReceiptController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting gate pass record with ID:", id);

    // Find the gate pass entry by its primary key
    const gatePassToDelete = await DeliveryReceipt.findByPk(id);

    if (!gatePassToDelete) {
      return res.status(404).json({
        message: `Delivery Receipt entry with ID ${id} not found`,
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
      message: "Delivery Receipt entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gate pass entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createDeliveryReceiptController,
  getDeliveryReceiptsController,
  updateDeliveryReceiptController,
  deleteDeliveryReceiptController,
};
