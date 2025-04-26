// controllers/pttController.js

const Client = require("../models/Client");
const PTT = require("../models/PTT");
const PTTWaste = require("../models/PTTWaste");
const PTTWasteLog = require("../models/PTTWasteLog");
const TypeOfWaste = require("../models/TypeOfWaste");
const { broadcastMessage } = require("../websocketManager");

// Create PTT controller
async function createPTTController(req, res) {
  try {
    const { clientId, ptt, approvedDate, remarks, wastes, createdBy } =
      req.body;

    // Create main record
    const newEntry = await PTT.create({
      clientId,
      ptt: ptt?.toUpperCase() || null,
      approvedDate,
      remarks: remarks?.toUpperCase() || null,
      createdBy,
    });

    // Create associated wastes
    if (Array.isArray(wastes) && wastes.length > 0) {
      const formattedWastes = wastes.map((waste) => ({
        pttId: newEntry.id,
        wasteId: waste.wasteId,
        quantity: waste.quantity || 0,
      }));

      await PTTWaste.bulkCreate(formattedWastes);
    }

    // Fetch updated record with associations
    const pttData = await PTT.findByPk(newEntry.id, {
      include: [
        {
          model: PTTWaste,
          as: "PTTWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteDescription"],
            },
            {
              model: PTTWasteLog,
              as: "PTTWasteLog",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
      ],
    });

    if (!pttData) {
      return; // or handle the case if not found
    }

    // Calculate quantity and quantityTreated
    let quantity = 0;
    let quantityTreated = 0;

    pttData.PTTWaste.forEach((waste) => {
      quantity += waste.quantity || 0;

      if (Array.isArray(waste.PTTWasteLog)) {
        waste.PTTWasteLog.forEach((log) => {
          quantityTreated += log.quantityTreated || 0;
        });
      }
    });

    // Make a plain object and attach the computed fields
    const formattedPTT = {
      ...pttData.toJSON(),
      quantity,
      quantityTreated,
    };

    // Optional: broadcast message
    broadcastMessage({
      type: "NEW_PTT",
      data: formattedPTT,
    });

    // Respond to client
    res.status(201).json({
      message: "Waste form created successfully",
      data: formattedPTT,
    });
  } catch (error) {
    console.error("Error creating waste form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get PTTs controller
async function getPTTsController(req, res) {
  try {
    // Fetch all PTTs from the database
    const ptts = await PTT.findAll({
      include: [
        {
          model: PTTWaste,
          as: "PTTWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteDescription"],
            },
            {
              model: PTTWasteLog,
              as: "PTTWasteLog",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Map over the ptts to add quantity and quantityTreated
    const formattedPTTs = ptts.map((ptt) => {
      let quantity = 0;
      let quantityTreated = 0;

      ptt.PTTWaste.forEach((waste) => {
        quantity += waste.quantity || 0;

        if (Array.isArray(waste.PTTWasteLog)) {
          waste.PTTWasteLog.forEach((log) => {
            quantityTreated += log.quantity || 0;
          });
        }
      });

      return {
        ...ptt.toJSON(), // make it plain object
        quantity,
        quantityTreated,
      };
    });

    res.json({ ptts: formattedPTTs });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update PTT controller
async function updatePTTController(req, res) {
  try {
    const { id } = req.params;
    const { clientId, ptt, approvedDate, remarks, wastes, createdBy } =
      req.body;

    const existingPTT = await PTT.findByPk(id);
    if (!existingPTT) {
      return res.status(404).json({ message: "PTT not found." });
    }

    // Update main PTT record
    await existingPTT.update({
      clientId,
      ptt: ptt?.toUpperCase() || null,
      approvedDate,
      remarks: remarks?.toUpperCase() || null,
      createdBy,
    });

    // Fetch current waste records for comparison
    const existingWastes = await PTTWaste.findAll({
      where: { pttId: existingPTT.id },
    });

    const incomingWasteIds = wastes.map((w) => w.wasteId);

    // Delete wastes that are no longer present
    const wastesToDelete = existingWastes.filter(
      (w) => !incomingWasteIds.includes(w.wasteId)
    );

    await Promise.all(wastesToDelete.map((w) => w.destroy()));

    // Add or update current wastes
    for (const waste of wastes) {
      const existing = existingWastes.find((w) => w.wasteId === waste.wasteId);

      if (existing) {
        await existing.update({ quantity: waste.quantity });
      } else {
        await PTTWaste.create({
          pttId: existingPTT.id,
          wasteId: waste.wasteId,
          quantity: waste.quantity || 0,
        });
      }
    }

    // Fetch updated record with associations
    const pttData = await PTT.findByPk(id, {
      include: [
        {
          model: PTTWaste,
          as: "PTTWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteDescription"],
            },
            {
              model: PTTWasteLog,
              as: "PTTWasteLog",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
          attributes: ["clientName"],
        },
      ],
    });

    if (!pttData) {
      return; // or handle the case if not found
    }

    // Calculate quantity and quantityTreated
    let quantity = 0;
    let quantityTreated = 0;

    pttData.PTTWaste.forEach((waste) => {
      quantity += waste.quantity || 0;

      if (Array.isArray(waste.PTTWasteLog)) {
        waste.PTTWasteLog.forEach((log) => {
          quantityTreated += log.quantityTreated || 0;
        });
      }
    });

    // Make a plain object and attach the computed fields
    const formattedPTT = {
      ...pttData.toJSON(),
      quantity,
      quantityTreated,
    };

    // Broadcast single updated PTT
    broadcastMessage({
      type: "UPDATED_PTT",
      data: formattedPTT,
    });

    res.status(200).json({
      message: "Waste form updated successfully",
      data: formattedPTT,
    });
  } catch (error) {
    console.error("Error updating waste form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete PTT controller
async function deletePTTController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting PTT with ID:", id);

    // Find the PTT by ID
    const PTTToDelete = await PTT.findByPk(id, {
      include: [
        {
          model: PTTWaste,
          as: "PTTWaste",
        },
      ],
    });

    if (PTTToDelete) {
      // Set deletedBy and updatedBy
      PTTToDelete.updatedBy = deletedBy;
      PTTToDelete.deletedBy = deletedBy;
      await PTTToDelete.save();

      // Soft delete associated PTTWaste entries
      if (PTTToDelete.PTTWaste && PTTToDelete.PTTWaste.length > 0) {
        for (const waste of PTTToDelete.PTTWaste) {
          waste.updatedBy = deletedBy;
          waste.deletedBy = deletedBy;
          await waste.save();
          await waste.destroy(); // soft delete (if paranoid is enabled)
        }
      }

      // Soft delete the PTT
      await PTTToDelete.destroy();

      broadcastMessage({
        type: "DELETED_PTT",
        data: PTTToDelete.id,
      });

      res.json({
        message: `PTT with ID ${id} and its associated wastes soft-deleted successfully`,
      });
    } else {
      res.status(404).json({ message: `PTT with ID ${id} not found` });
    }
  } catch (error) {
    console.error("Error soft-deleting PTT:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getPTTsController,
  createPTTController,
  updatePTTController,
  deletePTTController,
};
